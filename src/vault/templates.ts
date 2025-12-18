import { formatDateYYYYMMDD, formatDateISO } from '../utils/date-helpers.js';

/**
 * Profile card data interface
 */
export interface ProfileCardData {
  fid: number;
  username: string;
  displayName?: string;
  followerCount?: number;
  followingCount?: number;
  bio?: string;
  pfpUrl?: string;
  timestamp: string;
}

/**
 * Deploy cast log data interface
 */
export interface DeployCastData {
  deployNumber: number;
  castHash: string;
  text: string;
  timestamp: string;
  farcasterUrl?: string;
}

/**
 * Mini App metadata interface
 */
export interface MiniAppMetadata {
  name: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  appUrl?: string;
  timestamp: string;
}

/**
 * Generates a profile card markdown template for Obsidian
 * @param data Profile card data
 * @returns Markdown content
 */
export function generateProfileCard(data: ProfileCardData): string {
  const date = formatDateYYYYMMDD(new Date(data.timestamp));
  
  return `---
title: Profile - ${data.username}
fid: ${data.fid}
username: ${data.username}
date: ${date}
tags: [profile, farcaster]
---

# Profile: ${data.displayName || data.username}

## Details

- **FID**: ${data.fid}
- **Username**: @${data.username}
${data.displayName ? `- **Display Name**: ${data.displayName}` : ''}
${data.followerCount !== undefined ? `- **Followers**: ${data.followerCount.toLocaleString()}` : ''}
${data.followingCount !== undefined ? `- **Following**: ${data.followingCount.toLocaleString()}` : ''}
${data.pfpUrl ? `- **Profile Picture**: ![PFP](${data.pfpUrl})` : ''}

## Bio

${data.bio || '_No bio provided_'}

## Links

- [[Farcaster Profile|https://warpcast.com/${data.username}]]
- [[Profile Logs|../../profile-logs]]

---

_Generated: ${data.timestamp}_
`;
}

/**
 * Generates a deploy cast log markdown template
 * @param data Deploy cast data
 * @returns Markdown content
 */
export function generateDeployCastLog(data: DeployCastData): string {
  const date = formatDateYYYYMMDD(new Date(data.timestamp));
  const farcasterLink = data.farcasterUrl || `https://warpcast.com/~/conversations/${data.castHash}`;
  
  return `---
title: Deploy #${data.deployNumber} - Cast
deployNumber: ${data.deployNumber}
castHash: ${data.castHash}
date: ${date}
tags: [deploy, cast, farcaster]
---

# Deploy #${data.deployNumber} → Cast

## Cast Details

- **Deploy Number**: #${data.deployNumber}
- **Cast Hash**: \`${data.castHash}\`
- **Timestamp**: ${data.timestamp}
- **Farcaster Link**: [View Cast](${farcasterLink})

## Cast Text

> ${data.text.replace(/\n/g, '\n> ')}

## Related

- [[Deploy Logs|../../deploy-logs]]
- [[Cast History|../../cast-history]]

---

_Generated: ${data.timestamp}_
`;
}

/**
 * Generates mini app setup documentation
 * @param data Mini app metadata
 * @returns Markdown content
 */
export function generateMiniAppDocs(data: MiniAppMetadata): string {
  return `---
title: Mini App - ${data.title}
name: ${data.name}
url: ${data.url}
date: ${data.timestamp}
tags: [mini-app, neynar, farcaster]
---

# Mini App: ${data.title}

## Overview

${data.description}

## Configuration

- **App Name**: ${data.name}
- **Title**: ${data.title}
- **URL**: ${data.url}
${data.appUrl ? `- **App URL**: ${data.appUrl}` : ''}
${data.imageUrl ? `- **Image**: ![App Image](${data.imageUrl})` : ''}

## Neynar Registration

To register this mini app with Neynar:

1. Navigate to the Neynar Developer Portal
2. Create a new Mini App registration
3. Use the following metadata:

\`\`\`json
{
  "name": "${data.name}",
  "title": "${data.title}",
  "description": "${data.description}",
  "url": "${data.url}",
  ${data.imageUrl ? `"imageUrl": "${data.imageUrl}",` : ''}
  ${data.appUrl ? `"appUrl": "${data.appUrl}"` : ''}
}
\`\`\`

## Links

- [[Mini Apps|../mini-apps]]
- [[Neynar Docs|https://docs.neynar.com]]

---

_Generated: ${data.timestamp}_
`;
}
