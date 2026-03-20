import type { Registry, SearchResult } from "./types";

/**
 * Search matching contract (token overlap):
 *
 * 1. Tokenize query: split on whitespace, lowercase, remove punctuation
 * 2. For each user story, build a match corpus:
 *    - natural_language_triggers (each trigger tokenized)
 *    - description (tokenized)
 *    - category name (tokenized)
 *    - tool name (tokenized)
 * 3. Score = number of query tokens found in the corpus
 * 4. Threshold: score >= 1
 * 5. Return results sorted by score descending
 */

const STOP_WORDS = new Set([
  "a", "an", "the", "to", "for", "of", "on", "in", "is", "it",
  "my", "me", "i", "we", "our", "and", "or", "this", "that",
  "can", "do", "how", "what", "with",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));
}

function buildCorpus(
  categoryName: string,
  storyDescription: string,
  triggers: string[],
  toolName: string
): Set<string> {
  const tokens = new Set<string>();

  for (const t of tokenize(categoryName)) tokens.add(t);
  for (const t of tokenize(storyDescription)) tokens.add(t);
  for (const t of tokenize(toolName)) tokens.add(t);

  for (const trigger of triggers) {
    for (const t of tokenize(trigger)) tokens.add(t);
  }

  return tokens;
}

export function search(query: string, registry: Registry): SearchResult[] {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const category of registry.categories) {
    for (const story of category.user_stories) {
      const corpus = buildCorpus(
        category.name,
        story.description,
        story.natural_language_triggers,
        story.recommendation.tool
      );

      let score = 0;
      for (const token of queryTokens) {
        if (corpus.has(token)) {
          score++;
        }
      }

      if (score > 0) {
        results.push({
          user_story: story.id,
          category: category.id,
          tool: story.recommendation.tool,
          provider: story.recommendation.provider,
          why: story.recommendation.why,
          api_docs: story.recommendation.api_docs,
          pricing: story.recommendation.pricing,
          auth_method: story.recommendation.auth_method,
          setup_complexity: story.recommendation.setup_complexity,
          status: story.recommendation.status,
          last_verified: story.recommendation.last_verified,
          example: story.recommendation.example,
          alternatives: story.alternatives,
          score,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
