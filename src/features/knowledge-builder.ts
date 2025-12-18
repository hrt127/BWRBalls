import { getKnowledgeLibrary, type KnowledgeEntry } from '../knowledge/library.js';
import type { FeedResponse } from '@neynar/nodejs-sdk/build/neynar-api/v2';

/**
 * Options for building knowledge from casts
 */
export interface KnowledgeBuilderOptions {
  minMentions?: number; // Minimum mentions to create entry
  confidenceThreshold?: number; // Minimum confidence to save
  updateExisting?: boolean; // Update existing entries
}

/**
 * Extracts potential knowledge from a cast
 * @param cast Cast to analyze
 * @returns Array of potential knowledge entries
 */
function extractKnowledgeFromCast(cast: any): Partial<KnowledgeEntry>[] {
  const entries: Partial<KnowledgeEntry>[] = [];
  const text = cast.text.toLowerCase();

  // Detect tool mentions
  const toolMentions = [
    { pattern: /@harmonybot|harmony\s+bot/gi, id: 'harmony-bot' },
    { pattern: /@bankr|bankr\s+bot/gi, id: 'bankr' },
    { pattern: /\bnyor\b/gi, id: 'nyor' },
    { pattern: /\bemerge\b/gi, id: 'emerge' },
  ];

  for (const tool of toolMentions) {
    if (tool.pattern.test(cast.text)) {
      entries.push({
        id: tool.id,
        type: 'tool',
        title: tool.id,
        sources: [cast.hash],
      });
    }
  }

  // Detect feature mentions
  const featureMentions = [
    { pattern: /\bmini\s+app\b/gi, id: 'mini-apps' },
    { pattern: /\bframe\b/gi, id: 'frames' },
    { pattern: /\bbase\s+app\b/gi, id: 'base-app' },
  ];

  for (const feature of featureMentions) {
    if (feature.pattern.test(cast.text)) {
      entries.push({
        id: feature.id,
        type: 'feature',
        title: feature.id,
        sources: [cast.hash],
      });
    }
  }

  // Detect channel mentions
  const channelMatches = cast.text.match(/\/([a-z-]+)/g);
  if (channelMatches) {
    for (const match of channelMatches) {
      const channelName = match.slice(1); // Remove leading /
      entries.push({
        id: `channel-${channelName}`,
        type: 'channel',
        title: channelName,
        sources: [cast.hash],
      });
    }
  }

  return entries;
}

/**
 * Builds knowledge from a feed
 * @param feed Feed response to analyze
 * @param options Builder options
 * @returns Array of new/updated knowledge entries
 */
export async function buildKnowledgeFromFeed(
  feed: FeedResponse,
  options: KnowledgeBuilderOptions = {}
): Promise<KnowledgeEntry[]> {
  const {
    minMentions = 2,
    confidenceThreshold = 0.5,
    updateExisting = true,
  } = options;

  const library = getKnowledgeLibrary();
  const extracted: Map<string, Partial<KnowledgeEntry>> = new Map();

  // Extract knowledge from all casts
  for (const cast of feed.casts) {
    const entries = extractKnowledgeFromCast(cast);

    for (const entry of entries) {
      if (!entry.id) continue;

      const existing = extracted.get(entry.id);
      if (existing) {
        // Merge sources
        const sources = new Set([
          ...(existing.sources || []),
          ...(entry.sources || []),
        ]);
        existing.sources = Array.from(sources);
      } else {
        extracted.set(entry.id, {
          ...entry,
          sources: entry.sources || [],
        });
      }
    }
  }

  // Filter by minimum mentions
  const filtered = Array.from(extracted.values()).filter(
    entry => (entry.sources?.length || 0) >= minMentions
  );

  // Create or update knowledge entries
  const results: KnowledgeEntry[] = [];

  for (const partial of filtered) {
    if (!partial.id || !partial.type || !partial.title) continue;

    const existing = library.getEntry(partial.id);

    if (existing && updateExisting) {
      // Update existing entry
      const updated: KnowledgeEntry = {
        ...existing,
        sources: Array.from(new Set([...existing.sources, ...(partial.sources || [])])),
        lastUpdated: new Date().toISOString(),
      };
      library.addEntry(updated);
      results.push(updated);
    } else if (!existing) {
      // Create new entry
      const newEntry: KnowledgeEntry = {
        id: partial.id,
        type: partial.type as KnowledgeEntry['type'],
        title: partial.title,
        description: partial.description || `Mentioned in ${partial.sources?.length || 0} casts`,
        explanation: partial.explanation || 'Context needed - not yet explained',
        examples: partial.examples || [],
        sources: partial.sources || [],
        firstSeen: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        confidence: Math.min(1, (partial.sources?.length || 0) / 10), // More mentions = higher confidence
        related: partial.related || [],
      };
      library.addEntry(newEntry);
      results.push(newEntry);
    }
  }

  return results;
}

/**
 * Learns from daily feed and updates knowledge library
 * @param fid Farcaster ID to learn from
 * @param options Builder options
 * @returns Array of new/updated knowledge entries
 */
export async function learnFromFeed(
  fid: number,
  options: KnowledgeBuilderOptions = {}
): Promise<KnowledgeEntry[]> {
  const { getNeynarClient, withRetry } = await import('../core/neynar-client.js');
  const client = getNeynarClient();

  // Fetch following feed
  const feed = await withRetry(async () => {
    return await client.fetchFeed('following', {
      fid,
      limit: 100, // Get more casts for learning
    });
  });

  // Build knowledge from feed
  return buildKnowledgeFromFeed(feed, options);
}
