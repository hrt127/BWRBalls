import { writeJsonLog, writeMarkdownLog, generateDateFilename, getVaultRelativePath } from './logger.js';
import { generateProfileCard, generateDeployCastLog, generateMiniAppDocs } from './templates.js';
import type { ProfileCardData, DeployCastData, MiniAppMetadata } from './templates.js';
import { formatDateISO } from '../utils/date-helpers.js';
import path from 'path';
import fs from 'fs-extra';
import { getConfig } from '../core/config.js';

/**
 * Creates a feed log artifact (JSON)
 * @param feedData Feed data to log
 * @param fid Farcaster ID that was queried
 * @param date Date for the log (defaults to current date)
 * @returns Path to the created artifact file
 */
export async function createFeedLogArtifact(
  feedData: unknown,
  fid: number,
  date: Date = new Date()
): Promise<string> {
  const filename = generateDateFilename('feed-log', 'json', date);
  
  const artifactData = {
    fid,
    feedType: 'following',
    timestamp: formatDateISO(date),
    data: feedData,
  };
  
  return writeJsonLog(filename, artifactData, date);
}

/**
 * Creates a profile card artifact (Markdown)
 * @param profileData Profile data
 * @param date Date for the log (defaults to current date)
 * @returns Path to the created artifact file
 */
export async function createProfileCardArtifact(
  profileData: ProfileCardData,
  date: Date = new Date()
): Promise<string> {
  const filename = generateDateFilename('profile', 'md', date);
  const markdown = generateProfileCard({
    ...profileData,
    timestamp: formatDateISO(date),
  });
  
  return writeMarkdownLog(filename, markdown, date);
}

/**
 * Creates a deploy cast log artifact (Markdown)
 * @param castData Cast data
 * @param date Date for the log (defaults to current date)
 * @returns Path to the created artifact file
 */
export async function createDeployCastArtifact(
  castData: DeployCastData,
  date: Date = new Date()
): Promise<string> {
  const filename = `deploy-${castData.deployNumber}-cast-${castData.castHash.slice(0, 10)}.md`;
  const markdown = generateDeployCastLog({
    ...castData,
    timestamp: formatDateISO(date),
  });
  
  return writeMarkdownLog(filename, markdown, date);
}

/**
 * Creates a mini app documentation artifact (Markdown)
 * @param metadata Mini app metadata
 * @returns Path to the created artifact file
 */
export async function createMiniAppArtifact(metadata: MiniAppMetadata): Promise<string> {
  const config = getConfig();
  const miniAppsDir = path.join(config.vaultPath, 'mini-apps');
  await fs.ensureDir(miniAppsDir);
  
  const filename = `${metadata.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
  const filePath = path.join(miniAppsDir, filename);
  
  const markdown = generateMiniAppDocs(metadata);
  await fs.writeFile(filePath, markdown, 'utf-8');
  
  return filePath;
}

/**
 * Creates a follower balances analysis artifact (JSON)
 * @param analysisData Analysis data
 * @param fid Farcaster ID that was analyzed
 * @param contractAddress Contract address that was queried
 * @param date Date for the log (defaults to current date)
 * @returns Path to the created artifact file
 */
export async function createFollowerBalancesArtifact(
  analysisData: unknown,
  fid: number,
  contractAddress: string,
  date: Date = new Date()
): Promise<string> {
  const filename = generateDateFilename('follower-balances', 'json', date);
  
  const artifactData = {
    fid,
    contractAddress,
    timestamp: formatDateISO(date),
    analysis: analysisData,
  };
  
  return writeJsonLog(filename, artifactData, date);
}

/**
 * Creates or updates the vault README index
 * @returns Path to the README file
 */
export async function createVaultIndex(): Promise<string> {
  const config = getConfig();
  const readmePath = path.join(config.vaultPath, 'README.md');
  
  const readmeContent = `# Farcaster Integration Vault

This vault contains logs and artifacts from the Neynar Farcaster integration.

## Structure

\`\`\`
vault-logs/
├── YYYY/
│   └── MM/
│       └── DD/
│           ├── feed-log-YYYYMMDD.json
│           ├── profile-YYYYMMDD.md
│           ├── deploy-{N}-cast-{hash}.md
│           └── follower-balances-YYYYMMDD.json
└── mini-apps/
    └── {app-name}.md
\`\`\`

## Links

- [[Mini Apps|mini-apps/]]

---

_Last updated: ${formatDateISO()}_
`;
  
  await fs.writeFile(readmePath, readmeContent, 'utf-8');
  return readmePath;
}
