# Daily Companion - Practical Workflow Guide

**Goal:** Get the companion running, see what it does, iterate on it, and understand the path forward.

---

## Step 1: Run It (Right Now)

### In Your Terminal (WSL)

```bash
# You're already in the project folder (BWRBalls)
# You've already activated your venv (if needed for Python stuff)
# Now just run:

npm run companion
```

### What You'll See

```
=== Daily Farcaster Companion ===

FID: 6131
Limit: 50
Min Score: 5
Max Results: 5

Finding engagement opportunities for FID 6131...
Fetched 50 casts from following feed
Found 5 engagement opportunities

✅ Daily companion report generated!
   Opportunities found: 5
   Average score: 23
   Contexts needed: 2
   Artifact: /home/heart/projects/BWRBalls/vault-logs/2024/12/18/companion-20241218.md
```

**That's it.** The report is saved. Now let's see what it looks like.

---

## Step 2: View the Output

### Where It Is

The file is saved here:

```
vault-logs/YYYY/MM/DD/companion-YYYYMMDD.md
```

### How to View It

**Option 1: In Cursor/VS Code**

```bash
# Just open the file
code vault-logs/2024/12/18/companion-20241218.md
# Or click it in the file explorer
```

**Option 2: In Terminal**

```bash
cat vault-logs/2024/12/18/companion-20241218.md
# Or
less vault-logs/2024/12/18/companion-20241218.md
```

**Option 3: In Obsidian** (if you use it)

- The file is already in your vault structure
- Just open Obsidian and navigate to the date folder

### What It Looks Like

```markdown
---
title: Farcaster Companion - 20241218
date: 2024-12-18
fid: 6131
tags: [companion, farcaster, engagement]
---

# Farcaster Companion - 2024-12-18

## Summary

- **Opportunities Found:** 5
- **Average Score:** 23/100
- **Contexts Needed:** 2

---

## 🎯 Engagement Opportunities

### 1. @username (Display Name)

**Score:** 45/100

**Why:** Active conversation (8 replies), High engagement thread

**Engagement:** 8 replies, 12 likes, 3 recasts

**Cast:**

> This is the cast text that was posted...
> It might span multiple lines.

**Link:** [View on Warpcast](https://warpcast.com/~/conversations/0x...)

**Context Needed:**

- gm: Common greeting on Farcaster...
- Why it matters: It's the most common greeting...

---

### 2. @anotheruser

**Score:** 32/100

**Why:** Well-received cast, Early engagement opportunity

...
```

**This is your daily report.** Use it to:

- See which casts are worth replying to
- Understand context before replying
- Learn about tools/references you don't know

---

## Step 3: Iterate (Make It Better)

### Change the Scoring

Edit `src/features/reply-radar.ts`:

```typescript
// Line ~45: Change the scoring formula
const baseScore = likes + (replies * 2) + (recasts * 3);
// Try: likes + (replies * 3) + (recasts * 2) // Weight replies even more
```

Then run again:

```bash
npm run companion
```

### Add More Knowledge

Edit `src/knowledge/library.ts`:

```typescript
// Add a new entry in the initialize() function
this.addEntry({
  id: 'new-reference',
  type: 'culture',
  title: 'New Thing',
  description: 'What it is',
  explanation: 'Detailed explanation...',
  whyMatters: 'Why you should know this',
  examples: ['example 1', 'example 2'],
  sources: [],
  firstSeen: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  confidence: 0.9,
  related: [],
});
```

Then run again:

```bash
npm run companion
```

### Adjust Filters

```bash
# Get more results
npm run companion -- --max-results 10

# Higher quality threshold
npm run companion -- --min-score 15

# Analyze more casts
npm run companion -- --limit 100
```

---

## Step 4: The Iteration Cycle

**Every time you run it:**

1. **Run:** `npm run companion`
2. **Check output:** Open the markdown file
3. **See what's wrong:** Maybe scores are off, or context is missing
4. **Fix it:** Edit the code
5. **Run again:** `npm run companion`
6. **Repeat:** Until it's useful

