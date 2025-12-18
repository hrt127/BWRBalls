#!/usr/bin/env node

import { analyzeFollowerBalances } from '../features/social-onchain.js';
import { getConfig } from '../core/config.js';

/**
 * CLI script for Step 5: Analyze Follower Balances
 * Usage:
 *   npm run step5 -- --contract 0x123... --type ERC721
 */
async function main() {
  const args = process.argv.slice(2);

  let contractAddress: string | undefined;
  let contractType: 'ERC721' | 'ERC20' = 'ERC721';
  let tokenId: number | undefined;
  let limit: number = 100;

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--contract' && i + 1 < args.length) {
      contractAddress = args[i + 1];
      i++;
    } else if (args[i] === '--type' && i + 1 < args.length) {
      const type = args[i + 1].toUpperCase();
      if (type === 'ERC721' || type === 'ERC20') {
        contractType = type;
      } else {
        console.error('❌ Error: --type must be ERC721 or ERC20');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--token-id' && i + 1 < args.length) {
      tokenId = parseInt(args[i + 1], 10);
      if (isNaN(tokenId)) {
        console.error('❌ Error: --token-id must be a number');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--limit' && i + 1 < args.length) {
      limit = parseInt(args[i + 1], 10);
      if (isNaN(limit) || limit <= 0) {
        console.error('❌ Error: --limit must be a positive number');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: npm run step5 -- [options]

Options:
  --contract <address>    Contract address to check (required)
  --type <type>           Contract type: ERC721 or ERC20 (default: ERC721)
  --token-id <id>         Token ID to check for ERC721 (optional, checks balance if not provided)
  --limit <number>        Maximum number of followers to check (default: 100)
  --help, -h              Show this help message

Examples:
  npm run step5 -- --contract 0x123... --type ERC721
  npm run step5 -- --contract 0x123... --type ERC721 --token-id 5
  npm run step5 -- --contract 0x123... --type ERC20 --limit 50
      `);
      process.exit(0);
    }
  }

  if (!contractAddress) {
    console.error('❌ Error: --contract is required');
    console.error('   Usage: npm run step5 -- --contract <address> [--type ERC721|ERC20]');
    process.exit(1);
  }

  try {
    const config = getConfig();

    if (!config.rpcUrl) {
      console.error('❌ Error: RPC_URL is required in .env file');
      console.error('   Add RPC_URL=https://... to your .env file');
      process.exit(1);
    }

    console.log('=== Step 5: Analyze Follower Balances ===\n');
    console.log(`FID: ${config.fid}`);
    console.log(`Contract: ${contractAddress}`);
    console.log(`Type: ${contractType}`);
    if (tokenId !== undefined) console.log(`Token ID: ${tokenId}`);
    console.log(`Limit: ${limit}`);
    console.log(`RPC URL: ${config.rpcUrl}\n`);

    const result = await analyzeFollowerBalances(
      config.fid,
      contractAddress,
      {
        limit,
        contractType,
        tokenId,
      }
    );

    console.log('\n✅ Analysis complete!');
    console.log(`   Total Followers: ${result.analysis.totalFollowers}`);
    console.log(`   Holders: ${result.analysis.holders.length}`);
    console.log(`   Non-Holders: ${result.analysis.nonHolders.length}`);
    console.log(`   Artifact: ${result.artifactPath}`);

  } catch (error) {
    console.error('\n❌ Error analyzing follower balances:', error);
    process.exit(1);
  }
}

main();
