# Farcaster Context Companion - Planning Context

**Created:** December 2024  
**Status:** Active Development - Phase 1 (Minimal MVP)  
**Purpose:** Comprehensive planning document preserving the essence and detail of the design conversation

---

## Problem Statement

### Core Problems Identified

1. **Knowledge Gap for Newcomers**
   - Inside jokes, references, cultural context unknown
   - New features roll out (Base app merge, Coinbase announcements) that people don't know about
   - Existing tutorials (gmfarcaster 101) become outdated (60% valid after 1 year)
   - Risk of community fragmentation as it scales
   - People feel behind, can't relate to inside jokes

2. **Engagement Quality Issues**
   - Surge/Quotient apps trying to monetize attention, but meaningful engagement vs bots/scammers/traders is unclear
   - Many apps feel pointless - just want $1-2 mints, not budget-friendly
   - Hard to distinguish real builders from traders/chasers
   - Low Neynar score prevents participation in many areas

3. **Power Player Opacity**
   - Builders/power players have plans that don't include average buyers
   - Hard to see what they're really up to (accumulation/distribution patterns)
   - Trading timeline misalignment

4. **Information Overload**
   - gmfarcaster does great showcases (2-3 videos/week) but hard to search/access
   - Warpee AI chat exists but doesn't explain "why something was funny"
   - Nyor is good for contextual on-chain data (easier than Bankr for newbies)
   - Too many tools, unclear which ones matter

5. **Daily Life Improvement**
   - Need forward-looking tools, not just historical data
   - Want wholesome fun (Harmony bot, Emerge - gifting, creativity)
   - Need tools that actually make daily lives better
   - Simple concept, deep detail available when needed

---

## Proposed Solution

### Farcaster Context Companion

A daily tool that:

1. Finds meaningful engagement opportunities (not bot/scammer interactions)
2. Explains context needed to participate (inside jokes, references, new features)
3. Tracks what builders/power players are really doing (on-chain + social patterns)
4. Builds evolving knowledge library (stays current, unlike static tutorials)
5. Budget-friendly, focuses on value not monetization gimmicks
6. Forward-looking and positive (not just historical data)

### Core Philosophy

**Respect & Complement Existing Tools:**

- Enhance existing tools (QR, Bankr, Nyor, gmfarcaster), don't compete
- Learn from the community before building
- Add value to ecosystem, make tools that feed into others
- Natural bridges, not forced complementarity
- Don't duplicate what Neynar does (they're best-in-class)

**Community-First:**

- Documentation invites collaboration and elder feedback
- Preserve the "foxhole" - maintain connection to close-knit builder culture
- Help newcomers feel included without diluting what makes FC special
- Simple concept, deep detail available when needed

**Iterative & Practical:**

