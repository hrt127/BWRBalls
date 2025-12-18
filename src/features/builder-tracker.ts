import { getNeynarClient, withRetry } from '../core/neynar-client.js';

/**
 * Builder activity classification
 */
export type BuilderPhase = 'building' | 'trading' | 'both' | 'unknown';

/**
 * Onchain activity pattern
 */
export interface OnchainPattern {
  accumulation: boolean;
  distribution: boolean;
  projectDeployments: string[]; // Contract addresses
  tokenActivity: Array<{
    token: string;
    action: 'buy' | 'sell' | 'hold';
    amount?: string;
    timestamp: string;
  }>;
}

/**
 * Social activity pattern
 */
export interface SocialActivity {
  recentTopics: string[];
  engagementPatterns: Array<{
    type: 'cast' | 'reply' | 'recast';
    frequency: number;
    channels: string[];
  }>;
  projectAnnouncements: string[]; // Cast hashes
}

/**
 * Builder timeline analysis
 */
export interface BuilderTimeline {
  buildingPhase: boolean;
  tradingPhase: boolean;
  averageBuyerAlignment: 'aligned' | 'misaligned' | 'unknown';
  notes: string[];
}

/**
 * Builder activity data
 */
export interface BuilderActivity {
  fid: number;
  username: string;
  displayName?: string;
  classification: 'builder' | 'power-player' | 'unknown';
  onchainPatterns?: OnchainPattern;
  socialActivity?: SocialActivity;
  timeline?: BuilderTimeline;
  lastUpdated: string;
}

/**
 * Options for tracking builder activity
 */
export interface BuilderTrackerOptions {
  checkOnchain?: boolean;
  daysBack?: number;
  minActivity?: number;
}

/**
 * Tracks builder/power player activity
 * @param fid Farcaster ID to track
 * @param options Tracking options
 * @returns Builder activity data
 */
export async function trackBuilderActivity(
  fid: number,
  options: BuilderTrackerOptions = {}
): Promise<BuilderActivity> {
  const {
    checkOnchain = false,
    daysBack = 30,
    minActivity = 5,
  } = options;

  const client = getNeynarClient();

  // Fetch user profile
  const user = await withRetry(async () => {
    const response = await client.lookupUserByFid(fid);
    return response.result.user;
  });

  // Fetch recent casts
  const casts = await withRetry(async () => {
    return await client.fetchCastsForUser(fid, {
      limit: 50,
    });
  });

  // Analyze social activity
  const recentTopics: string[] = [];
  const projectAnnouncements: string[] = [];
  
  // Extract topics and announcements from casts
  for (const cast of casts.result.casts) {
    // Simple topic extraction (can be enhanced)
    const words = cast.text.toLowerCase().split(/\s+/);
    const keywords = ['deploy', 'launch', 'build', 'project', 'token', 'nft', 'app', 'frame'];
    
    for (const keyword of keywords) {
      if (words.some(w => w.includes(keyword))) {
        if (!recentTopics.includes(keyword)) {
          recentTopics.push(keyword);
        }
      }
    }

    // Check for project announcements
    if (cast.text.match(/launch|deploy|announce/i)) {
      projectAnnouncements.push(cast.hash);
    }
  }

  const socialActivity: SocialActivity = {
    recentTopics: recentTopics.slice(0, 10),
    engagementPatterns: [], // TODO: Analyze engagement patterns
    projectAnnouncements,
  };

  // Onchain patterns (placeholder - requires onchain integration)
  const onchainPatterns: OnchainPattern | undefined = checkOnchain ? {
    accumulation: false, // TODO: Check onchain for accumulation
    distribution: false, // TODO: Check onchain for distribution
    projectDeployments: [], // TODO: Check for deployed contracts
    tokenActivity: [], // TODO: Analyze token transactions
  } : undefined;

  // Timeline analysis
  const timeline: BuilderTimeline = {
    buildingPhase: projectAnnouncements.length > 0 || recentTopics.some(t => ['build', 'deploy', 'launch'].includes(t)),
    tradingPhase: false, // TODO: Detect trading patterns
    averageBuyerAlignment: 'unknown', // TODO: Analyze alignment
    notes: [],
  };

  // Classification
  let classification: 'builder' | 'power-player' | 'unknown' = 'unknown';
  if (projectAnnouncements.length > 0 || timeline.buildingPhase) {
    classification = 'builder';
  } else if (user.follower_count > 1000) {
    classification = 'power-player';
  }

  return {
    fid,
    username: user.username,
    displayName: user.display_name || undefined,
    classification,
    onchainPatterns,
    socialActivity,
    timeline,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Tracks multiple builders
 * @param fids Array of Farcaster IDs
 * @param options Tracking options
 * @returns Array of builder activity data
 */
export async function trackMultipleBuilders(
  fids: number[],
  options: BuilderTrackerOptions = {}
): Promise<BuilderActivity[]> {
  const results: BuilderActivity[] = [];

  for (const fid of fids) {
    try {
      const activity = await trackBuilderActivity(fid, options);
      results.push(activity);
      
      // Small delay to avoid rate limiting
      if (fids.indexOf(fid) < fids.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Failed to track builder ${fid}:`, error);
      // Continue with other builders
    }
  }

  return results;
}
