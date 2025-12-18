import type { EngagementOpportunity } from './reply-radar.js';

/**
 * Engagement quality classification
 */
export type EngagementClassification = 'builder' | 'creator' | 'trader' | 'bot' | 'scammer' | 'unknown';

/**
 * Quality signals for engagement
 */
export interface QualitySignals {
  sustainedConversations: boolean;
  thoughtfulReplies: boolean;
  realProjects: boolean;
  onchainActivity: boolean;
  consistentActivity: boolean;
  spamPatterns: boolean;
}

/**
 * Engagement quality assessment
 */
export interface EngagementQuality {
  score: number; // 0-1, meaningful engagement
  botLikelihood: number; // 0-1
  scammerFlags: string[];
  classification: EngagementClassification;
  qualitySignals: QualitySignals;
  confidence: number; // 0-1
}

/**
 * Options for quality assessment
 */
export interface QualityAssessmentOptions {
  checkOnchain?: boolean;
  checkHistory?: boolean;
  strictMode?: boolean;
}

/**
 * Assesses engagement quality for an opportunity
 * @param opportunity Engagement opportunity to assess
 * @param options Assessment options
 * @returns Quality assessment
 */
export async function assessEngagementQuality(
  opportunity: EngagementOpportunity,
  options: QualityAssessmentOptions = {}
): Promise<EngagementQuality> {
  const {
    checkOnchain = false,
    checkHistory = false,
    strictMode = false,
  } = options;

  // Initialize quality signals
  const signals: QualitySignals = {
    sustainedConversations: opportunity.replyCount > 3,
    thoughtfulReplies: opportunity.replyCount > 0 && opportunity.engagementScore > 20,
    realProjects: false, // TODO: Check for project mentions, links, etc.
    onchainActivity: false, // TODO: Check onchain if enabled
    consistentActivity: false, // TODO: Check activity history if enabled
    spamPatterns: false, // TODO: Detect spam patterns
  };

  // Bot detection (basic heuristics)
  let botLikelihood = 0;
  const botFlags: string[] = [];

  // High engagement with no replies might indicate bot
  if (opportunity.likeCount > 50 && opportunity.replyCount === 0) {
    botLikelihood += 0.3;
    botFlags.push('High likes, no conversation');
  }

  // Very high recast-to-reply ratio
  if (opportunity.recastCount > opportunity.replyCount * 5 && opportunity.recastCount > 10) {
    botLikelihood += 0.2;
    botFlags.push('High recast-to-reply ratio');
  }

  // Scammer detection (basic heuristics)
  const scammerFlags: string[] = [];
  
  // Check for common scam patterns in text
  const scamPatterns = [
    /free.*money/i,
    /guaranteed.*profit/i,
    /click.*here.*now/i,
    /limited.*time/i,
  ];

  for (const pattern of scamPatterns) {
    if (pattern.test(opportunity.text)) {
      scammerFlags.push('Suspicious text pattern detected');
      break;
    }
  }

  // Classification
  let classification: EngagementClassification = 'unknown';
  
  if (botLikelihood > 0.5) {
    classification = 'bot';
  } else if (scammerFlags.length > 0) {
    classification = 'scammer';
  } else if (signals.sustainedConversations && signals.thoughtfulReplies) {
    classification = 'creator';
  } else if (signals.realProjects) {
    classification = 'builder';
  } else if (opportunity.recastCount > opportunity.replyCount * 2) {
    classification = 'trader';
  }

  // Quality score (0-1)
  let qualityScore = 0.5; // Base score
  
  if (signals.sustainedConversations) qualityScore += 0.2;
  if (signals.thoughtfulReplies) qualityScore += 0.2;
  if (signals.realProjects) qualityScore += 0.1;
  if (!signals.spamPatterns) qualityScore += 0.1;
  
  // Penalties
  if (botLikelihood > 0.5) qualityScore -= 0.5;
  if (scammerFlags.length > 0) qualityScore -= 0.5;
  
  qualityScore = Math.max(0, Math.min(1, qualityScore));

  // Confidence based on available data
  let confidence = 0.5;
  if (checkHistory) confidence += 0.2;
  if (checkOnchain) confidence += 0.2;
  if (signals.sustainedConversations) confidence += 0.1;

  return {
    score: qualityScore,
    botLikelihood,
    scammerFlags,
    classification,
    qualitySignals: signals,
    confidence: Math.min(1, confidence),
  };
}

/**
 * Filters opportunities by quality
 * @param opportunities Array of opportunities
 * @param minQuality Minimum quality score (0-1)
 * @param excludeBots Whether to exclude bot-like activity
 * @param excludeScammers Whether to exclude scammer-like activity
 * @returns Filtered opportunities with quality assessments
 */
export async function filterByQuality(
  opportunities: EngagementOpportunity[],
  minQuality: number = 0.5,
  excludeBots: boolean = true,
  excludeScammers: boolean = true
): Promise<Array<EngagementOpportunity & { quality: EngagementQuality }>> {
  const results: Array<EngagementOpportunity & { quality: EngagementQuality }> = [];

  for (const opp of opportunities) {
    const quality = await assessEngagementQuality(opp);

    // Apply filters
    if (quality.score < minQuality) continue;
    if (excludeBots && quality.botLikelihood > 0.5) continue;
    if (excludeScammers && quality.scammerFlags.length > 0) continue;

    results.push({
      ...opp,
      quality,
    });
  }

  return results;
}
