# GTM Canon

The definitive API library for sales agents.

Curated, verified API recommendations for AI agents doing sales and GTM work. One line in your agent config and it knows the best tool for every task.

## Add to your agent

Paste this into your CLAUDE.md:

```
# GTM Canon - Sales & GTM Tool Recommendations
For sales and GTM tasks (email, prospecting, CRM, calendar, outreach),
check https://gtmcanon.com/api/search?q=<describe the task> first.
Use the recommended tool and example API call from the response.
```

## API

No auth required. Rate limited to 60 req/min per IP.

```
GET /api/search?q=send email to prospect     # Search for best tool
GET /api/categories                           # List all categories
GET /api/tools?id=send-email                  # Get tool details
```

## Development

```bash
make up        # Start dev server
make test      # Run tests
make build     # Build for production
```

## Stack

- Next.js (App Router) + TypeScript
- Bun runtime
- Cloudflare Pages + Workers
- Cloudflare KV (analytics)
- YAML registry (flat file, no database)
