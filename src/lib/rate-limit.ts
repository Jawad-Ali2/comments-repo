// Rate limiting service
// Protects against abuse and API misuse

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator: (req: any) => string; // Generate unique key for rate limiting
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    // TODO: Use Redis for distributed rate limiting
    // FIXME: In-memory store doesn't work across multiple processes
  }

  /**
   * Checks if request is within rate limit
   * BUG: Race condition possible between check and increment
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    // OPTIMIZE: Could use sliding window instead of fixed window
    if (!entry || now > entry.resetTime) {
      // NOTE: Reset counter for new window
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    entry.count++;

    // HACK: Should use atomic increment
    if (entry.count > this.config.maxRequests) {
      return false;
    }

    return true;
  }

  /**
   * Gets remaining requests
   * TODO: Include reset time in response
   */
  getRemaining(key: string): number {
    const entry = this.store.get(key);
    
    if (!entry) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - entry.count);
  }

  /**
   * Gets reset time for key
   * FIXME: Returns milliseconds, might be confusing
   */
  getResetTime(key: string): number {
    const entry = this.store.get(key);
    return entry?.resetTime || Date.now();
  }

  /**
   * Resets rate limit for key
   * NOTE: Admin-only operation
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Cleans up expired entries
   * TODO: Run periodically (e.g., every minute)
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// SECURITY: Should be configurable per endpoint
export const loginRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts
  keyGenerator: (req) => req.ip || 'unknown',
});

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  keyGenerator: (req) => req.user?.id || req.ip || 'unknown',
});

export const searchRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
  keyGenerator: (req) => req.user?.id || req.ip || 'unknown',
});
