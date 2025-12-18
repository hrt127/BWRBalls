import { getNeynarClient, withRetry } from '../core/neynar-client.js';
import { createProfileCardArtifact } from '../vault/artifacts.js';
import type { ProfileCardData } from '../vault/templates.js';

/**
 * Result of fetching profile data
 */
export interface FetchProfileDataResult {
  profile: ProfileCardData;
  artifactPath: string;
}

/**
 * Fetches profile data for a given FID
 * @param fid Farcaster ID to fetch profile for
 * @returns Profile data and artifact path
 */
export async function fetchProfileData(fid: number): Promise<FetchProfileDataResult> {
  const client = getNeynarClient();

  console.log(`Fetching profile data for FID ${fid}...`);

  const user = await withRetry(async () => {
    const response = await client.lookupUserByFid(fid);
    return response.result.user;
  });

  const profile: ProfileCardData = {
    fid: user.fid,
    username: user.username,
    displayName: user.display_name || undefined,
    followerCount: user.follower_count,
    followingCount: user.following_count,
    bio: user.profile?.bio?.text || undefined,
    pfpUrl: user.pfp?.url || undefined,
    timestamp: new Date().toISOString(),
  };

  console.log(`Profile fetched: @${profile.username} (${profile.followerCount} followers)`);

  // Create artifact
  const artifactPath = await createProfileCardArtifact(profile);

  console.log(`Profile card saved to: ${artifactPath}`);

  return {
    profile,
    artifactPath,
  };
}

/**
 * Fetches profile data for multiple FIDs
 * @param fids Array of Farcaster IDs
 * @returns Array of profile data results
 */
export async function fetchMultipleProfiles(
  fids: number[]
): Promise<FetchProfileDataResult[]> {
  const results: FetchProfileDataResult[] = [];

  for (const fid of fids) {
    try {
      const result = await fetchProfileData(fid);
      results.push(result);

      // Small delay between requests
      if (fids.indexOf(fid) < fids.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(`Failed to fetch profile for FID ${fid}:`, error);
      // Continue with other profiles
    }
  }

  return results;
}
