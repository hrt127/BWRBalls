# WSL Setup Guide

## Quick Setup for BWRBalls Project

This is a **Node.js/TypeScript** project, not Python. You need Node.js installed in WSL.

---

## Install Node.js in WSL

### Option 1: Using nvm (Recommended)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install latest LTS Node.js
nvm install --lts
nvm use --lts

# Verify
node --version
npm --version
```

### Option 2: Using apt (Simpler, but older version)

```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Verify
node --version
npm --version
```

---

## After Installing Node.js

1. **Navigate to project:**

   ```bash
   cd /home/heart/projects/BWRBalls
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run companion:**

   ```bash
   npm run companion
   ```

---

## Note About Python venv

The `.venv` folder in this project is from a different project or was created by mistake.

**For this project (BWRBalls):**

- ✅ You need **Node.js** and **npm**
- ❌ You don't need Python venv

**If you have other Python projects:**

- Keep using `python3 -m venv .venv` and `source .venv/bin/activate` for those
- But for BWRBalls, use Node.js/npm

---

## Verify Setup

Run these to check everything is ready:

```bash
# Check you're in WSL (should show /home/...)
pwd

# Check Node.js
node --version  # Should show v18+ or v20+

# Check npm
npm --version   # Should show 9+ or 10+

# Check you're in project
cd /home/heart/projects/BWRBalls
ls package.json  # Should exist

# Install if needed
npm install

# Test
npm run companion
```

---

_Once Node.js is installed in WSL, everything should work!_
