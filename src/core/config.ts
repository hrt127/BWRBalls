import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

/**
 * Configuration schema for validation
 */
const ConfigSchema = z.object({
  neynarApiKey: z.string().min(1, 'NEYNAR_API_KEY is required'),
  neynarSignerUuid: z.string().min(1, 'NEYNAR_SIGNER_UUID is required'),
  fid: z.number().int().positive('FID must be a positive integer'),
  vaultPath: z.string().min(1, 'VAULT_PATH is required'),
  rpcUrl: z.string().url('RPC_URL must be a valid URL').optional(),
});

/**
 * Typed configuration object
 */
export type Config = z.infer<typeof ConfigSchema>;

/**
 * Validates and loads configuration from environment variables
 * @returns Validated configuration object
 * @throws Error if required configuration is missing or invalid
 */
export function loadConfig(): Config {
  const fid = process.env.FID ? parseInt(process.env.FID, 10) : undefined;
  
  const rawConfig = {
    neynarApiKey: process.env.NEYNAR_API_KEY,
    neynarSignerUuid: process.env.NEYNAR_SIGNER_UUID,
    fid,
    vaultPath: process.env.VAULT_PATH || './vault-logs',
    rpcUrl: process.env.RPC_URL,
  };

  // Resolve vault path to absolute
  if (rawConfig.vaultPath) {
    rawConfig.vaultPath = path.resolve(rawConfig.vaultPath);
  }

  const result = ConfigSchema.safeParse(rawConfig);

  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Configuration validation failed: ${errors}`);
  }

  return result.data;
}

/**
 * Singleton config instance
 */
let configInstance: Config | null = null;

/**
 * Gets the configuration instance (singleton pattern)
 * @returns Configuration object
 */
export function getConfig(): Config {
  if (!configInstance) {
    configInstance = loadConfig();
  }
  return configInstance;
}