- Start small, get something working, show it, iterate
- Build → Test → Iterate (don't over-design)
- Get uncomfortable exposure (ramp up, point to site where app is visible)
- Modular & evolvable (each component independent)

---

## Architecture Overview

### Phase 1: Minimal MVP (Current)

**Simple CLI tool: "Daily Companion"**

```bash
npm run companion
```

**Outputs:**

- 3-5 casts worth replying to (with why)
- Context needed (references explained)
- Links to relevant tools when appropriate
- Saves to vault (like existing digest)

**Features:**

- Reply Radar (engagement opportunity finder)
- Basic context explanations
- Simple knowledge library (starts small, grows)

### Phase 2: Enhanced Context

- Engagement quality filtering (bot/scammer/trader detection)
- Builder activity tracking
- Deeper knowledge library
- "Why it's funny" explanations (addresses Warpee AI gap)

### Phase 3: Ecosystem Integration

- Prediction markets integration (Kalshi/Polymarket)
- Sports focus (rugby/football world cups)
- Bridge to other tools naturally
- Educational pipeline for prediction markets

---

## Key Features

### 1. Reply Radar Engine

**Scoring Algorithm:**

- Engagement velocity (replies per hour)
- Author activity level and history
- Thread depth (conversation quality)
- Your relevance (topics you engage with)
- Timing (early vs late in conversation)

**Quality Filtering:**

- Bot detection (pattern analysis, activity spikes)
- Scammer detection (red flags, reported accounts)
- Trader vs creator classification
- Meaningful engagement signals (sustained conversations, quality replies)

**Output:**

- Top 3-5 casts to reply to today (quality-filtered)
- Why each is a good opportunity
- Engagement quality score
- Suggested reply angles

### 2. Context Analyzer

**Detects & Explains:**

- Inside jokes and references (with "why it's funny" explanation)
- New feature mentions (Base app, Coinbase announcements, Mini Apps)
- People you don't know but should (with builder/creator/trader classification)
- Channels/topics you're unfamiliar with
- Cultural context (gm, wagmi, community norms)

**Knowledge Sources:**

- gmfarcaster library patterns (searchable content structure)
- Warpee AI insights (but enhanced with "why" explanations)
- Nyor-style contextual on-chain data (easier than Bankr)
- Community patterns and trends

### 3. Knowledge Builder

**Builds Evolving Library:**

- Learns from casts, channels, profiles
- Tracks feature announcements (with dates)
- Maintains currency (marks outdated info)
- Sources: gmfarcaster patterns, community discussions, official announcements

**Knowledge Types:**

- **People**: Who they are, builder/creator/trader classification, what they do
- **Features**: What's new, how to use, when launched, what changed
- **Culture**: Inside jokes (with explanations), memes, community norms
- **Topics**: Trending subjects, how to engage meaningfully
- **Channels**: What each is about, who's active, quality level

**Stays Current:**

- Timestamps on all knowledge
- Version tracking (what changed, when)
- Source attribution
- Confidence scores
- Outdated info marking

### 4. Engagement Quality Engine

**Addresses Surge/Quotient Concerns:**

- Meaningful engagement scoring (not just volume)
- Bot detection and filtering
- Scammer pattern recognition
- Trader vs creator classification
- Quality signals (sustained conversations, thoughtful replies)

### 5. Builder Tracker (Future)

**Tracks Power Players:**

- On-chain activity (accumulation/distribution patterns)
- Social activity (what they're talking about, who they engage with)
- Project announcements and plans
- Timeline analysis (when they're building vs trading)

---

## Technical Approach

### APIs & Integrations

**Primary:**

- **Neynar API** (read-only, no high score needed)
  - User profiles, casts, feeds, social graph
  - Already in codebase with retry logic

**Future:**

- **Zapper API** (onchain data)
  - Farcaster ID → onchain data
  - Social graph + onchain insights
- **elfa.ai** (market narratives)
- **dropstab** (intelligence)
- **Zerion/Eth Onchain** (portfolio context)

### No High Neynar Score Required

- Read-only API calls (fetchFeed, lookupUser, fetchCasts)
- No publishing needed
- Works with basic API key

### Budget-Friendly

- No mints required
- No paywalls
- Focus on value, not monetization
- Open source, community-driven

### Modular & Evolvable

- Each component independent
- Knowledge library extensible
- Scoring algorithms improvable
- New context types addable
- Problem documentation included

---

## Integration with Existing Projects

### Your Existing Tools

**Farcaster Digest** (`farcaster-digest`)

- Distills voices timeline
- Can incorporate/learn from this
- Similar goal: turn chaos into context

**Prediction Game** (`prediction-game`)

- Rugby-based prediction market
- Rugby World Cup 2027 (2 years out)
- Football World Cup 2026 (next year)
- Educational pipeline: learn → understand → engage → risk wisely
- Integration with Kalshi, Polymarket, Coinbase

**wen-in-Athens** (`wen-in-Athens`)

- Options education
- Risk management for prediction markets
- Could become Mini App

**sehr-gut** (`sehr-gut`)

- Cross-language meme tool
- Cross-language context for international sports
- Repurpose for Base/Farcaster

**ewwdaddy** (`ewwdaddy`)

- Solana/Base integration
- Helius API exploration

**lighter-python** (`lighter-python`)

- Perps education
- Risk management context

**web3-assistant** (`web3-assistant`)

- Dashboard that ties it all together

**nobody-cares** (`nobody-cares`)

- Risk logging system
- Pattern detection
- Decision tracking

### How Everything Connects

**Core: Farcaster Context Companion**

- Helps people understand and engage
- Bridges to your other tools

**Prediction Markets Layer** (your comfort zone)

- Sports focus (rugby/football)
- Educational pipeline
- Integration with Kalshi, Polymarket, Coinbase
- Use dropstab-style intelligence

**Supporting Tools** (natural bridges)

- sehr-gut → Cross-language context
- wen-in-Athens → Options education
- ewwdaddy → Solana/Base integration
- lighter-python → Perps education
- web3-assistant → Dashboard

---

## Community Tools to Reference

### Good Tools (Examples)

**QR Coin**

- Unique IRL aspect (QR code bidding, map-based stickers)
- Builder wisdom: "nobody cares" - people don't see value, move on
- IRL aspect open for others to build on

**Harmony Bot**

- Fixed theme, evolving
- Gifting friends
- Inexpensive but unique

**Emerge**

- More flexible, cheaper
- Unique gifts
- Wholesome fun

**Bankr**

- Natural language trading
- Cross-chain trading
- Limit/stop orders
- Powerful but less quick/easy for newbies

**Nyor** (apple.eth)

- Easy cool chat
- Contextual on-chain data
- Easier than Bankr for newbies

**gmfarcaster**

- Community showcases (2-3 videos/week)
- Searchable library
- Warpee AI chat (but doesn't explain "why funny")

### Tools to Avoid Duplicating

**Neynar**

- Best-in-class builders
- Don't duplicate their features
- Learn from them, have fun with them

**Pointless Apps**

- $1-2 mint gimmicks
- Not budget-friendly
- No real value

---

## Output Format

### Daily Companion Report

```markdown
# Farcaster Companion - [Date]

## 🎯 Engagement Opportunities (Quality-Filtered)

### Cast 1: [Title]
**Quality Score:** 8.5/10 (Meaningful engagement, real creator)
**Why:** Early in conversation, active builder, topics you engage with
**Context Needed:** 
- @username is a builder known for [explanation]
- Reference to "Base app merge" - [explanation]
**Suggested Reply:** [angle]

## 📚 Context You Need Today

### Inside Joke: [reference]
**Meaning:** [explanation]
**Why It's Funny:** [explanation - addresses Warpee AI gap]
**Example:** [cast example]

### New Feature: Base App Merge
**What:** [explanation]
**How to Use:** [instructions]
**When Launched:** [date]

## 🚀 What's New

- Coinbase announcement: [summary]
- Base app changes: [updates]
- [Other updates]

## 🎓 Learning Path (for newcomers)

1. Learn about [topic] - [why it matters]
2. Follow [builder] - they're a real builder known for [reason]
3. Check out /channel - it's about [topic], quality engagement
```

---

## Development Phases

### Phase 1: Minimal MVP (Current)

- ✅ Simple CLI tool
- ✅ Reply Radar (basic scoring)
- ✅ Basic context explanations
- ✅ Simple knowledge library
- ✅ Output to vault

### Phase 2: Enhanced Context

- Engagement quality filtering
- Builder activity tracking
- Deeper knowledge library
- "Why it's funny" explanations

### Phase 3: Ecosystem Integration

- Prediction markets integration
- Sports focus
- Bridge to other tools
- Educational pipeline

---

## Success Metrics

- Users feel more confident engaging
- Reduced "what does this mean?" moments
- Better bot/scammer avoidance
- Clearer understanding of builder activity
- Knowledge library stays current
- Community feels more inclusive
- Engagement quality improves
- Budget-friendly (no forced mints/paywalls)

---

## Design Principles

1. **Modular**: Each feature is a separate module with clear interfaces
2. **Explainable**: Each function includes JSDoc comments and logs operations
3. **Robust**: Error handling, validation, and graceful degradation
4. **Composable**: Features can be combined
5. **Respectful**: Enhances existing tools, doesn't compete
6. **Community-First**: Invites collaboration and feedback
7. **Iterative**: Start small, get working, iterate
8. **Budget-Friendly**: No forced mints, focus on value

---

## Notes from Conversation

### Key Insights

1. **"Nobody Cares" Philosophy**
   - QR coin builder wisdom: people don't see value, move on
   - Focus on what actually helps, not what's trendy

2. **Respect Existing Builders**
   - Don't assume you can mess with their stuff
   - Compliment and enhance, don't compete
   - Learn from them, have fun with them

3. **Preserve the Foxhole**
   - Maintain connection to close-knit builder culture
   - Don't want new people to lose that connection
   - They're rare, can't bridge that gap alone

4. **Simple Concept, Deep Detail**
   - Easy to share concept
   - Granular detail available when needed
   - Documentation thorough but friendly

5. **Iterative Development**
   - Can't stay in workflow design
   - Need uncomfortable exposure
   - Ramp up, point to site, test, iterate

6. **Sports Domain Comfort**
   - Rugby World Cup 2027 (2 years)
   - Football World Cup 2026 (next year)
   - Prediction markets coming to Farcaster
   - Can steer value well in this domain

---

## Future Enhancements

- AI-powered context explanations (when knowledge incomplete)
- Community contributions to knowledge base
- Real-time builder activity alerts
- Integration with Nyor/Bankr for on-chain context
- Browser extension for real-time context hints
- gmfarcaster library integration (search their content)
- Warpee AI enhancement (add "why" explanations)
- Surge/Quotient quality analysis integration
- Prediction markets educational pipeline
- Sports-specific context and opportunities

---

## Related Repositories

- `farcaster-digest` - Existing digest tool
- `prediction-game` - Rugby prediction market
- `wen-in-Athens` - Options education
- `sehr-gut` - Cross-language meme tool
- `ewwdaddy` - Solana/Base integration
- `lighter-python` - Perps education
- `web3-assistant` - Dashboard
- `nobody-cares` - Risk logging system

---

## Documentation Structure

Following `nobody-cares` pattern:

- `/docs` - Planning and technical documentation
- `/audited` - Audited decisions and changes
- Root README - Overview and quick start
- Granular docs available when needed

---

_This document preserves the essence and detail of the planning conversation. It serves as the foundation for building the Farcaster Context Companion and connecting it to the broader ecosystem of tools and projects._
