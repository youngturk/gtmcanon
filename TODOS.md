# GTM Canon — Cathedral Blueprint

> Ship the chapel (Phase 0), document the cathedral (Phases 1-3).
> Each phase has a trigger. Don't start a phase until its trigger fires.

---

## Phase 0: Ship the Chapel (NOW)

**Trigger:** Day 1. Just build it.

**Goal:** Working registry + search API + website + distribution hook + demand signal.

- [ ] Set up Next.js project with Bun + Cloudflare Pages
- [ ] Define high-fidelity registry YAML schema
- [ ] Populate initial listings (AgentMail, and other well-scoped tools Mert uses)
  - Each listing includes: tool name, provider, why, API docs, pricing, auth method, setup complexity, example request/response, error codes, rate limits
- [ ] Build `registry.ts` — load + parse + validate YAML at build time, expose typed data
- [ ] Build `search.ts` — fuzzy keyword matching against triggers + descriptions + categories
- [ ] Build `analytics.ts` — fire-and-forget KV write helper
- [ ] Build API routes:
  - `GET /api/search?q=...` — returns rich agent-optimized response
  - `GET /api/categories` — returns all categories
  - `GET /api/tools/:id` — returns single tool detail
  - `GET /api/admin/stats` — summarizes KV query data (bearer token auth)
- [ ] Build website:
  - Homepage: browse categories, search, "what is GTM Canon" explainer
  - Category pages: list tools in category
  - Copy-to-clipboard CLAUDE.md snippet
