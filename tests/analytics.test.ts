import { describe, expect, it } from "bun:test";
import { logQuery, type KVNamespace } from "@/lib/analytics";

function createMockKV(shouldFail = false): KVNamespace {
  const store = new Map<string, string>();
  return {
    async put(key: string, value: string) {
      if (shouldFail) throw new Error("KV write failed");
      store.set(key, value);
    },
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async list(options?: { prefix?: string; limit?: number; cursor?: string }) {
      const keys = Array.from(store.keys())
        .filter((k) => !options?.prefix || k.startsWith(options.prefix))
        .map((name) => ({ name }));
      return { keys };
    },
  };
}

describe("logQuery", () => {
  it("writes query to KV successfully", async () => {
    const kv = createMockKV();
    await logQuery("send email", true, 1, kv);
    const keys = await kv.list({ prefix: "query:" });
    expect(keys.keys.length).toBe(1);

    const value = await kv.get(keys.keys[0].name);
    expect(value).toBeTruthy();
    const parsed = JSON.parse(value!);
    expect(parsed.query).toBe("send email");
    expect(parsed.matched).toBe(true);
    expect(parsed.results_count).toBe(1);
    expect(parsed.timestamp).toBeTruthy();
  });

  it("does not throw when KV write fails", async () => {
    const kv = createMockKV(true);
    // Should not throw
    await logQuery("send email", true, 1, kv);
  });

  it("does not throw when KV is null", async () => {
    await logQuery("send email", true, 1, null);
  });
});
