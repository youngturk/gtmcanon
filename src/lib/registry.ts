import { parse } from "yaml";
import type { Registry, Category, UserStory } from "./types";
import { REGISTRY_YAML } from "./registry-data";

// Schema validation errors
export class RegistryLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryLoadError";
  }
}

export class SchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchemaError";
  }
}

function validateUserStory(story: UserStory, categoryId: string): void {
  const required: (keyof UserStory)[] = [
    "id",
    "description",
    "natural_language_triggers",
    "recommendation",
  ];
  for (const field of required) {
    if (!story[field]) {
      throw new SchemaError(
        `User story in category "${categoryId}" missing required field: ${field}`
      );
    }
  }

  if (
    !Array.isArray(story.natural_language_triggers) ||
    story.natural_language_triggers.length === 0
  ) {
    throw new SchemaError(
      `User story "${story.id}" must have at least one natural_language_trigger`
    );
  }

  const rec = story.recommendation;
  const recRequired = ["tool", "provider", "why", "api_docs", "example"];
  for (const field of recRequired) {
    if (!rec[field as keyof typeof rec]) {
      throw new SchemaError(
        `Recommendation in "${story.id}" missing required field: ${field}`
      );
    }
  }
}

function validateCategory(category: Category): void {
  if (!category.id || !category.name || !category.description) {
    throw new SchemaError(
      `Category missing required field (id, name, or description)`
    );
  }
  if (
    !Array.isArray(category.user_stories) ||
    category.user_stories.length === 0
  ) {
    throw new SchemaError(
      `Category "${category.id}" must have at least one user_story`
    );
  }
  for (const story of category.user_stories) {
    validateUserStory(story, category.id);
  }
}

function validateRegistry(data: unknown): Registry {
  if (!data || typeof data !== "object") {
    throw new SchemaError("Registry must be a non-null object");
  }

  const registry = data as Registry;
  if (!Array.isArray(registry.categories) || registry.categories.length === 0) {
    throw new SchemaError("Registry must have at least one category");
  }

  for (const category of registry.categories) {
    validateCategory(category);
  }

  return registry;
}

// Parse and validate at module load time (build time on Cloudflare).
// If the YAML is invalid, the build fails. This is the desired behavior.
let _registry: Registry;

export function loadRegistry(yamlContent?: string): Registry {
  const content = yamlContent ?? REGISTRY_YAML;
  let parsed: unknown;
  try {
    parsed = parse(content);
  } catch (e) {
    throw new RegistryLoadError(
      `Failed to parse registry YAML: ${e instanceof Error ? e.message : String(e)}`
    );
  }
  return validateRegistry(parsed);
}

export function getRegistry(): Registry {
  if (!_registry) {
    _registry = loadRegistry();
  }
  return _registry;
}

export function getCategories(): Category[] {
  return getRegistry().categories;
}

export function getToolById(
  id: string
): { category: Category; story: UserStory } | null {
  for (const category of getRegistry().categories) {
    for (const story of category.user_stories) {
      if (story.id === id) {
        return { category, story };
      }
    }
  }
  return null;
}
