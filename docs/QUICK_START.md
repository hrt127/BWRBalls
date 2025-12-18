# Daily Companion - Quick Start

## What It Does

The Daily Companion finds engagement opportunities in your Farcaster feed and explains the context you need to participate meaningfully.

## Run It

```bash
npm run companion
```

## What You Get

A markdown report saved to your vault with:

- **3-5 engagement opportunities**: Casts worth replying to, with scores and reasons
- **Context explanations**: What references mean, why inside jokes are funny
- **Learning path**: Suggestions for newcomers

## Customize

```bash
# Analyze more casts
npm run companion -- --limit 100

# Higher quality threshold
npm run companion -- --min-score 10

# More opportunities
npm run companion -- --max-results 10
```

## Output Location

Reports are saved to:

```
vault-logs/YYYY/MM/DD/companion-YYYYMMDD.md
```

## Knowledge Library

The companion includes explanations for:

- Cultural references (gm, wagmi, ngmi)
- Tools (Harmony bot, Bankr, Nyor, Emerge)
- Features (Mini Apps, Frames, Base app)

See `docs/PLANNING_CONTEXT.md` for the full vision.
