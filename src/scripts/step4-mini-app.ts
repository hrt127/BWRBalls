#!/usr/bin/env node

import { registerMiniApp, validateMiniAppOptions } from '../features/mini-app-setup.js';

/**
 * CLI script for Step 4: Mini App Setup
 * Usage:
 *   npm run step4 -- --name "NFT Deployer" --title "NFT Deployer App" --description "Deploy NFTs easily" --url "https://..."
 */
async function main() {
  const args = process.argv.slice(2);

  let name: string | undefined;
  let title: string | undefined;
  let description: string | undefined;
  let url: string | undefined;
  let imageUrl: string | undefined;
  let appUrl: string | undefined;

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' && i + 1 < args.length) {
      name = args[i + 1];
      i++;
    } else if (args[i] === '--title' && i + 1 < args.length) {
      title = args[i + 1];
      i++;
    } else if (args[i] === '--description' && i + 1 < args.length) {
      description = args[i + 1];
      i++;
    } else if (args[i] === '--url' && i + 1 < args.length) {
      url = args[i + 1];
      i++;
    } else if (args[i] === '--image-url' && i + 1 < args.length) {
      imageUrl = args[i + 1];
      i++;
    } else if (args[i] === '--app-url' && i + 1 < args.length) {
      appUrl = args[i + 1];
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: npm run step4 -- [options]

Options:
  --name <name>              Mini app name (required)
  --title <title>            Mini app title (required)
  --description <desc>       Mini app description (required)
  --url <url>                Mini app URL (required)
  --image-url <url>          Mini app image URL (optional)
  --app-url <url>            Mini app application URL (optional)
  --help, -h                 Show this help message

Examples:
  npm run step4 -- --name "nft-deployer" --title "NFT Deployer" --description "Deploy NFTs easily" --url "https://nft-deployer.com"
      `);
      process.exit(0);
    }
  }

  try {
    // Validate required fields
    if (!name || !title || !description || !url) {
      console.error('❌ Error: --name, --title, --description, and --url are required');
      console.error('   Usage: npm run step4 -- --name <name> --title <title> --description <desc> --url <url>');
      process.exit(1);
    }

    const options = {
      name,
      title,
      description,
      url,
      imageUrl,
      appUrl,
    };

    // Validate options
    validateMiniAppOptions(options);

    console.log('=== Step 4: Mini App Setup ===\n');
    console.log(`Name: ${options.name}`);
    console.log(`Title: ${options.title}`);
    console.log(`Description: ${options.description}`);
    console.log(`URL: ${options.url}`);
    if (options.imageUrl) console.log(`Image URL: ${options.imageUrl}`);
    if (options.appUrl) console.log(`App URL: ${options.appUrl}`);
    console.log('');

    const result = await registerMiniApp(options);

    console.log('\n✅ Mini app documentation created!');
    console.log(`   Artifact: ${result.artifactPath}`);

  } catch (error) {
    console.error('\n❌ Error setting up mini app:', error);
    process.exit(1);
  }
}

main();
