/**
 * Fire-and-forget query logging to Cloudflare KV.
 *
 * Key format: query:<timestamp>:<random>
 * Value: JSON { query, matched, results_count, timestamp }
 *
 * Analytics failures never block API responses.
 */

export interface QueryLog {
  query: string;
  matched: boolean;
  results_count: number;
  timestamp: string;
}

export interface KVNamespace {
  put(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ keys: { name: string }[]; cursor?: string }>;
}

export async function logQuery(
  query: string,
  matched: boolean,
  resultsCount: number,
  kv: KVNamespace | null
): Promise<void> {
  if (!kv) return;

  try {
    const timestamp = new Date().toISOString();
    const random = Math.random().toString(36).slice(2, 8);
    const key = `query:${timestamp}:${random}`;

    const log: QueryLog = {
      query,
      matched,
      results_count: resultsCount,
      timestamp,
    };

    await kv.put(key, JSON.stringify(log));
  } catch {
    // Fire-and-forget. Analytics failure never blocks the response.
    console.error("Analytics KV write failed (non-blocking)");
  }
}

export interface QueryStats {
  total_queries: number;
  matched_queries: number;
  unmatched_queries: number;
  match_rate: string;
  top_queries: { query: string; count: number }[];
  top_misses: { query: string; count: number }[];
}

export async function getQueryStats(
  kv: KVNamespace | null
): Promise<QueryStats> {
  if (!kv) {
    return {
      total_queries: 0,
      matched_queries: 0,
      unmatched_queries: 0,
      match_rate: "0%",
      top_queries: [],
      top_misses: [],
    };
  }

  const queryCounts = new Map<string, number>();
  const missCounts = new Map<string, number>();
  let total = 0;
  let matched = 0;

  let cursor: string | undefined;
  do {
    const list = await kv.list({ prefix: "query:", limit: 1000, cursor });
    for (const key of list.keys) {
      const raw = await kv.get(key.name);
      if (!raw) continue;

      try {
        const log: QueryLog = JSON.parse(raw);
        total++;
        if (log.matched) {
          matched++;
          queryCounts.set(
            log.query,
            (queryCounts.get(log.query) || 0) + 1
          );
        } else {
          missCounts.set(
            log.query,
            (missCounts.get(log.query) || 0) + 1
          );
        }
      } catch {
        // Skip malformed entries
      }
    }
    cursor = list.cursor;
  } while (cursor);

  const sortByCount = (m: Map<string, number>) =>
    Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([query, count]) => ({ query, count }));

  return {
    total_queries: total,
    matched_queries: matched,
    unmatched_queries: total - matched,
    match_rate: total > 0 ? `${Math.round((matched / total) * 100)}%` : "0%",
    top_queries: sortByCount(queryCounts),
    top_misses: sortByCount(missCounts),
  };
}
