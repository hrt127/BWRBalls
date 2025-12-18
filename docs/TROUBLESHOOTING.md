# Troubleshooting Guide

## WSL/Windows Path Issues

### Problem: "UNC paths are not supported" or "tsx is not recognized"

This happens when npm/node commands run from Windows instead of WSL.

### Solution: Run from WSL Terminal

**Important:** You must run npm commands from a **WSL terminal**, not Windows CMD or PowerShell.

1. **Open WSL Terminal:**
   - Open Ubuntu (or your WSL distro) from Windows Start menu
   - Or type `wsl` in Windows CMD/PowerShell
   - Or use Windows Terminal with WSL profile

2. **Navigate to project:**

   ```bash
   cd /home/heart/projects/BWRBalls
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Run companion:**

   ```bash
   npm run companion
   ```

### Verify You're in WSL

Check your prompt - it should show something like:

```
heart@hostname:/home/heart/projects/BWRBalls$
```

Not:

```
C:\Users\heart\projects\BWRBalls>
```

### If Node/npm Not Found in WSL

Install Node.js in WSL:

```bash
# Option 1: Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# Option 2: Using apt
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### Alternative: Use WSL from Cursor

If you're using Cursor's integrated terminal:

1. Open terminal in Cursor
2. Make sure it's using WSL (check terminal dropdown)
3. Select "WSL: Ubuntu" or your distro
4. Then run npm commands

---

## Other Common Issues

### "NEYNAR_API_KEY is not configured"

**Solution:**

1. Check `.env` file exists in project root
2. Make sure it has:

   ```
   NEYNAR_API_KEY=your_key_here
   FID=your_fid
   VAULT_PATH=./vault-logs
   ```

3. No quotes around values
4. No spaces around `=`

### "No opportunities found"

**Solution:**

```bash
# Lower the threshold
npm run companion -- --min-score 1

# Analyze more casts
npm run companion -- --limit 100
```

### "Cannot find module" errors

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Check Commands

Run these to verify setup:

```bash
# Check you're in WSL
pwd  # Should show /home/heart/...

# Check Node.js
node --version  # Should show version
npm --version   # Should show version

# Check dependencies
ls node_modules  # Should exist and have content

# Check .env
cat .env  # Should show your keys (be careful with this)

# Test companion
npm run companion
```

---

_If you're still having issues, make sure you're running commands from WSL terminal, not Windows._
