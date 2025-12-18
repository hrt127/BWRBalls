#!/usr/bin/env node

import { generateDailyCompanion } from '../features/daily-companion.js';
import { getConfig } from '../core/config.js';

/**
 * CLI script for Daily Companion
 * Usage:
 *   npm run companion
 *   npm run companion -- --limit 100 --min-score 10 --max-results 10
 */
async function main() {
  const args = process.argv.slice(2);

  let limit: number = 50;
  let minScore: number = 5;
  let maxResults: number = 5;

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && i + 1 < args.length) {
      limit = parseInt(args[i + 1], 10);
      if (isNaN(limit) || limit <= 0) {
        console.error('❌ Error: --limit must be a positive number');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--min-score' && i + 1 < args.length) {
      minScore = parseInt(args[i + 1], 10);
      if (isNaN(minScore) || minScore < 0) {
        console.error('❌ Error: --min-score must be a non-negative number');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--max-results' && i + 1 < args.length) {
      maxResults = parseInt(args[i + 1], 10);
      if (isNaN(maxResults) || maxResults <= 0) {
        console.error('❌ Error: --max-results must be a positive number');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: npm run companion [options]

Options:
  --limit <number>        Number of casts to analyze (default: 50)
  --min-score <number>    Minimum engagement score (default: 5)
  --max-results <number>  Maximum opportunities to return (default: 5)
  --help, -h              Show this help message

Examples:
  npm run companion
  npm run companion -- --limit 100 --min-score 10 --max-results 10
      `);
      process.exit(0);
    }
  }

  try {
    const config = getConfig();

    console.log('=== Daily Farcaster Companion ===\n');
    console.log(`FID: ${config.fid}`);
    console.log(`Limit: ${limit}`);
    console.log(`Min Score: ${minScore}`);
    console.log(`Max Results: ${maxResults}\n`);

    const result = await generateDailyCompanion({
      limit,
      minScore,
      maxResults,
    });

    console.log('\n✅ Companion report complete!');
    console.log(`   Artifact: ${result.artifactPath}`);

  } catch (error) {
    console.error('\n❌ Error generating companion report:', error);
    process.exit(1);
  }
}

main();
