// A simple in-memory rate limiter.
// Note: This is a basic implementation suitable for single-server instances.
// For distributed systems, a solution like Redis would be more appropriate.

type RateLimiterConfig = {
    [key: string]: {
      timestamps: number[];
      limit: number;
      windowMs: number;
    };
  };
  
  const config: RateLimiterConfig = {
    "color-ai": {
      timestamps: [],
      limit: 30, // 30 requests
      windowMs: 60 * 1000, // per 1 minute
    },
  };
  
  class RateLimiter {
    private store: RateLimiterConfig;
  
    constructor(initialConfig: RateLimiterConfig) {
      this.store = initialConfig;
    }
  
    public async limit(id: string): Promise<{ success: boolean }> {
      const now = Date.now();
      const limiter = this.store[id];
  
      if (!limiter) {
        console.warn(`Rate limiter with id "${id}" does not exist.`);
        return { success: true }; // Fail open if limiter is not configured
      }
  
      // Remove timestamps older than the window
      limiter.timestamps = limiter.timestamps.filter(
        (timestamp) => timestamp > now - limiter.windowMs
      );
  
      // Check if the limit is exceeded
      if (limiter.timestamps.length >= limiter.limit) {
        return { success: false };
      }
  
      // Add the new request timestamp
      limiter.timestamps.push(now);
      return { success: true };
    }
  }
  
  export const rateLimiter = new RateLimiter(config);
  