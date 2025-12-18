#!/usr/bin/env node

import { fetchProfileData } from '../features/profile-fetcher.js';
import { getConfig } from '../core/config.js';

/**
 * CLI script for Step 2: Fetch Profile Data
 * Usage: npm run step2
 */
async function main() {
  try {
    const config = getConfig();
    
    console.log('=== Step 2: Fetch Profile Data ===\n');
    console.log(`FID: ${config.fid}`);
    console.log(`Vault Path: ${config.vaultPath}\n`);

    const result = await fetchProfileData(config.fid);

    console.log('\n✅ Profile fetched successfully!');
    console.log(`   Username: @${result.profile.username}`);
    console.log(`   Display Name: ${result.profile.displayName || 'N/A'}`);
    console.log(`   Followers: ${result.profile.followerCount?.toLocaleString() || 'N/A'}`);
    console.log(`   Following: ${result.profile.followingCount?.toLocaleString() || 'N/A'}`);
    console.log(`   Artifact: ${result.artifactPath}`);

  } catch (error) {
    console.error('\n❌ Error fetching profile:', error);
    process.exit(1);
  }
}

main();
