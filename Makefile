up:
	bun run dev

test:
	bun test

build:
	bun run build

build-cf:
	bun run build:cf

deploy:
	bun run build:cf && bunx wrangler pages deploy .next

lint:
	bunx next lint

kv-create:
	bunx wrangler kv namespace create ANALYTICS
