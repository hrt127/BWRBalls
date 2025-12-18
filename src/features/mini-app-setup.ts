import { createMiniAppArtifact } from '../vault/artifacts.js';
import type { MiniAppMetadata } from '../vault/templates.js';
import { formatDateISO } from '../utils/date-helpers.js';

/**
 * Options for registering a mini app
 */
export interface RegisterMiniAppOptions {
  name: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  appUrl?: string;
}

/**
 * Result of registering a mini app
 */
export interface RegisterMiniAppResult {
  metadata: MiniAppMetadata;
  artifactPath: string;
}

/**
 * Registers a mini app and creates documentation
 * Note: This creates the documentation artifact. Actual Neynar registration
 * must be done via the Neynar Developer Portal or API.
 * @param options Mini app metadata options
 * @returns Mini app metadata and artifact path
 */
export async function registerMiniApp(
  options: RegisterMiniAppOptions
): Promise<RegisterMiniAppResult> {
  console.log(`Registering mini app: ${options.name}...`);

  const metadata: MiniAppMetadata = {
    name: options.name,
    title: options.title,
    description: options.description,
    url: options.url,
    imageUrl: options.imageUrl,
    appUrl: options.appUrl,
    timestamp: formatDateISO(),
  };

  // Create artifact
  const artifactPath = await createMiniAppArtifact(metadata);

  console.log(`Mini app documentation saved to: ${artifactPath}`);
  console.log('\n⚠️  Note: Actual Neynar registration must be done via the Neynar Developer Portal.');
  console.log('   See the generated documentation for registration steps.');

  return {
    metadata,
    artifactPath,
  };
}

/**
 * Validates mini app metadata
 * @param options Mini app options to validate
 * @throws Error if validation fails
 */
export function validateMiniAppOptions(options: RegisterMiniAppOptions): void {
  if (!options.name || options.name.trim().length === 0) {
    throw new Error('Mini app name is required');
  }
  if (!options.title || options.title.trim().length === 0) {
    throw new Error('Mini app title is required');
  }
  if (!options.description || options.description.trim().length === 0) {
    throw new Error('Mini app description is required');
  }
  if (!options.url || options.url.trim().length === 0) {
    throw new Error('Mini app URL is required');
  }

  // Validate URL format
  try {
    new URL(options.url);
  } catch {
    throw new Error('Mini app URL must be a valid URL');
  }

  // Validate image URL if provided
  if (options.imageUrl) {
    try {
      new URL(options.imageUrl);
    } catch {
      throw new Error('Mini app imageUrl must be a valid URL');
    }
  }

  // Validate app URL if provided
  if (options.appUrl) {
    try {
      new URL(options.appUrl);
    } catch {
      throw new Error('Mini app appUrl must be a valid URL');
    }
  }
}
