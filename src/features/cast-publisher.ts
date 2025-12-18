import { getNeynarClient, withRetry } from '../core/neynar-client.js';
import { getConfig } from '../core/config.js';
import { createDeployCastArtifact } from '../vault/artifacts.js';
import type { DeployCastData } from '../vault/templates.js';

/**
 * Options for publishing a cast
 */
export interface PublishCastOptions {
  embeds?: Array<{ url: string }>;
  replyTo?: string; // Cast hash to reply to
}

/**
 * Result of publishing a cast
 */
export interface PublishCastResult {
  castHash: string;
  artifactPath: string;
}

/**
 * Publishes a cast to Farcaster via Neynar
 * @param text Cast text content
 * @param deployNumber Optional deploy number for logging
 * @param options Additional cast options (embeds, replyTo)
 * @returns Cast hash and artifact path
 */
export async function publishDeployCast(
  text: string,
  deployNumber?: number,
  options: PublishCastOptions = {}
): Promise<PublishCastResult> {
  const client = getNeynarClient();
  const config = getConfig();

  if (!config.neynarSignerUuid) {
    throw new Error('NEYNAR_SIGNER_UUID is required to publish casts');
  }

  const deployNum = deployNumber || 0;
  console.log(`Publishing cast${deployNum > 0 ? ` for Deploy #${deployNum}` : ''}...`);

  const cast = await withRetry(async () => {
    return await client.publishCast(config.neynarSignerUuid, text, {
      embeds: options.embeds,
      replyTo: options.replyTo,
    });
  });

  const castHash = cast.hash;
  console.log(`Cast published: ${castHash}`);

  const castData: DeployCastData = {
    deployNumber: deployNum,
    castHash,
    text,
    timestamp: new Date().toISOString(),
    farcasterUrl: `https://warpcast.com/~/conversations/${castHash}`,
  };

  // Create artifact
  const artifactPath = await createDeployCastArtifact(castData);

  console.log(`Deploy cast log saved to: ${artifactPath}`);

  return {
    castHash,
    artifactPath,
  };
}

/**
 * Publishes a cast with a link embed
 * @param text Cast text content
 * @param url URL to embed
 * @param deployNumber Optional deploy number for logging
 * @returns Cast hash and artifact path
 */
export async function publishCastWithLink(
  text: string,
  url: string,
  deployNumber?: number
): Promise<PublishCastResult> {
  return publishDeployCast(text, deployNumber, {
    embeds: [{ url }],
  });
}

/**
 * Replies to an existing cast
 * @param text Reply text content
 * @param replyToHash Cast hash to reply to
 * @param deployNumber Optional deploy number for logging
 * @returns Cast hash and artifact path
 */
export async function replyToCast(
  text: string,
  replyToHash: string,
  deployNumber?: number
): Promise<PublishCastResult> {
  return publishDeployCast(text, deployNumber, {
    replyTo: replyToHash,
  });
}
