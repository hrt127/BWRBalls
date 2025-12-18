import { findEngagementOpportunities, type EngagementOpportunity } from './reply-radar.js';
import { analyzeContext } from './context-analyzer.js';
import { getConfig } from '../core/config.js';
import { formatDateISO, formatDateYYYYMMDD } from '../utils/date-helpers.js';
import { createCompanionArtifact } from '../vault/companion-artifacts.js';

/**
 * Daily companion report data
 */
export interface DailyCompanionReport {
  date: string;
  fid: number;
  opportunities: EngagementOpportunity[];
  summary: {
    totalOpportunities: number;
    averageScore: number;
    contextsNeeded: number;
  };
}

/**
 * Generates a daily companion report
 * @param options Options for report generation
 * @returns Report data and artifact path
 */
export async function generateDailyCompanion(
  options: { limit?: number; minScore?: number; maxResults?: number } = {}
): Promise<{ report: DailyCompanionReport; artifactPath: string }> {
  const config = getConfig();
  const date = new Date();

  console.log('=== Generating Daily Farcaster Companion ===\n');

  // Find engagement opportunities
  const opportunities = await findEngagementOpportunities(config.fid, {
    limit: options.limit || 50,
    minScore: options.minScore || 5,
    maxResults: options.maxResults || 5,
  });

  // Analyze context for each opportunity
  for (const opp of opportunities) {
    const context = analyzeContext(opp.text, opp.castHash);
    // Store context analysis in opportunity (extend interface if needed)
    (opp as any).contextAnalysis = context;
  }

  // Calculate summary
  const totalScore = opportunities.reduce((sum, opp) => sum + opp.engagementScore, 0);
  const averageScore = opportunities.length > 0 ? totalScore / opportunities.length : 0;
  const contextsNeeded = opportunities.filter(
    (opp) => (opp as any).contextAnalysis?.needsExplanation
  ).length;

  const report: DailyCompanionReport = {
    date: formatDateISO(date),
    fid: config.fid,
    opportunities,
    summary: {
      totalOpportunities: opportunities.length,
      averageScore: Math.round(averageScore),
      contextsNeeded,
    },
  };

  // Create artifact
  const artifactPath = await createCompanionArtifact(report, date);

  console.log(`\n✅ Daily companion report generated!`);
  console.log(`   Opportunities found: ${report.summary.totalOpportunities}`);
  console.log(`   Average score: ${report.summary.averageScore}`);
  console.log(`   Contexts needed: ${report.summary.contextsNeeded}`);
  console.log(`   Artifact: ${artifactPath}`);

  return {
    report,
    artifactPath,
  };
}
