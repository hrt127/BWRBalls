#!/usr/bin/env node

import { fetchFollowingFeed } from '../features/feed-fetcher.js';
import { getConfig } from '../core/config.js';

/**
 * CLI script for Step 1: Fetch Following Feed
 * Usage: npm run step1
 */
async function main() {
  try {
    const config = getConfig();
    
    console.log('=== Step 1: Fetch Following Feed ===\n');
    console.log(`FID: ${config.fid}`);
    console.log(`Vault Path: ${config.vaultPath}\n`);

    const result = await fetchFollowingFeed(config.fid, {
      limit: 25,
    });

    console.log('\n✅ Feed fetched successfully!');
    console.log(`   Artifact: ${result.artifactPath}`);
    console.log(`   Casts: ${result.feed.casts.length}`);
    
    if (result.feed.next?.cursor) {
      console.log(`   Next cursor: ${result.feed.next.cursor}`);
      console.log('\n💡 Tip: Use pagination to fetch more results');
    }

  } catch (error) {
    console.error('\n❌ Error fetching feed:', error);
    process.exit(1);
  }
}

main();
