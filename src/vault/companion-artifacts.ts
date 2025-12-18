import { writeMarkdownLog, generateDateFilename, getVaultRelativePath } from './logger.js';
import { formatDateISO, formatDateYYYYMMDD } from '../utils/date-helpers.js';
import type { DailyCompanionReport } from '../features/daily-companion.js';

/**
 * Generates markdown content for daily companion report
 */
function generateCompanionMarkdown(report: DailyCompanionReport): string {
  const date = formatDateYYYYMMDD(new Date(report.date));

  let markdown = `---
title: Farcaster Companion - ${date}
date: ${date}
fid: ${report.fid}
tags: [companion, farcaster, engagement]
---

# Farcaster Companion - ${date}

## Summary

- **Opportunities Found:** ${report.summary.totalOpportunities}
- **Average Score:** ${report.summary.averageScore}/100
- **Contexts Needed:** ${report.summary.contextsNeeded}

---

## 🎯 Engagement Opportunities

`;

  if (report.opportunities.length === 0) {
    markdown += `_No high-scoring engagement opportunities found today. Try adjusting the minimum score threshold._\n\n`;
  } else {
    report.opportunities.forEach((opp, index) => {
      const context = (opp as any).contextAnalysis;

      markdown += `### ${index + 1}. @${opp.author.username}${opp.author.displayName ? ` (${opp.author.displayName})` : ''}\n\n`;
      markdown += `**Score:** ${opp.engagementScore}/100\n\n`;
      markdown += `**Why:** ${opp.reasons.join(', ')}\n\n`;
      markdown += `**Engagement:** ${opp.replyCount} replies, ${opp.likeCount} likes, ${opp.recasts} recasts\n\n`;
      markdown += `**Cast:**\n\n`;
      markdown += `> ${opp.text.replace(/\n/g, '\n> ')}\n\n`;
      markdown += `**Link:** [View on Warpcast](${opp.farcasterUrl})\n\n`;

      if (context && context.needsExplanation && context.suggestedContext.length > 0) {
        markdown += `**Context Needed:**\n\n`;
        context.suggestedContext.forEach((ctx) => {
          markdown += `- ${ctx}\n`;
        });
        markdown += `\n`;
      }

      markdown += `---\n\n`;
    });
  }

  markdown += `\n## 📚 Learning Path\n\n`;
  markdown += `_For newcomers: Here are 3 things to learn today_\n\n`;
  markdown += `1. [To be populated with learning suggestions]\n`;
  markdown += `2. [To be populated with learning suggestions]\n`;
  markdown += `3. [To be populated with learning suggestions]\n\n`;

  markdown += `---\n\n`;
  markdown += `_Generated: ${report.date}_\n`;

  return markdown;
}

/**
 * Creates a daily companion artifact
 * @param report Daily companion report data
 * @param date Date for the artifact
 * @returns Path to the created artifact file
 */
export async function createCompanionArtifact(
  report: DailyCompanionReport,
  date: Date = new Date()
): Promise<string> {
  const filename = generateDateFilename('companion', 'md', date);
  const markdown = generateCompanionMarkdown(report);

  return writeMarkdownLog(filename, markdown, date);
}
