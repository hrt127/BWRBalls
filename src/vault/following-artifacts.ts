import { writeMarkdownLog, generateDateFilename } from './logger.js';
import { formatDateISO, formatDateYYYYMMDD } from '../utils/date-helpers.js';
import type { FollowingAnalysis } from '../features/following-analyzer.js';

/**
 * Generates markdown content for following analysis
 */
function generateFollowingMarkdown(
  analyses: FollowingAnalysis[],
  fid: number
): string {
  const date = formatDateYYYYMMDD(new Date());

  let markdown = `---
title: Best Follows Analysis - ${date}
fid: ${fid}
date: ${date}
tags: [following, farcaster, analysis]
---

# Best Follows Analysis - ${date}

## Summary

- **Total Analyzed:** ${analyses.length}
- **Builders:** ${analyses.filter(a => a.classification === 'builder').length}
- **Creators:** ${analyses.filter(a => a.classification === 'creator').length}
- **Power Players:** ${analyses.filter(a => a.classification === 'power-player').length}
- **Traders:** ${analyses.filter(a => a.classification === 'trader').length}
- **Community:** ${analyses.filter(a => a.classification === 'community').length}

---

## 🏆 Top Follows

`;

  // Group by classification
  const byClassification: Record<string, FollowingAnalysis[]> = {
    'builder': [],
    'creator': [],
    'power-player': [],
    'trader': [],
    'community': [],
    'unknown': [],
  };

  for (const analysis of analyses) {
    const classification = analysis.classification || 'unknown';
    byClassification[classification].push(analysis);
  }

  // Builders
  if (byClassification.builder.length > 0) {
    markdown += `### 🔨 Builders\n\n`;
    for (const analysis of byClassification.builder) {
      markdown += `#### @${analysis.username}${analysis.displayName ? ` (${analysis.displayName})` : ''}\n\n`;
      markdown += `**Followers:** ${analysis.followerCount.toLocaleString()}\n\n`;
      if (analysis.bio) {
        markdown += `**Bio:** ${analysis.bio}\n\n`;
      }
      markdown += `**Why Follow:**\n`;
      for (const reason of analysis.whyFollow) {
        markdown += `- ${reason}\n`;
      }
      markdown += `\n**Link:** [View Profile](https://warpcast.com/${analysis.username})\n\n`;
      markdown += `---\n\n`;
    }
  }

  // Creators
  if (byClassification.creator.length > 0) {
    markdown += `### 🎨 Creators\n\n`;
    for (const analysis of byClassification.creator) {
      markdown += `#### @${analysis.username}${analysis.displayName ? ` (${analysis.displayName})` : ''}\n\n`;
      markdown += `**Followers:** ${analysis.followerCount.toLocaleString()}\n\n`;
      if (analysis.bio) {
        markdown += `**Bio:** ${analysis.bio}\n\n`;
      }
      markdown += `**Why Follow:**\n`;
      for (const reason of analysis.whyFollow) {
        markdown += `- ${reason}\n`;
      }
      markdown += `\n**Link:** [View Profile](https://warpcast.com/${analysis.username})\n\n`;
      markdown += `---\n\n`;
    }
  }

  // Power Players
  if (byClassification['power-player'].length > 0) {
    markdown += `### ⚡ Power Players\n\n`;
    for (const analysis of byClassification['power-player']) {
      markdown += `#### @${analysis.username}${analysis.displayName ? ` (${analysis.displayName})` : ''}\n\n`;
      markdown += `**Followers:** ${analysis.followerCount.toLocaleString()}\n\n`;
      if (analysis.bio) {
        markdown += `**Bio:** ${analysis.bio}\n\n`;
      }
      markdown += `**Why Follow:**\n`;
      for (const reason of analysis.whyFollow) {
        markdown += `- ${reason}\n`;
      }
      markdown += `\n**Link:** [View Profile](https://warpcast.com/${analysis.username})\n\n`;
      markdown += `---\n\n`;
    }
  }

  // All others
  const others = [
    ...byClassification.trader,
    ...byClassification.community,
    ...byClassification.unknown,
  ];

  if (others.length > 0) {
    markdown += `### 👥 Others\n\n`;
    for (const analysis of others.slice(0, 10)) { // Limit to top 10 others
      markdown += `#### @${analysis.username}${analysis.displayName ? ` (${analysis.displayName})` : ''}\n\n`;
      markdown += `**Followers:** ${analysis.followerCount.toLocaleString()}\n\n`;
      if (analysis.whyFollow.length > 0) {
        markdown += `**Why Follow:** ${analysis.whyFollow.join(', ')}\n\n`;
      }
      markdown += `**Link:** [View Profile](https://warpcast.com/${analysis.username})\n\n`;
      markdown += `---\n\n`;
    }
  }

  markdown += `\n---\n\n`;
  markdown += `_Generated: ${formatDateISO(new Date())}_\n`;

  return markdown;
}

/**
 * Creates a following analysis artifact
 * @param analyses Array of following analyses
 * @param fid Your Farcaster ID
 * @param date Date for the artifact
 * @returns Path to the created artifact file
 */
export async function createFollowingArtifact(
  analyses: FollowingAnalysis[],
  fid: number,
  date: Date = new Date()
): Promise<string> {
  const filename = generateDateFilename('best-follows', 'md', date);
  const markdown = generateFollowingMarkdown(analyses, fid);

  return writeMarkdownLog(filename, markdown, date);
}