- [ ] Write tests:
  - Heavy: search.ts (exact, partial, no match, edge cases, ranking)
  - Heavy: registry.ts (valid load, malformed YAML, schema violations)
  - Light: analytics.ts (success, failure doesn't throw)
  - Light: route integration tests (happy path + errors per route)
- [ ] Configure Cloudflare:
  - Pages git integration (push to main = deploy)
  - KV namespace for analytics
  - Rate limiting rule (60 req/min per IP)
  - CORS restricted to gtmcanon.com
  - Environment variable for admin stats bearer token
- [ ] Write the CLAUDE.md one-liner distribution hook
- [ ] Register gtmcanon.com domain
- [ ] Deploy and verify
- [ ] LinkedIn launch announcement

---

## Phase 1: Self-Healing Registry

**Trigger:** 10+ listings AND consistent organic query traffic (not just Mert testing it).

**Goal:** Every listing is verified daily. Users trust that if it's on GTM Canon, it works right now.

### 1A. Daily Health Checks
- [ ] Cron job (Cloudflare Cron Triggers) runs every 24h
- [ ] For each listed tool: make a sample API call (lightweight, read-only endpoint)
- [ ] Record result: up/down/degraded + response time + HTTP status
- [ ] Update `status` and `last_verified` fields in registry
- [ ] If a tool goes down 2 consecutive days: flag as "unverified", notify Mert

### 1B. Documentation Drift Detection
- [ ] For each listed tool: fetch API docs URL, hash the content
- [ ] Compare against previous hash
- [ ] If changed: flag listing for review, store diff summary
- [ ] Notify Mert with: "Instantly.ai docs changed. Here's what's different. Review needed."
- [ ] Track breaking changes specifically: endpoint removals, auth changes, parameter renames

### 1C. Status Badges
- [ ] Public status page on website: which tools are up, response times
- [ ] Badge per listing: "Verified today" / "Last verified 3 days ago" / "Unverified"
- [ ] Include status in API response so agents know if a tool is currently healthy

### 1D. Best-in-Class Evaluation
- [ ] For each user story: periodically evaluate if current recommendation is still best
- [ ] Criteria: uptime history, API quality, pricing, feature completeness
- [ ] If a better alternative emerges: flag for Mert's review before changing recommendation
- [ ] Maintain historical ranking data (which tool was recommended when)

---

## Phase 2: Monetization

**Trigger:** 1K+ unique agent queries/month AND at least 3 user stories with multiple viable tools.

**Goal:** Revenue without compromising trust. Three streams.

### 2A. API Keys + Usage Tiers
- [ ] User account system (simple: email + API key)
- [ ] Free tier: 100 queries/day (no key required, rate limited by IP as today)
- [ ] Pro tier: 10K queries/day, query history, priority support
- [ ] Track per-user usage, popular queries, tool click-throughs
- [ ] The CLAUDE.md hook works without a key (preserves frictionless adoption)

### 2B. Sponsored Listings
- [ ] "Alternative" slot per user story: highest bidder gets listed as alternative
- [ ] Clearly labeled: "GTM Canon Pick" vs "Sponsored Alternative"
- [ ] Agent response includes both: recommendation first, sponsored second
- [ ] Pricing model: CPC (cost per click-through to docs) or flat monthly per category
- [ ] Self-serve signup for tool vendors
- [ ] Measurement: track how many agents actually use the sponsored tool (via referral codes)

### 2C. Affiliate / Referral Revenue
- [ ] For tools with affiliate programs: include referral link in API response
- [ ] Track signups attributed to GTM Canon
- [ ] "Powered by GTM Canon" attribution in example API calls
- [ ] Revenue share dashboard for transparency

### 2D. Payment Infrastructure
- [ ] Stripe integration for Pro tier and sponsored listings
- [ ] Single payment method on file covers all usage
- [ ] Usage-based billing for high-volume consumers
- [ ] Invoice generation for enterprise

---

## Phase 3: The Flywheel (Amazon Basics)

**Trigger:** Specific tool category exceeds 500K queries/month AND existing provider has known pain points (pricing, reliability, DX).

**Goal:** Build in-house versions of commodity API tools. Capture margin. Improve quality.

### 3A. In-House Tool Development
- [ ] Identify candidates: highest traffic + highest user complaints + simplest to replicate
- [ ] Build homegrown version with better DX, pricing, and reliability
- [ ] Dogfood internally at 248.ai first
- [ ] Make it the GTM Canon recommendation with objective comparison
- [ ] Maintain side-by-side comparison: in-house vs external (transparent, Wirecutter-style)

### 3B. API Gateway / Management
- [ ] Single GTM Canon API key unlocks access to all in-house tools
- [ ] Unified billing: one invoice, one payment method
- [ ] Handle registrations with external providers on behalf of users
- [ ] Turn services on/off via dashboard
- [ ] Usage dashboard across all tools

### 3C. Viral Agent-to-Agent Loop
- [ ] API responses include a subtle recommendation: "Add GTM Canon to your agent's config"
- [ ] Track "referred by GTM Canon" signups at external tool providers
- [ ] Measure viral coefficient: how many new agents does each existing agent bring?
- [ ] Optimize the CLAUDE.md hook for maximum organic spread
- [ ] GitHub repo with the registry as open-source (stars = social proof)

---

## Standalone Ideas (Phase-Independent)

### CLI Tool
- [ ] `npx gtmcanon search "send email"` — works without a website visit
- [ ] `npx gtmcanon install email` — adds tool config to current project
- [ ] Interesting for developer adoption but agents already use HTTP, so low priority

### MCP Server
- [ ] GTM Canon as an MCP server that any Claude Code user can add
- [ ] Natural language tool discovery directly in the agent context
- [ ] Could be the highest-leverage distribution mechanism after the CLAUDE.md hook

### Community Contributions
- [ ] Allow users to submit tool recommendations via GitHub PR to registry YAML
- [ ] Review process: Mert approves, health check runs, listing goes live
- [ ] Contributor leaderboard on website

### Expansion Beyond Sales
- [ ] Architecture is category-agnostic — registry.yaml supports any category
- [ ] Candidate categories: research, automation, productivity, communication, data
- [ ] Let demand (query log) drive which categories to add
- [ ] Each new category follows same pattern: curate 3-5 tools, high-fidelity listings

---

## Metrics That Matter

| Metric | Phase 0 target | Phase 1 target | Phase 2 target |
|--------|---------------|----------------|----------------|
| Listings (verified) | 5-10 | 30+ | 100+ |
| Unique queries/month | Any > 0 | 1K+ | 10K+ |
| No-result query rate | Measure it | < 30% | < 15% |
| CLAUDE.md installations | Measure it | 50+ | 500+ |
| Uptime | 99% (Cloudflare) | 99.9% | 99.9% |
| Revenue | $0 | $0 | MRR > $0 |