**This is the flow.** Practice it a few times:

- Run → View → Adjust → Run → View → Adjust

---

## Step 5: When Does It Become an App?

### Current State: CLI Tool

Right now it's a **command-line tool**:

- You run it manually
- It generates a file
- You read the file

### Next: Web Interface (Simple)

**Option A: Streamlit (Python)**

```python
# Create streamlit/app.py
import streamlit as st
import subprocess

st.title("Farcaster Companion")

if st.button("Generate Report"):
    result = subprocess.run(["npm", "run", "companion"], capture_output=True)
    st.text(result.stdout.decode())
```

**Option B: Simple HTML Page**

```html
<!-- Create index.html -->
<!DOCTYPE html>
<html>
<body>
  <h1>Farcaster Companion</h1>
  <button onclick="generateReport()">Generate Report</button>
  <div id="output"></div>
</body>
</html>
```

**Option C: Vercel/Next.js**

- Deploy as a web app
- Run the companion on a schedule
- Show results in a dashboard

### When to Add APIs?

**Add APIs when you need:**

- Real-time data (not just daily reports)
- Interactive features (click to analyze a cast)
- External integrations (Zapper, elfa.ai, etc.)

**Example: Adding Zapper API**

```typescript
// src/features/onchain-context.ts
export async function getOnchainContext(fid: number) {
  const response = await fetch(`https://api.zapper.xyz/v2/farcaster/${fid}`, {
    headers: { 'Authorization': `Bearer ${ZAPPER_API_KEY}` }
  });
  return response.json();
}
```

Then use it in `daily-companion.ts`:

```typescript
const onchainData = await getOnchainContext(config.fid);
// Add to report
```

---

## Step 6: The Path Forward

### Phase 1: CLI Tool (Now)

- ✅ Run `npm run companion`
- ✅ Get markdown report
- ✅ Iterate on scoring/knowledge

### Phase 2: Make It Visible

- Deploy to Vercel (simple HTML page)
- Or Streamlit (Python dashboard)
- Or keep it CLI but add a web viewer

### Phase 3: Add APIs

- Zapper for onchain context
- elfa.ai for market narratives
- When you need real-time/interactive features

### Phase 4: Full App

- Mini App on Farcaster
- Real-time updates
- Interactive features

**But start with Phase 1.** Get comfortable with:

- Run → View → Adjust → Run

---

## Quick Reference

### Run It

```bash
npm run companion
```

### View Output

```bash
# Find the latest file
ls -lt vault-logs/*/*/*/companion-*.md | head -1

# Open it
code $(ls -t vault-logs/*/*/*/companion-*.md | head -1)
```

### Adjust Settings

```bash
# More results
npm run companion -- --max-results 10 --min-score 10

# See help
npm run companion -- --help
```

### Edit Code

- `src/features/reply-radar.ts` - Scoring algorithm
- `src/knowledge/library.ts` - Knowledge entries
- `src/features/context-analyzer.ts` - Context detection

### Test Changes

```bash
# After editing, just run again
npm run companion
```

---

## Troubleshooting

### "Command not found: npm"

- Make sure you're in the project folder
- Node.js should be installed (check with `node --version`)

### "NEYNAR_API_KEY is not configured"

- Check your `.env` file exists
- Make sure it has `NEYNAR_API_KEY=your_key_here`

### "No opportunities found"

- Lower the min-score: `npm run companion -- --min-score 1`
- Increase the limit: `npm run companion -- --limit 100`

### Output file not found

- Check the path in the success message
- Make sure `VAULT_PATH` in `.env` is correct

---

## Practice This Flow

1. **Run:** `npm run companion`
2. **Open:** The markdown file it creates
3. **Read:** See what opportunities it found
4. **Adjust:** Change something in the code
5. **Run again:** `npm run companion`
6. **Compare:** See how it changed

**Do this 3-5 times.** Get comfortable with the cycle.

Then you'll know:

- What to expect
- Where things are
- How to iterate
- When you're ready for the next step

---

_This is your workflow. Practice it. Get comfortable. Then we add the next layer._
