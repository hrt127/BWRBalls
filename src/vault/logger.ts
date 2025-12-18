import fs from 'fs-extra';
import path from 'path';
import { getConfig } from '../core/config.js';
import { formatDatePath, formatDateYYYYMMDDCompact, formatDateISO } from '../utils/date-helpers.js';

/**
 * Ensures the vault log directory structure exists for a given date
 * @param date Date object (defaults to current date)
 * @returns Path to the date directory
 */
export async function ensureVaultLogDirectory(date: Date = new Date()): Promise<string> {
  const config = getConfig();
  const datePath = formatDatePath(date);
  const fullPath = path.join(config.vaultPath, datePath);
  
  await fs.ensureDir(fullPath);
  return fullPath;
}

/**
 * Writes a JSON log file to the vault
 * @param filename Filename (without path)
 * @param data Data to write as JSON
 * @param date Date object (defaults to current date)
 * @returns Path to the created file
 */
export async function writeJsonLog(
  filename: string,
  data: unknown,
  date: Date = new Date()
): Promise<string> {
  const dirPath = await ensureVaultLogDirectory(date);
  const filePath = path.join(dirPath, filename);
  
  const logData = {
    timestamp: formatDateISO(date),
    ...(typeof data === 'object' && data !== null ? data : { data }),
  };
  
  await fs.writeJSON(filePath, logData, { spaces: 2 });
  return filePath;
}

/**
 * Writes a Markdown log file to the vault
 * @param filename Filename (without path)
 * @param content Markdown content
 * @param date Date object (defaults to current date)
 * @returns Path to the created file
 */
export async function writeMarkdownLog(
  filename: string,
  content: string,
  date: Date = new Date()
): Promise<string> {
  const dirPath = await ensureVaultLogDirectory(date);
  const filePath = path.join(dirPath, filename);
  
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

/**
 * Generates a date-based filename with extension
 * @param prefix Filename prefix
 * @param extension File extension (without dot)
 * @param date Date object (defaults to current date)
 * @returns Generated filename
 */
export function generateDateFilename(
  prefix: string,
  extension: string,
  date: Date = new Date()
): string {
  const dateStr = formatDateYYYYMMDDCompact(date);
  return `${prefix}-${dateStr}.${extension}`;
}

/**
 * Creates a cross-link for Obsidian
 * @param linkText Text to display in the link
 * @param targetPath Target file path (relative to vault root)
 * @returns Obsidian link format [[path|text]]
 */
export function createObsidianLink(linkText: string, targetPath: string): string {
  // Normalize path separators
  const normalizedPath = targetPath.replace(/\\/g, '/');
  return `[[${normalizedPath}|${linkText}]]`;
}

/**
 * Gets the relative path from vault root to a file
 * @param filePath Absolute file path
 * @returns Relative path from vault root
 */
export function getVaultRelativePath(filePath: string): string {
  const config = getConfig();
  return path.relative(config.vaultPath, filePath);
}
