import { describe, expect, it } from "bun:test";
import { search } from "@/lib/search";
import { loadRegistry } from "@/lib/registry";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Golden path test: simulates what an agent experiences.
 *
 * An agent sends a natural language query and expects back a response
 * with all fields needed to immediately act on the recommendation.
 * This test validates the full contract.
 */

const VALID_YAML = readFileSync(
  join(import.meta.dir, "../registry/registry.yaml"),
  "utf-8"
);

describe("golden path: agent sends a realistic query", () => {
  const registry = loadRegistry(VALID_YAML);

  it("email task returns actionable recommendation", () => {
    const results = search("I need to send a cold email to a prospect at Acme Corp", registry);

    expect(results.length).toBeGreaterThan(0);

    const top = results[0];

    // Agent needs all of these to act immediately
    expect(top.tool).toBeTruthy();
    expect(top.provider).toBeTruthy();
    expect(top.why).toBeTruthy();
    expect(top.api_docs).toMatch(/^https?:\/\//);
    expect(top.auth_method).toBeTruthy();
    expect(top.status).toBe("verified");

    // Example API call must be complete
    expect(top.example.method).toMatch(/^(GET|POST|PUT|PATCH|DELETE)$/);
    expect(top.example.url).toMatch(/^https?:\/\//);
    expect(top.example.headers).toBeTruthy();
    expect(top.example.response).toBeTruthy();
    expect(top.example.error_codes.length).toBeGreaterThan(0);

    // Score should be meaningful (multiple token matches)
    expect(top.score).toBeGreaterThanOrEqual(2);
  });

  it("research task returns actionable recommendation", () => {
    const results = search("research this prospect and find their LinkedIn", registry);

    expect(results.length).toBeGreaterThan(0);
    const top = results[0];

    expect(top.category).toBe("research");
    expect(top.example.method).toBeTruthy();
    expect(top.example.url).toMatch(/^https?:\/\//);
    expect(top.api_docs).toMatch(/^https?:\/\//);
  });

  it("scheduling task returns actionable recommendation", () => {
    const results = search("book a demo meeting with a lead", registry);

    expect(results.length).toBeGreaterThan(0);
    const top = results[0];

    expect(top.category).toBe("calendar");
    expect(top.example.method).toBeTruthy();
    expect(top.example.url).toMatch(/^https?:\/\//);
  });

  it("CRM task returns actionable recommendation", () => {
    const results = search("check the status of my deals in the pipeline", registry);

    expect(results.length).toBeGreaterThan(0);
    const top = results[0];

    expect(top.category).toBe("crm");
    expect(top.example.method).toBeTruthy();
    expect(top.example.url).toMatch(/^https?:\/\//);
  });

  it("unrelated query returns empty results gracefully", () => {
    const results = search("deploy a kubernetes cluster to AWS", registry);
    expect(results).toEqual([]);
  });
});
