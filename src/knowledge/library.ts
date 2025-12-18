/**
 * Knowledge entry types
 */
export type KnowledgeType = 'person' | 'feature' | 'culture' | 'topic' | 'channel' | 'tool';

/**
 * Knowledge entry interface
 */
export interface KnowledgeEntry {
  id: string;
  type: KnowledgeType;
  title: string;
  description: string;
  explanation: string;
  whyMatters?: string; // Why this is funny/important (for inside jokes)
  examples: string[];
  sources: string[];
  firstSeen: string; // ISO date
  lastUpdated: string; // ISO date
  validUntil?: string; // When this becomes outdated
  confidence: number; // 0-1
  related: string[]; // Related knowledge IDs
  problemItSolves?: string[]; // Which problems this addresses
}

/**
 * Simple in-memory knowledge library
 * In future, can be replaced with file-based or database storage
 */
class KnowledgeLibrary {
  private entries: Map<string, KnowledgeEntry> = new Map();

  /**
   * Adds or updates a knowledge entry
   */
  addEntry(entry: KnowledgeEntry): void {
    this.entries.set(entry.id, entry);
  }

  /**
   * Gets a knowledge entry by ID
   */
  getEntry(id: string): KnowledgeEntry | undefined {
    return this.entries.get(id);
  }

  /**
   * Searches for knowledge entries by keyword
   */
  search(query: string): KnowledgeEntry[] {
    const lowerQuery = query.toLowerCase();
    const results: KnowledgeEntry[] = [];

    for (const entry of this.entries.values()) {
      if (
        entry.title.toLowerCase().includes(lowerQuery) ||
        entry.description.toLowerCase().includes(lowerQuery) ||
        entry.explanation.toLowerCase().includes(lowerQuery)
      ) {
        results.push(entry);
      }
    }

    return results;
  }

  /**
   * Gets all entries of a specific type
   */
  getByType(type: KnowledgeType): KnowledgeEntry[] {
    const results: KnowledgeEntry[] = [];
    for (const entry of this.entries.values()) {
      if (entry.type === type) {
        results.push(entry);
      }
    }
    return results;
  }

  /**
   * Initializes with basic Farcaster knowledge
   */
  initialize(): void {
    // Basic cultural references
    this.addEntry({
      id: 'gm',
      type: 'culture',
      title: 'gm (good morning)',
      description: 'Common greeting on Farcaster',
      explanation: 'gm is short for "good morning" - a common greeting in the Farcaster community. It\'s used throughout the day, not just in the morning, as a friendly way to say hello.',
      whyMatters: 'It\'s the most common greeting on Farcaster. Not knowing this makes you stand out as a newcomer.',
      examples: ['gm frens', 'gm gm', 'gm everyone'],
      sources: [],
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 1.0,
      related: [],
    });

    this.addEntry({
      id: 'wagmi',
      type: 'culture',
      title: 'wagmi (we all gonna make it)',
      description: 'Positive community sentiment',
      explanation: 'wagmi means "we all gonna make it" - an expression of optimism and community support. Used to encourage others and express confidence in the community\'s success.',
      whyMatters: 'Common expression of community solidarity and optimism.',
      examples: ['wagmi frens', 'we wagmi'],
      sources: [],
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 1.0,
      related: [],
    });

    this.addEntry({
      id: 'ngmi',
      type: 'culture',
      title: 'ngmi (not gonna make it)',
      description: 'Opposite of wagmi',
      explanation: 'ngmi means "not gonna make it" - used humorously or seriously to indicate someone is missing out or making poor decisions.',
      whyMatters: 'Common expression, often used in jest or to call out bad behavior.',
      examples: ['ngmi if you don\'t understand this', 'that\'s ngmi behavior'],
      sources: [],
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 1.0,
      related: ['wagmi'],
    });

    // Tools
    this.addEntry({
      id: 'harmony-bot',
      type: 'tool',
      title: 'Harmony Bot',
      description: 'AI art generator for profile pictures',
      explanation: 'Harmony bot creates AI-generated art versions of your profile picture. It has ongoing themes that evolve, and you can gift your friends. It\'s a fixed theme that evolves over time.',
      whyMatters: 'A wholesome, budget-friendly way to gift friends and create unique art. Inexpensive but unique.',
      examples: ['Tag @harmonybot to create art', 'Gift art to friends'],
      sources: [],
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 0.8,
      related: [],
    });

    this.addEntry({
      id: 'emerge',
      type: 'tool',
      title: 'Emerge',
      description: 'Flexible AI art generator',
      explanation: 'Emerge is similar to Harmony bot but more flexible and cheaper. It can create any style of art, not just fixed themes. Great for gifting friends.',
      whyMatters: 'More flexible than Harmony bot, cheaper, still wholesome and fun.',
      examples: ['Create any style of art', 'Gift to friends'],
      sources: [],
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 0.8,
      related: ['harmony-bot'],
    });

    this.addEntry({
      id: 'bankr',
      type: 'tool',
      title: 'Bankr',
      description: 'AI-powered trading agent',
      explanation: 'Bankr is an AI-powered trading agent that lets you trade using natural language commands. It supports cross-chain trading, limit orders, and token deployment. Powerful but less quick/easy for newbies compared to Nyor.',
      whyMatters: 'One of the best trading tools on Farcaster, but has a learning curve.',
      examples: ['Buy $200 of $BNKR', 'Swap 0.1 ETH to USDC'],
      sources: [],
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 0.9,
      related: [],
    });

    this.addEntry({
      id: 'nyor',
      type: 'tool',
      title: 'Nyor',
      description: 'Easy contextual on-chain data tool',
      explanation: 'Nyor (by apple.eth) provides easy, cool chat interface with contextual on-chain data. It gives you more than just on-chain data - it provides context too. Easier for newbies than Bankr.',
      whyMatters: 'Great for beginners who want on-chain context without the complexity of Bankr.',
      examples: ['Check wallet context', 'Get on-chain insights'],
      sources: [],
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 0.8,
      related: ['bankr'],
    });
  }
}

// Singleton instance
let knowledgeLibraryInstance: KnowledgeLibrary | null = null;

/**
 * Gets the knowledge library instance
 */
export function getKnowledgeLibrary(): KnowledgeLibrary {
  if (!knowledgeLibraryInstance) {
    knowledgeLibraryInstance = new KnowledgeLibrary();
    knowledgeLibraryInstance.initialize();
  }
  return knowledgeLibraryInstance;
}
