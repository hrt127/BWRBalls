import { getNeynarClient, withRetry } from '../core/neynar-client.js';
import { getConfig } from '../core/config.js';

/**
 * Following analysis result
 */
export interface FollowingAnalysis {
  fid: number;
  username: string;
  displayName?: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  pfpUrl?: string;
  verifiedAddresses?: string[];
  whyFollow: string[]; // Reasons why this person is worth following
  classification?: 'builder' | 'creator' | 'trader' | 'power-player' | 'community' | 'unknown';
  lastActive?: string;
}

/**
 * Options for analyzing following
 */
export interface AnalyzeFollowingOptions {
  limit?: number;
  minFollowers?: number;
  includeReasons?: boolean;
}

/**
 * Analyzes why you're following someone
 * @param user User profile data
 * @returns Array of reasons
 */
function analyzeWhyFollow(user: any): string[] {
  const reasons: string[] = [];

  // High follower count = influential
  if (user.follower_count > 1000) {
    reasons.push(`Influential (${user.follower_count.toLocaleString()} followers)`);
  }

  // Verified addresses = onchain activity
  if (user.verified_addresses?.eth_addresses?.length > 0) {
    reasons.push('Onchain activity (verified addresses)');
  }

  // Bio analysis
  const bio = (user.profile?.bio?.text || '').toLowerCase();

  if (bio.includes('builder') || bio.includes('build') || bio.includes('dev') || bio.includes('developer')) {
    reasons.push('Builder/Developer');
  }
  if (bio.includes('founder') || bio.includes('co-founder') || bio.includes('cofounder')) {
    reasons.push('Founder');
  }
  if (bio.includes('artist') || bio.includes('creator') || bio.includes('design') || bio.includes('creative')) {
    reasons.push('Creator/Artist');
  }
  if (bio.includes('trading') || bio.includes('trader') || bio.includes('degen')) {
    reasons.push('Trader');
  }
  if (bio.includes('farcaster') || bio.includes('fc') || bio.includes('warpcast')) {
    reasons.push('Farcaster community');
  }

  // If no specific reasons found, add generic ones
  if (reasons.length === 0) {
    if (user.follower_count > 100) {
      reasons.push('Active community member');
    } else {
      reasons.push('Following for context');
    }
  }

  return reasons;
}

/**
 * Analyzes your following list
 * @param fid Your Farcaster ID
 * @param options Analysis options
 * @returns Array of following analysis results
 */
export async function analyzeFollowing(
  fid: number,
  options: AnalyzeFollowingOptions = {}
): Promise<FollowingAnalysis[]> {
  const client = getNeynarClient();
  const {
    limit = 100,
    minFollowers = 0,
    includeReasons = true,
  } = options;

  console.log(`Analyzing following list for FID ${fid}...`);

  // Fetch following list
  const followingResponse = await withRetry(async () => {
    return await client.fetchUserFollowing({
      fid,
      limit,
    });
  });

  const following = followingResponse.result.users || [];
  console.log(`Fetched ${following.length} users you're following`);

  // Analyze each user
  const results: FollowingAnalysis[] = [];

  for (const user of following) {
    // Filter by minimum followers if specified
    if (user.follower_count < minFollowers) {
      continue;
    }

    const whyFollow = includeReasons ? analyzeWhyFollow(user) : [];

    // Determine classification
    const bio = (user.profile?.bio?.text || '').toLowerCase();
    let classification: FollowingAnalysis['classification'] = 'unknown';

    if (bio.includes('builder') || bio.includes('dev') || bio.includes('engineer') || bio.includes('developer')) {
      classification = 'builder';
    } else if (bio.includes('artist') || bio.includes('creator') || bio.includes('design') || bio.includes('creative')) {
      classification = 'creator';
    } else if (bio.includes('trading') || bio.includes('trader') || bio.includes('degen') || bio.includes('crypto')) {
      classification = 'trader';
    } else if (user.follower_count > 5000) {
      classification = 'power-player';
    } else if (bio.includes('community') || bio.includes('mod') || bio.includes('admin')) {
      classification = 'community';
    }

    results.push({
      fid: user.fid,
      username: user.username,
      displayName: user.display_name || undefined,
      bio: user.profile?.bio?.text || undefined,
      followerCount: user.follower_count,
      followingCount: user.following_count,
      pfpUrl: user.pfp?.url || undefined,
      verifiedAddresses: user.verified_addresses?.eth_addresses || undefined,
      whyFollow,
      classification,
      lastActive: user.custody_address ? undefined : new Date().toISOString(), // If no custody, might be active
    });
  }

  // Sort by follower count (most influential first)
  results.sort((a, b) => b.followerCount - a.followerCount);

  console.log(`Analyzed ${results.length} users (filtered from ${following.length})`);

  return results;
}

/**
 * Gets your best follows (top influencers, builders, creators)
 * @param fid Your Farcaster ID
 * @param options Analysis options
 * @returns Sorted list of best follows
 */
export async function getBestFollows(
  fid: number,
  options: AnalyzeFollowingOptions & { topN?: number } = {}
): Promise<FollowingAnalysis[]> {
  const { topN = 20, ...analysisOptions } = options;

  const allFollowing = await analyzeFollowing(fid, {
    ...analysisOptions,
    minFollowers: analysisOptions.minFollowers || 50, // Default: at least 50 followers
  });

  // Prioritize: builders, creators, power-players
  const prioritized = allFollowing.sort((a, b) => {
    // Classification priority
    const priority: Record<string, number> = {
      'builder': 5,
      'creator': 4,
      'power-player': 3,
      'community': 2,
      'trader': 1,
      'unknown': 0,
    };

    const aPriority = priority[a.classification || 'unknown'];
    const bPriority = priority[b.classification || 'unknown'];

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    // Then by follower count
    return b.followerCount - a.followerCount;
  });

  return prioritized.slice(0, topN);
}
