/**
 * Formats a date as YYYY-MM-DD
 * @param date Date object (defaults to current date)
 * @returns Formatted date string
 */
export function formatDateYYYYMMDD(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a date as YYYYMMDD (without separators)
 * @param date Date object (defaults to current date)
 * @returns Formatted date string
 */
export function formatDateYYYYMMDDCompact(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Formats a date as YYYY/MM/DD (for directory paths)
 * @param date Date object (defaults to current date)
 * @returns Formatted date string for paths
 */
export function formatDatePath(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * Formats a date as ISO 8601 string
 * @param date Date object (defaults to current date)
 * @returns ISO 8601 formatted string
 */
export function formatDateISO(date: Date = new Date()): string {
  return date.toISOString();
}
