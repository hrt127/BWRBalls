#!/usr/bin/env node

import { analyzeFollowing, getBestFollows } from '../features/following-analyzer.js';
import { createFollowingArtifact } from '../vault/following-artifacts.js';
import { getConfig } from '../core/config.js';

/**
 * CLI script for analyzing following list
 * Usage:
 *   npm run analyze-following
 *   npm run analyze-following -- --limit 200 --min-followers 100 --top 30
 */
async function main() {
  const args = process.argv.slice(2);

  let limit: number = 100;
  let minFollowers: number = 50;
  let topN: number = 20;
  let bestOnly: boolean = false;

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && i + 1 < args.length) {
      limit = parseInt(args[i + 1], 10);
      if (isNaN(limit) || limit <= 0) {
        console.error('❌ Error: --limit must be a positive number');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--min-followers' && i + 1 < args.length) {
      minFollowers = parseInt(args[i + 1], 10);
      if (isNaN(minFollowers) || minFollowers < 0) {
        console.error('❌ Error: --min-followers must be a non-negative number');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--top' && i + 1 < args.length) {
      topN = parseInt(args[i + 1], 10);
      if (isNaN(topN) || topN <= 0) {
        console.error('❌ Error: --top must be a positive number');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--best-only') {
      bestOnly = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: npm run analyze-following [options]

Options:
  --limit <number>        Number of follows to analyze (default: 100)
  --min-followers <num>   Minimum followers to include (default: 50)
  --top <number>          Top N to show (default: 20)
  --best-only             Show only best follows (builders, creators, power-players)
  --help, -h              Show this help message

Examples:
  npm run analyze-following
  npm run analyze-following -- --limit 200 --min-followers 100 --top 30
  npm run analyze-following -- --best-only --top 50
      `);
      process.exit(0);
    }
  }

  try {
    const config = getConfig();

    console.log('=== Analyzing Following List ===\n');
    console.log(`FID: ${config.fid}`);
    console.log(`Limit: ${limit}`);
    console.log(`Min Followers: ${minFollowers}`);
    if (bestOnly) {
      console.log(`Top N: ${topN} (best only)`);
    }
    console.log();

    let results;

    if (bestOnly) {
      results = await getBestFollows(config.fid, {
        limit,
        minFollowers,
        topN,
        includeReasons: true,
      });
    } else {
      results = await analyzeFollowing(config.fid, {
        limit,
        minFollowers,
        includeReasons: true,
      });
      // Take top N
      results = results.slice(0, topN);
    }

    // Create artifact
    const artifactPath = await createFollowingArtifact(results, config.fid);

    // Print summary
    console.log('\n✅ Analysis complete!');
    console.log(`   Total analyzed: ${results.length}`);

    const byType: Record<string, number> = {};
    for (const result of results) {
      const type = result.classification || 'unknown';
      byType[type] = (byType[type] || 0) + 1;
    }

    console.log('\n   Breakdown:');
    for (const [type, count] of Object.entries(byType)) {
      console.log(`   - ${type}: ${count}`);
    }

    console.log(`\n   Artifact: ${artifactPath}`);

    // Print top 5
    console.log('\n📋 Top 5:');
    for (let i = 0; i < Math.min(5, results.length); i++) {
      const result = results[i];
      console.log(`\n${i + 1}. @${result.username}${result.displayName ? ` (${result.displayName})` : ''}`);
      console.log(`   Followers: ${result.followerCount.toLocaleString()}`);
      console.log(`   Type: ${result.classification || 'unknown'}`);
      if (result.whyFollow.length > 0) {
        console.log(`   Why: ${result.whyFollow.join(', ')}`);
      }
    }

  } catch (error) {
    console.error('\n❌ Error analyzing following:', error);
    process.exit(1);
  }
}

main();
