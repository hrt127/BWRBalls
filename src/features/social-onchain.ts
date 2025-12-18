import { getNeynarClient, withRetry } from '../core/neynar-client.js';
import { getConfig } from '../core/config.js';
import { createFollowerBalancesArtifact } from '../vault/artifacts.js';
import { ethers } from 'ethers';

/**
 * Follower balance analysis result
 */
export interface FollowerBalance {
  fid: number;
  username: string;
  address: string;
  balance: string; // BigNumber as string
  hasToken: boolean;
}

/**
 * Analysis result
 */
export interface FollowerAnalysis {
  totalFollowers: number;
  followersChecked: number;
  holders: FollowerBalance[];
  nonHolders: FollowerBalance[];
  contractAddress: string;
  timestamp: string;
}

/**
 * Options for analyzing follower balances
 */
export interface AnalyzeFollowerBalancesOptions {
  limit?: number;
  contractType?: 'ERC721' | 'ERC20'; // Default: ERC721
  tokenId?: number; // For ERC721, check specific token ID (default: any)
}

/**
 * Analyzes follower balances for a given contract
 * @param fid Farcaster ID to analyze followers for
 * @param contractAddress Contract address to check balances
 * @param options Analysis options
 * @returns Analysis result and artifact path
 */
export async function analyzeFollowerBalances(
  fid: number,
  contractAddress: string,
  options: AnalyzeFollowerBalancesOptions = {}
): Promise<{ analysis: FollowerAnalysis; artifactPath: string }> {
  const config = getConfig();
  const client = getNeynarClient();

  if (!config.rpcUrl) {
    throw new Error('RPC_URL is required for onchain analysis');
  }

  const {
    limit = 100,
    contractType = 'ERC721',
    tokenId,
  } = options;

  console.log(`Analyzing follower balances for FID ${fid}...`);
  console.log(`Contract: ${contractAddress} (${contractType})`);

  // Fetch followers
  const followersResponse = await withRetry(async () => {
    return await client.fetchUserFollowers(fid, { limit });
  });

  const followers = followersResponse.result.users || [];
  console.log(`Fetched ${followers.length} followers`);

  // Set up provider
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);

  // Prepare contract interface based on type
  let contractInterface: ethers.Interface;
  if (contractType === 'ERC721') {
    // ERC721 balanceOf(address) or ownerOf(uint256)
    contractInterface = new ethers.Interface([
      'function balanceOf(address owner) view returns (uint256)',
      'function ownerOf(uint256 tokenId) view returns (address)',
    ]);
  } else {
    // ERC20 balanceOf(address)
    contractInterface = new ethers.Interface([
      'function balanceOf(address owner) view returns (uint256)',
    ]);
  }

  const contract = new ethers.Contract(contractAddress, contractInterface, provider);

  // Analyze each follower
  const holders: FollowerBalance[] = [];
  const nonHolders: FollowerBalance[] = [];
  let checked = 0;

  for (const follower of followers) {
    const addresses = follower.verified_addresses?.eth_addresses || [];

    if (addresses.length === 0) {
      nonHolders.push({
        fid: follower.fid,
        username: follower.username,
        address: 'N/A',
        balance: '0',
        hasToken: false,
      });
      continue;
    }

    // Check each verified address
    let hasToken = false;
    let balance = ethers.parseUnits('0', 0);
    let checkedAddress = addresses[0]; // Use first verified address

    try {
      if (contractType === 'ERC721') {
        if (tokenId !== undefined) {
          // Check if this address owns the specific token
          const owner = await contract.ownerOf(tokenId);
          hasToken = owner.toLowerCase() === checkedAddress.toLowerCase();
          balance = hasToken ? ethers.parseUnits('1', 0) : ethers.parseUnits('0', 0);
        } else {
          // Check balance (number of tokens owned)
          balance = await contract.balanceOf(checkedAddress);
          hasToken = balance > 0n;
        }
      } else {
        // ERC20 balance check
        balance = await contract.balanceOf(checkedAddress);
        hasToken = balance > 0n;
      }

      const followerBalance: FollowerBalance = {
        fid: follower.fid,
        username: follower.username,
        address: checkedAddress,
        balance: balance.toString(),
        hasToken,
      };

      if (hasToken) {
        holders.push(followerBalance);
      } else {
        nonHolders.push(followerBalance);
      }

      checked++;

      // Small delay to avoid rate limiting
      if (checked < followers.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.warn(`Failed to check balance for @${follower.username}:`, error);
      nonHolders.push({
        fid: follower.fid,
        username: follower.username,
        address: checkedAddress,
        balance: '0',
        hasToken: false,
      });
    }
  }

  const analysis: FollowerAnalysis = {
    totalFollowers: followers.length,
    followersChecked: checked,
    holders,
    nonHolders,
    contractAddress,
    timestamp: new Date().toISOString(),
  };

  console.log(`Analysis complete:`);
  console.log(`  Total followers: ${analysis.totalFollowers}`);
  console.log(`  Holders: ${analysis.holders.length}`);
  console.log(`  Non-holders: ${analysis.nonHolders.length}`);

  // Create artifact
  const artifactPath = await createFollowerBalancesArtifact(
    analysis,
    fid,
    contractAddress
  );

  console.log(`Follower balances analysis saved to: ${artifactPath}`);

  return {
    analysis,
    artifactPath,
  };
}
