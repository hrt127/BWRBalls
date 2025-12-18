# First Run Checklist

**Goal:** Get the companion running in 5 minutes.

---

## ✅ Pre-Flight Check

- [ ] You're in the project folder: `/home/heart/projects/BWRBalls`
- [ ] You have a `.env` file with:
  - `NEYNAR_API_KEY=your_key`
  - `FID=your_fid`
  - `VAULT_PATH=./vault-logs`
- [ ] Dependencies installed: `npm install` (if not done)

---

## 🚀 Run It

```bash
npm run companion
```

**Expected output:**

```
=== Daily Farcaster Companion ===

FID: 6131
Limit: 50
Min Score: 5
Max Results: 5

Finding engagement opportunities for FID 6131...
Fetched 50 casts from following feed
Found X engagement opportunities

✅ Daily companion report generated!
   Opportunities found: X
   Average score: XX
   Contexts needed: X
   Artifact: /path/to/vault-logs/.../companion-YYYYMMDD.md
```

---

## 📄 Find Your Report

The file path is shown in the output. Open it:

```bash
# Copy the path from the output, or find latest:
code $(ls -t vault-logs/*/*/*/companion-*.md | head -1)
```

Or just navigate in your file explorer to:

```
vault-logs/YYYY/MM/DD/companion-YYYYMMDD.md
```

---

## 👀 What You'll See

A markdown file with:

- Summary stats
- Top 3-5 engagement opportunities
- Context explanations for references
- Learning path suggestions

**That's it.** You now have a daily report.

---

## 🔄 Next Steps

1. **Read the report** - See what opportunities it found
2. **Try replying** to one of the casts it suggested
3. **Run again tomorrow** - `npm run companion`
4. **Adjust if needed** - See `docs/WORKFLOW_GUIDE.md` for how to iterate

---

## ❓ Troubleshooting

**"Command not found: npm"**

- Make sure Node.js is installed: `node --version`
- If using WSL, Node might be in a different path

**"NEYNAR_API_KEY is not configured"**

- Check your `.env` file exists and has the key
- Make sure you're in the project root

**"No opportunities found"**

- Lower the threshold: `npm run companion -- --min-score 1`
- Check your FID is correct in `.env`

**File not found**

- Check the path in the success message
- Make sure `VAULT_PATH` in `.env` points to where you want files

---

## 📚 More Help

- **Workflow Guide:** `docs/WORKFLOW_GUIDE.md` - Full workflow and iteration
- **Quick Start:** `docs/QUICK_START.md` - Quick reference
- **Planning:** `docs/PLANNING_CONTEXT.md` - Full vision and context

---

_Once you've run it once, you'll know the flow. Then iterate from there._
