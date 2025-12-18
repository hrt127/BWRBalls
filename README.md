# Neynar Farcaster Integration Starter

A modular TypeScript/Node.js system that bridges Farcaster (via Neynar) with your NFT deployment workflow. Each component is independent, testable, and produces Obsidian-compatible artifacts.

**New:** Daily Farcaster Companion - Find engagement opportunities and understand context to participate meaningfully on Farcaster.

## Architecture

```
src/
├── core/
│   ├── neynar-client.ts      # Centralized Neynar API client
│   └── config.ts              # Configuration management
├── features/
│   ├── feed-fetcher.ts        # Step 1: Fetch Following feed
│   ├── profile-fetcher.ts     # Step 2: Fetch profile data
│   ├── cast-publisher.ts      # Step 3: Publish casts after deploys
│   ├── mini-app-setup.ts      # Step 4: Mini App metadata registration
│   ├── social-onchain.ts      # Step 5: Combine social + onchain data
│   ├── reply-radar.ts         # Daily Companion: Find engagement opportunities
│   ├── context-analyzer.ts    # Daily Companion: Analyze context needs
│   └── daily-companion.ts     # Daily Companion: Generate daily report
├── knowledge/
│   └── library.ts             # Knowledge library (culture, tools, features)
├── vault/
│   ├── logger.ts              # Obsidian vault log writer
│   ├── templates.ts           # Obsidian markdown templates
│   ├── artifacts.ts           # Artifact generation helpers
│   └── companion-artifacts.ts # Daily Companion artifact generation
├── scripts/
│   ├── step1-fetch-feed.ts    # CLI script for Step 1
│   ├── step2-fetch-profile.ts # CLI script for Step 2
│   ├── step3-publish-cast.ts  # CLI script for Step 3
│   ├── step4-mini-app.ts      # CLI script for Step 4
│   ├── step5-analyze-followers.ts # CLI script for Step 5
│   └── daily-companion.ts     # CLI script for Daily Companion
└── utils/
    └── date-helpers.ts        # Date formatting for vault logs
```

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create `.env` file:**

   ```bash
   cp .env.example .env
   ```

3. **Configure `.env`:**

   ```env
   NEYNAR_API_KEY=your_api_key_here
   NEYNAR_SIGNER_UUID=your_signer_uuid_here
   FID=6131
   VAULT_PATH=./vault-logs
   RPC_URL=https://sepolia.base.org
   ```

4. **Get your Neynar credentials:**
   - Sign up at [Neynar](https://neynar.com)
   - Create an API key
   - Set up a signer UUID for publishing casts

## Usage

### Step 1: Fetch Following Feed

Fetch your following feed and save it as a JSON log:

```bash
npm run step1
```

### Step 2: Fetch Profile Data

Fetch your profile data and generate an Obsidian profile card:

```bash
npm run step2
```

### Step 3: Publish Cast

Publish a cast to Farcaster (useful after NFT deploys):

```bash
npm run step3 -- --text "Deploy log #7 completed successfully!" --deploy 7
npm run step3 -- --text "Hello Farcaster!"
```

### Step 4: Mini App Setup

Create mini app documentation:

```bash
npm run step4 -- --name "nft-deployer" --title "NFT Deployer" --description "Deploy NFTs easily" --url "https://nft-deployer.com" --image-url "https://..."
```

### Step 5: Analyze Follower Balances

Analyze which followers hold your NFT/token:

```bash
npm run step5 -- --contract 0x123... --type ERC721
npm run step5 -- --contract 0x123... --type ERC721 --token-id 5
npm run step5 -- --contract 0x123... --type ERC20 --limit 50
```

### Daily Companion

Generate a daily report with engagement opportunities and context explanations:

```bash
npm run companion
npm run companion -- --limit 100 --min-score 10 --max-results 10
```

**📖 First time?**

- Quick start: `docs/FIRST_RUN.md` - 5-minute checklist
- Full workflow: `docs/WORKFLOW_GUIDE.md` - Step-by-step guide, what to expect, iteration cycle

**What it does:**

- Finds 3-5 casts worth replying to (based on engagement quality)
- Explains context needed (inside jokes, references, new features)
- Links to relevant tools when appropriate
- Saves to vault as markdown report

**Options:**

- `--limit <number>`: Number of casts to analyze (default: 50)
- `--min-score <number>`: Minimum engagement score (default: 5)
- `--max-results <number>`: Maximum opportunities to return (default: 5)

## Vault Log Structure

All artifacts are saved to `vault-logs/` with the following structure:

```
vault-logs/
├── 2024/
│   └── 12/
│       └── 16/
│           ├── feed-log-20241216.json
│           ├── profile-20241216.md
│           ├── deploy-7-cast-0x5300d6bd8f604c0b5fe7d573e02bb1489362f4d3.md
│           ├── follower-balances-20241216.json
│           └── companion-20241216.md
├── mini-apps/
│   └── nft-deployer.md
└── README.md
```

## Design Principles

1. **Modular**: Each feature is a separate module with clear interfaces
2. **Explainable**: Each function includes JSDoc comments and logs operations
3. **Robust**: Error handling, validation, and graceful degradation
4. **Composable**: Features can be combined (e.g., fetch profile + publish cast)

## Integration Points

- **With NFT Deploy Workflow**: Step 3 (`cast-publisher`) can be imported into deploy scripts
- **With Obsidian**: All artifacts use Markdown frontmatter and cross-links (`[[links]]`)
- **With Onchain Data**: Step 5 uses RPC providers to query contract states

## Development

```bash
# Build TypeScript
npm run build

# Run in development mode
npm run dev
```

## Dependencies

- `@neynar/nodejs-sdk`: Neynar API client
- `dotenv`: Environment variable management
- `fs-extra`: File system operations for vault logs
- `zod`: Configuration validation
- `ethers`: Onchain queries (for Step 5)
- `typescript`: TypeScript support
- `tsx`: TypeScript execution

## Daily Companion

The Daily Companion helps you:

- **Find engagement opportunities**: Discover casts worth replying to based on engagement quality
- **Understand context**: Get explanations for inside jokes, references, and new features
- **Learn the ecosystem**: Build knowledge about tools, culture, and community

**How it works:**

1. Analyzes your following feed for engagement opportunities
2. Scores casts by conversation quality (replies weighted higher than likes)
3. Detects references and explains context needed
4. Generates a daily markdown report saved to your vault

**Knowledge Library:**
The companion includes a growing knowledge library covering:

- Cultural references (gm, wagmi, ngmi, etc.)
- Tools (Harmony bot, Bankr, Nyor, Emerge, etc.)
- Features (Mini Apps, Frames, Base app, etc.)
- Channels and topics

See `docs/PLANNING_CONTEXT.md` for the full vision and roadmap.

## Next Steps

1. Run Step 1 to create baseline feed snapshot
2. Run Step 2 to create profile card in vault
3. Integrate Step 3 into existing deploy workflow
4. Set up Mini App (Step 4) as standalone project
5. Use Step 5 for targeted NFT drops based on follower analysis
6. **Run Daily Companion** to find engagement opportunities and understand context

## License

MIT
