import { getKnowledgeLibrary } from '../knowledge/library.js';
import type { KnowledgeEntry } from '../knowledge/library.js';

/**
 * Detected reference in cast text
 */
export interface DetectedReference {
  type: 'person' | 'feature' | 'culture' | 'topic' | 'channel' | 'tool' | 'unknown';
  text: string;
  knowledge?: KnowledgeEntry;
  confidence: number;
}

/**
 * Context analysis result
 */
export interface ContextAnalysis {
  castHash: string;
  detectedReferences: DetectedReference[];
  needsExplanation: boolean;
  suggestedContext: string[];
}

/**
 * Common patterns to detect in casts
 */
const DETECTION_PATTERNS = {
  culture: [
    /\bgm\b/gi,
    /\bwagmi\b/gi,
    /\bngmi\b/gi,
    /\bfrens\b/gi,
    /\bdegen\b/gi,
  ],
  tools: [
    /@harmonybot/gi,
    /\bharmony\s+bot\b/gi,
    /@bankr/gi,
    /\bbankr\b/gi,
    /\bnyor\b/gi,
    /\bemerge\b/gi,
  ],
  features: [
    /\bmini\s+app\b/gi,
    /\bframe\b/gi,
    /\bframes\b/gi,
    /\bbase\s+app\b/gi,
    /\bcoinbase\b/gi,
  ],
  channels: [
    /\/[a-z-]+/g, // Channel references like /farcaster
  ],
};

/**
 * Analyzes a cast for context needs
 * @param castText Text content of the cast
 * @param castHash Cast hash for reference
 * @returns Context analysis
 */
export function analyzeContext(
  castText: string,
  castHash: string
): ContextAnalysis {
  const library = getKnowledgeLibrary();
  const detectedReferences: DetectedReference[] = [];

  // Detect cultural references
  for (const pattern of DETECTION_PATTERNS.culture) {
    const matches = castText.match(pattern);
    if (matches) {
      for (const match of matches) {
        const searchResults = library.search(match.toLowerCase());
        if (searchResults.length > 0) {
          detectedReferences.push({
            type: 'culture',
            text: match,
            knowledge: searchResults[0],
            confidence: 0.9,
          });
        } else {
          detectedReferences.push({
            type: 'culture',
            text: match,
            confidence: 0.5,
          });
        }
      }
    }
  }

  // Detect tool references
  for (const pattern of DETECTION_PATTERNS.tools) {
    const matches = castText.match(pattern);
    if (matches) {
      for (const match of matches) {
        const searchResults = library.search(match.toLowerCase());
        if (searchResults.length > 0) {
          detectedReferences.push({
            type: 'tool',
            text: match,
            knowledge: searchResults[0],
            confidence: 0.9,
          });
        } else {
          detectedReferences.push({
            type: 'tool',
            text: match,
            confidence: 0.5,
          });
        }
      }
    }
  }

  // Detect feature references
  for (const pattern of DETECTION_PATTERNS.features) {
    const matches = castText.match(pattern);
    if (matches) {
      for (const match of matches) {
        detectedReferences.push({
          type: 'feature',
          text: match,
          confidence: 0.7,
        });
      }
    }
  }

  // Detect channel references
  for (const pattern of DETECTION_PATTERNS.channels) {
    const matches = castText.match(pattern);
    if (matches) {
      for (const match of matches) {
        detectedReferences.push({
          type: 'channel',
          text: match,
          confidence: 0.8,
        });
      }
    }
  }

  // Remove duplicates
  const uniqueReferences = detectedReferences.filter(
    (ref, index, self) =>
      index === self.findIndex((r) => r.text.toLowerCase() === ref.text.toLowerCase())
  );

  // Generate suggested context
  const suggestedContext: string[] = [];
  for (const ref of uniqueReferences) {
    if (ref.knowledge) {
      suggestedContext.push(`${ref.text}: ${ref.knowledge.explanation}`);
      if (ref.knowledge.whyMatters) {
        suggestedContext.push(`Why it matters: ${ref.knowledge.whyMatters}`);
      }
    } else {
      suggestedContext.push(`${ref.text}: [Context needed - not in knowledge library yet]`);
    }
  }

  return {
    castHash,
    detectedReferences: uniqueReferences,
    needsExplanation: uniqueReferences.length > 0,
    suggestedContext,
  };
}
