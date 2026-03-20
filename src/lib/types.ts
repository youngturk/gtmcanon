export interface ErrorCode {
  code: number;
  meaning: string;
}

export interface RateLimits {
  [key: string]: string | number;
}

export interface ToolExample {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | null;
  response: Record<string, unknown>;
  error_codes: ErrorCode[];
  rate_limits: RateLimits;
}

export interface ToolRecommendation {
  tool: string;
  provider: string;
  why: string;
  api_docs: string;
  pricing: string;
  auth_method: string;
  setup_complexity: string;
  status: string;
  last_verified: string;
  example: ToolExample;
}

export interface ToolAlternative {
  tool: string;
  provider: string;
  why: string;
  api_docs: string;
  pricing: string;
  auth_method: string;
  setup_complexity: string;
}

export interface UserStory {
  id: string;
  description: string;
  natural_language_triggers: string[];
  recommendation: ToolRecommendation;
  alternatives: ToolAlternative[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  user_stories: UserStory[];
}

export interface Registry {
  categories: Category[];
}

export interface SearchResult {
  user_story: string;
  category: string;
  tool: string;
  provider: string;
  why: string;
  api_docs: string;
  pricing: string;
  auth_method: string;
  setup_complexity: string;
  status: string;
  last_verified: string;
  example: ToolExample;
  alternatives: ToolAlternative[];
  score: number;
}
