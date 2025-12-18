import { getNeynarClient, withRetry } from '../core/neynar-client.js';
import { createFeedLogArtifact } from '../vault/artifacts.js';
import type { FeedResponse } from '@neynar/nodejs-sdk/build/neynar-api/v2';

/**
 * Options for fetching the following feed
 */
export interface FetchFollowingFeedOptions {
  limit?: number;
  cursor?: string;
}

/**
 * Result of fetching the following feed
 */
export interface FetchFollowingFeedResult {
  feed: FeedResponse;
  artifactPath: string;
}

/**
 * Fetches the following feed for a given FID
 * @param fid Farcaster ID to fetch feed for
 * @param options Fetch options (limit, cursor)
 * @returns Feed data and artifact path
 */
export async function fetchFollowingFeed(
  fid: number,
  options: FetchFollowingFeedOptions = {}
): Promise<FetchFollowingFeedResult> {
  const client = getNeynarClient();
  const { limit = 25, cursor } = options;

  console.log(`Fetching following feed for FID ${fid}...`);

  const feed = await withRetry(async () => {
    return await client.fetchFeed('following', {
      fid,
      limit,
      cursor,
    });
  });

  console.log(`Fetched ${feed.casts.length} casts from following feed`);

  // Create artifact
  const artifactPath = await createFeedLogArtifact(feed, fid);

  console.log(`Feed log saved to: ${artifactPath}`);

  return {
    feed,
    artifactPath,
  };
}

/**
 * Fetches multiple pages of the following feed
 * @param fid Farcaster ID to fetch feed for
 * @param maxPages Maximum number of pages to fetch
 * @param pageSize Number of items per page
 * @returns Array of feed responses
 */
export async function fetchFollowingFeedPaginated(
  fid: number,
  maxPages: number = 1,
  pageSize: number = 25
): Promise<FeedResponse[]> {
  const feeds: FeedResponse[] = [];
  let cursor: string | undefined;
  let page = 0;

  while (page < maxPages) {
    const result = await fetchFollowingFeed(fid, {
      limit: pageSize,
      cursor,
    });

    feeds.push(result.feed);
    cursor = result.feed.next?.cursor;
    page++;

    // Stop if there's no next page
    if (!cursor) {
      break;
    }

    // Small delay between pages
    if (page < maxPages && cursor) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return feeds;
}
