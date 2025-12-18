import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { getConfig } from './config.js';

/**
 * Singleton Neynar API client instance
 */
let neynarClientInstance: NeynarAPIClient | null = null;

/**
 * Retry configuration for API calls
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
};

/**
 * Sleep utility for retry logic
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gets or creates the Neynar API client instance (singleton pattern)
 * @returns NeynarAPIClient instance
 */
export function getNeynarClient(): NeynarAPIClient {
  if (!neynarClientInstance) {
    const config = getConfig();
    neynarClientInstance = new NeynarAPIClient(config.neynarApiKey);
  }
  return neynarClientInstance;
}

/**
 * Executes an API call with retry logic
 * @param fn Function that returns a Promise
 * @param retries Remaining retries
 * @returns Result of the API call
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = RETRY_CONFIG.maxRetries
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`API call failed, retrying... (${retries} retries left)`);
      await sleep(RETRY_CONFIG.retryDelay);
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}

/**
 * Validates that the API client is properly configured
 * @throws Error if client is not configured
 */
export function validateClient(): void {
  try {
    const config = getConfig();
    if (!config.neynarApiKey) {
      throw new Error('NEYNAR_API_KEY is not configured');
    }
  } catch (error) {
    throw new Error(`Neynar client validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
