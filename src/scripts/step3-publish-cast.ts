#!/usr/bin/env node

import { publishDeployCast } from '../features/cast-publisher.js';

/**
 * CLI script for Step 3: Publish Cast
 * Usage: 
 *   npm run step3 -- --text "Deploy log #7..." --deploy 7
 *   npm run step3 -- --text "Hello Farcaster!"
 */
async function main() {
  const args = process.argv.slice(2);

  let text: string | undefined;
  let deployNumber: number | undefined;

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--text' && i + 1 < args.length) {
      text = args[i + 1];
      i++;
    } else if (args[i] === '--deploy' && i + 1 < args.length) {
      deployNumber = parseInt(args[i + 1], 10);
      if (isNaN(deployNumber)) {
        console.error('❌ Error: --deploy must be a number');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: npm run step3 -- [options]

Options:
  --text <text>       Cast text content (required)
  --deploy <number>   Deploy number for logging (optional)
  --help, -h          Show this help message

Examples:
  npm run step3 -- --text "Deploy log #7 completed successfully!" --deploy 7
  npm run step3 -- --text "Hello Farcaster!"
      `);
      process.exit(0);
    }
  }

  if (!text) {
    console.error('❌ Error: --text is required');
    console.error('   Usage: npm run step3 -- --text "Your cast text" [--deploy <number>]');
    process.exit(1);
  }

  try {
    console.log('=== Step 3: Publish Cast ===\n');
    if (deployNumber) {
      console.log(`Deploy Number: ${deployNumber}`);
    }
    console.log(`Text: ${text}\n`);

    const result = await publishDeployCast(text, deployNumber);

    console.log('\n✅ Cast published successfully!');
    console.log(`   Cast Hash: ${result.castHash}`);
    console.log(`   Artifact: ${result.artifactPath}`);
    console.log(`   View: https://warpcast.com/~/conversations/${result.castHash}`);

  } catch (error) {
    console.error('\n❌ Error publishing cast:', error);
    if (error instanceof Error && error.message.includes('NEYNAR_SIGNER_UUID')) {
      console.error('\n💡 Tip: Make sure NEYNAR_SIGNER_UUID is set in your .env file');
    }
    process.exit(1);
  }
}

main();
