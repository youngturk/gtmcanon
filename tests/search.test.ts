import { describe, expect, it } from "bun:test";
import { search } from "@/lib/search";
import { loadRegistry } from "@/lib/registry";
import { readFileSync } from "fs";
import { join } from "path";
import type { Registry } from "@/lib/types";

const VALID_YAML = readFileSync(
  join(import.meta.dir, "../registry/registry.yaml"),
  "utf-8"
);
const registry: Registry = loadRegistry(VALID_YAML);

describe("search", () => {
  it("finds exact trigger match", () => {
    const results = search("send an email", registry);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].user_story).toBe("send-email");
  });

  it("finds partial token overlap", () => {
    const results = search("email prospect", registry);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe("email");
  });

  it("returns empty array for no match", () => {
    const results = search("quantum physics simulation", registry);
    expect(results).toEqual([]);
  });

  it("returns empty array for empty query", () => {
    const results = search("", registry);
    expect(results).toEqual([]);
  });

  it("returns empty for stop-words-only query", () => {
    const results = search("the a an to for", registry);
    expect(results).toEqual([]);
  });

  it("is case insensitive", () => {
    const lower = search("send email", registry);
    const upper = search("SEND EMAIL", registry);
    expect(lower.length).toBe(upper.length);
    expect(lower[0].user_story).toBe(upper[0].user_story);
  });

  it("handles special characters in query", () => {
    const results = search("email!!! @prospect???", registry);
    expect(results.length).toBeGreaterThan(0);
  });

  it("ranks results by score descending", () => {
    const results = search("send email prospect outreach", registry);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("finds research-related tools", () => {
    const results = search("research a prospect", registry);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe("research");
  });

  it("finds calendar-related tools", () => {
    const results = search("schedule a meeting", registry);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe("calendar");
  });

  it("finds CRM-related tools", () => {
    const results = search("check my pipeline deals", registry);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe("crm");
  });

  it("returns all required fields in results", () => {
    const results = search("send email", registry);
    expect(results.length).toBeGreaterThan(0);
    const result = results[0];
    expect(result.user_story).toBeTruthy();
    expect(result.category).toBeTruthy();
    expect(result.tool).toBeTruthy();
    expect(result.provider).toBeTruthy();
    expect(result.why).toBeTruthy();
    expect(result.api_docs).toBeTruthy();
    expect(result.example).toBeTruthy();
    expect(result.example.method).toBeTruthy();
    expect(result.example.url).toBeTruthy();
    expect(result.score).toBeGreaterThan(0);
  });

  it("includes alternatives in results", () => {
    const results = search("send email", registry);
    expect(results[0].alternatives).toBeDefined();
    expect(Array.isArray(results[0].alternatives)).toBe(true);
  });
});
