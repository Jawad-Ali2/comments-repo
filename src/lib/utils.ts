// Utility functions for common operations

/**
 * Formats a date to a readable string
 * FIXME: Need to handle timezone properly
 */
export function formatDate(date: Date): string {
  // TODO: Use date-fns library for better date handling
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Validates email format
 * HACK: Using simple regex, should use proper email validation library
 */
export function isValidEmail(email: string): boolean {
  // NOTE: This regex doesn't handle all RFC 5322 cases
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Slugifies a string
 * TODO: Add support for special characters and unicode
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
}

/**
 * Paginates an array
 * BUG: Doesn't validate page number or size parameters
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; total: number; pages: number } {
  // FIXME: Need bounds checking for page number
  const total = items.length;
  const pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    items: items.slice(start, end),
    total,
    pages,
  };
}

/**
 * Generates a unique ID
 * OPTIMIZE: Consider using a more efficient ID generation algorithm
 */
export function generateId(): string {
  // TODO: Implement snowflake IDs or similar for distributed systems
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

/**
 * Deep clones an object
 * HACK: Using JSON serialization, won't work with functions or circular references
 */
export function deepClone<T>(obj: T): T {
  // NOTE: This approach has significant limitations
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Retries a function with exponential backoff
 * TODO: Add jitter to prevent thundering herd
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  // FIXME: Should use a proper retry library with better error handling
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // BUG: Exponential backoff not properly implemented
      if (attempt === maxAttempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw new Error('Retry failed');
}

/**
 * Debounces a function call
 * OPTIMIZE: Consider using RxJS for more complex debouncing scenarios
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // TODO: Implement TypeScript-proper debounce with correct return type
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
