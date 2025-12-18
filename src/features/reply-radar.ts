import { getNeynarClient, withRetry } from '../core/neynar-client.js';
import type { FeedResponse } from '@neynar/nodejs-sdk/build/neynar-api/v2';

/**
 * Engagement opportunity score
 */
export interface EngagementOpportunity {
  castHash: string;
  author: {
    fid: number;
    username: string;
    displayName?: string;
  };
  text: string;
  timestamp: string;
  engagementScore: number;
  reasons: string[];
  replyCount: number;
  likeCount: number;
  recastCount: number;
  farcasterUrl: string;
}

/**
 * Options for finding engagement opportunities
 */
export interface ReplyRadarOptions {
  limit?: number;
  minScore?: number;
  maxResults?: number;
}

/**
 * Scores a cast for engagement potential
 * @param cast Cast to score
 * @returns Engagement score (0-100)
 */
function scoreCast(cast: any): number {
  const replies = cast.replies?.count || 0;
  const likes = cast.reactions?.likes?.length || 0;
  const recasts = cast.reactions?.recasts?.length || 0;

  // Engagement velocity: replies weighted highest (conversation quality)
  // Formula: likes + (replies × 2) + (recasts × 3)
  // This prioritizes conversation over vanity metrics
  const baseScore = likes + (replies * 2) + (recasts * 3);

  // Time decay: recent casts score higher
  const castTime = new Date(cast.timestamp).getTime();
  const now = Date.now();
  const hoursAgo = (now - castTime) / (1000 * 60 * 60);
  const timeDecay = Math.max(0, 1 - hoursAgo / 48); // Decay over 48 hours

  // Thread depth bonus: casts with replies indicate active conversation
  const threadBonus = replies > 0 ? 10 : 0;

  return Math.round((baseScore * timeDecay) + threadBonus);
}

/**
 * Finds engagement opportunities in your following feed
 * @param fid Your Farcaster ID
 * @param options Options for filtering
 * @returns Array of engagement opportunities, sorted by score
 */
export async function findEngagementOpportunities(
  fid: number,
  options: ReplyRadarOptions = {}
): Promise<EngagementOpportunity[]> {
  const client = getNeynarClient();
  const {
    limit = 50,
    minScore = 5,
    maxResults = 5,
  } = options;

  console.log(`Finding engagement opportunities for FID ${fid}...`);

  // Fetch following feed
  const feed = await withRetry(async () => {
    return await client.fetchFeed('following', {
      fid,
      limit,
    });
  });

  console.log(`Fetched ${feed.casts.length} casts from following feed`);

  // Score and filter casts
  const opportunities: EngagementOpportunity[] = [];

  for (const cast of feed.casts) {
    const score = scoreCast(cast);

    if (score >= minScore) {
      const replies = cast.replies?.count || 0;
      const likes = cast.reactions?.likes?.length || 0;
      const recasts = cast.reactions?.recasts?.length || 0;

      // Generate reasons why this is a good opportunity
      const reasons: string[] = [];
      if (replies > 0) {
        reasons.push(`Active conversation (${replies} replies)`);
      }
      if (replies > 5) {
        reasons.push('High engagement thread');
      }
      if (likes > 10) {
        reasons.push('Well-received cast');
      }
      if (recasts > 5) {
        reasons.push('Widely shared');
      }
      if (reasons.length === 0) {
        reasons.push('Early engagement opportunity');
      }

      opportunities.push({
        castHash: cast.hash,
        author: {
          fid: cast.author.fid,
          username: cast.author.username,
          displayName: cast.author.display_name,
        },
        text: cast.text,
        timestamp: cast.timestamp,
        engagementScore: score,
        reasons,
        replyCount: replies,
        likeCount: likes,
        recastCount: recasts,
        farcasterUrl: `https://warpcast.com/~/conversations/${cast.hash}`,
      });
    }
  }

  // Sort by score (highest first) and limit results
  opportunities.sort((a, b) => b.engagementScore - a.engagementScore);
  const topOpportunities = opportunities.slice(0, maxResults);

  console.log(`Found ${topOpportunities.length} engagement opportunities`);

  return topOpportunities;
}
