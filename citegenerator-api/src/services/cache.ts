import { LRUCache } from "lru-cache";

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

export interface CacheConfig {
  l1MaxItems: number;
  l1TtlMs: number;
  l2Enabled: boolean;
  l2MaxItems: number;
  l2TtlMs: number;
  l2RedisUrl?: string;
}

interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { PX?: number }): Promise<void>;
  del(key: string): Promise<void>;
  flushdb(): Promise<void>;
}

const DEFAULT_CONFIG: CacheConfig = {
  l1MaxItems: 100,
  l1TtlMs: 5 * 60 * 1000,
  l2Enabled: false,
  l2MaxItems: 5000,
  l2TtlMs: 60 * 60 * 1000,
};

export interface TieredCache {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  getStats(): CacheStats;
  getL1Stats(): { size: number; hits: number; misses: number };
}

function createRedisClient(url: string): RedisClient | null {
  try {
    console.log("[Cache] Redis configured but package not installed - L2 disabled");
    return null;
  } catch {
    return null;
  }
}

export function createTieredCache(config: Partial<CacheConfig> = {}): TieredCache {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const l1Cache = new LRUCache<string, CacheEntry<unknown>>({
    max: cfg.l1MaxItems,
    ttl: cfg.l1TtlMs,
  });

  let l2Client: RedisClient | null = null;
  if (cfg.l2Enabled && cfg.l2RedisUrl) {
    l2Client = createRedisClient(cfg.l2RedisUrl);
    if (l2Client) {
      console.log("[Cache] L2 (Redis) enabled");
    }
  }

  const stats = {
    l1Hits: 0,
    l1Misses: 0,
    l2Hits: 0,
    l2Misses: 0,
  };

  const l1Key = (key: string) => "l1:" + key;
  const l2Key = (key: string) => "l2:" + key;

  return {
    async get<T>(key: string): Promise<T | undefined> {
      const now = Date.now();

      const l1Entry = l1Cache.get(l1Key(key)) as CacheEntry<T> | undefined;
      if (l1Entry && l1Entry.expiresAt > now) {
        stats.l1Hits++;
        console.log("[Cache] L1 hit: " + key);
        return l1Entry.value;
      }

      if (l2Client) {
        try {
          const raw = await l2Client.get(l2Key(key));
          if (raw) {
            stats.l2Hits++;
            console.log("[Cache] L2 hit: " + key);
            const parsed = JSON.parse(raw) as CacheEntry<T>;
            l1Cache.set(l1Key(key), parsed);
            return parsed.value;
          }
          stats.l2Misses++;
        } catch (err) {
          console.error("[Cache] L2 error:", err);
        }
      }

      stats.l1Misses++;
      console.log("[Cache] Miss: " + key);
      return undefined;
    },

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
      const effectiveTtl = ttl ?? cfg.l1TtlMs;
      const entry: CacheEntry<T> = {
        value,
        expiresAt: Date.now() + effectiveTtl,
      };

      l1Cache.set(l1Key(key), entry as CacheEntry<unknown>);

      if (l2Client) {
        try {
          const l2Ttl = ttl ?? cfg.l2TtlMs;
          await l2Client.set(l2Key(key), JSON.stringify(entry), { PX: l2Ttl });
          console.log("[Cache] Set L1+L2: " + key);
        } catch (err) {
          console.error("[Cache] L2 set error:", err);
        }
      } else {
        console.log("[Cache] Set L1: " + key);
      }
    },

    async delete(key: string): Promise<void> {
      l1Cache.delete(l1Key(key));
      if (l2Client) {
        try {
          await l2Client.del(l2Key(key));
        } catch (err) {
          console.error("[Cache] L2 delete error:", err);
        }
      }
      console.log("[Cache] Deleted: " + key);
    },

    async clear(): Promise<void> {
      l1Cache.clear();
      if (l2Client) {
        try {
          await l2Client.flushdb();
        } catch (err) {
          console.error("[Cache] L2 clear error:", err);
        }
      }
      console.log("[Cache] Cleared all caches");
    },

    getStats(): CacheStats {
      const totalHits = stats.l1Hits + stats.l2Hits;
      const totalMisses = stats.l1Misses + stats.l2Misses;
      const totalRequests = totalHits + totalMisses;

      return {
        hits: totalHits,
        misses: totalMisses,
        size: l1Cache.size,
        hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      };
    },

    getL1Stats() {
      return {
        size: l1Cache.size,
        hits: stats.l1Hits,
        misses: stats.l1Misses,
      };
    },
  };
}

export function createCacheKey(parts: (string | number | undefined)[], prefix = "cache"): string {
  const validParts = parts.filter((p): p is string | number => p !== undefined && p !== null);
  return prefix + ":" + validParts.join(":");
}
