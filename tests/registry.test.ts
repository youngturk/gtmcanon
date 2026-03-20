import { describe, expect, it } from "bun:test";
import { loadRegistry, RegistryLoadError, SchemaError } from "@/lib/registry";
import { readFileSync } from "fs";
import { join } from "path";

const VALID_YAML = readFileSync(
  join(import.meta.dir, "../registry/registry.yaml"),
  "utf-8"
);

describe("loadRegistry", () => {
  it("loads valid registry YAML", () => {
    const registry = loadRegistry(VALID_YAML);
    expect(registry.categories).toBeDefined();
    expect(registry.categories.length).toBeGreaterThan(0);
  });

  it("every category has required fields", () => {
    const registry = loadRegistry(VALID_YAML);
    for (const cat of registry.categories) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.description).toBeTruthy();
      expect(cat.user_stories.length).toBeGreaterThan(0);
    }
  });

  it("every user story has required fields", () => {
    const registry = loadRegistry(VALID_YAML);
    for (const cat of registry.categories) {
      for (const story of cat.user_stories) {
        expect(story.id).toBeTruthy();
        expect(story.description).toBeTruthy();
        expect(story.natural_language_triggers.length).toBeGreaterThan(0);
        expect(story.recommendation.tool).toBeTruthy();
        expect(story.recommendation.provider).toBeTruthy();
        expect(story.recommendation.why).toBeTruthy();
        expect(story.recommendation.api_docs).toBeTruthy();
        expect(story.recommendation.example).toBeTruthy();
        expect(story.recommendation.example.method).toBeTruthy();
        expect(story.recommendation.example.url).toBeTruthy();
      }
    }
  });

  it("throws RegistryLoadError on malformed YAML", () => {
    expect(() => loadRegistry("{{{{invalid yaml")).toThrow(RegistryLoadError);
  });

  it("throws SchemaError when categories is missing", () => {
    expect(() => loadRegistry("foo: bar")).toThrow(SchemaError);
  });

  it("throws SchemaError when categories is empty", () => {
    expect(() => loadRegistry("categories: []")).toThrow(SchemaError);
  });

  it("throws SchemaError when category missing id", () => {
    const yaml = `
categories:
  - name: Test
    description: Test
    user_stories:
      - id: test
        description: Test
        natural_language_triggers: ["test"]
        recommendation:
          tool: Test
          provider: test
          why: test
          api_docs: http://test
          example:
            method: GET
            url: http://test
            headers: {}
            body: null
            response: {}
            error_codes: []
            rate_limits: {}
        alternatives: []
`;
    expect(() => loadRegistry(yaml)).toThrow(SchemaError);
  });

  it("throws SchemaError when user story has no triggers", () => {
    const yaml = `
categories:
  - id: test
    name: Test
    description: Test
    user_stories:
      - id: test
        description: Test
        natural_language_triggers: []
        recommendation:
          tool: Test
          provider: test
          why: test
          api_docs: http://test
          example:
            method: GET
            url: http://test
            headers: {}
            body: null
            response: {}
            error_codes: []
            rate_limits: {}
        alternatives: []
`;
    expect(() => loadRegistry(yaml)).toThrow(SchemaError);
  });

  it("throws SchemaError when recommendation missing example", () => {
    const yaml = `
categories:
  - id: test
    name: Test
    description: Test
    user_stories:
      - id: test
        description: Test
        natural_language_triggers: ["test"]
        recommendation:
          tool: Test
          provider: test
          why: test
          api_docs: http://test
        alternatives: []
`;
    expect(() => loadRegistry(yaml)).toThrow(SchemaError);
  });
});
