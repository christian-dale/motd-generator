# MOTD Generator

[![Version](https://img.shields.io/github/package-json/v/christian-dale/motd-generator?color=02c39a)](https://github.com/christian-dale/motd-generator/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/runtime-Cloudflare%20Workers-F38020)](https://workers.cloudflare.com/)

A daily **Message of the Day (MOTD)** generator powered by Cloudflare Workers + Cloudflare Workers AI.
Great for your [GitHub profile README](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme), dashboards, docs, or any Markdown-enabled page.

## Live preview

![Daily MOTD](https://motd-generator.christiandale.workers.dev/)

## What this does

- Generates a short, witty developer MOTD using Cloudflare AI
- Stores the latest message in Cloudflare KV
- Refreshes once per day via cron trigger (`0 0 * * *`)
- Serves either SVG (default) or plain text (`?is_text`)

## Quick start

Embed in any Markdown file:

```md
![Daily MOTD](https://motd-generator.christiandale.workers.dev/)
```

Perfect for GitHub profile READMEs.

## API / output modes

### Default: SVG image

```text
https://motd-generator.christiandale.workers.dev/
```

### Text-only mode

Append `?is_text` to return plain text instead of SVG.

```text
https://motd-generator.christiandale.workers.dev/?is_text
```

## Architecture

1. `scheduled` event runs daily and generates a new MOTD via `env.AI.run(...)`
2. Result is persisted to KV under key `MOTD`
3. `fetch` returns KV value (or generates on-demand if missing)
4. Output is returned as SVG (`image/svg+xml`) or plain text

## Local development

> [!NOTE]
> This project uses Workers AI (`env.AI.run(...)`), so you need a Cloudflare account and valid Wrangler auth, even when developing locally.

### Prerequisites

- Node.js 20+
- npm
- Cloudflare account
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler) (installed via dev dependencies)

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a KV namespace (if you don’t already have one):

```bash
npx wrangler kv namespace create KV
```

3. Update `kv_namespaces` in `wrangler.jsonc` with your namespace `id`.

4. Authenticate Wrangler (if needed):

```bash
npx wrangler login
```

5. Run locally:

```bash
npx wrangler dev
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npx wrangler deploy
```

After deploy, use your worker URL in Markdown embeds.

## Required bindings

Configured in `wrangler.jsonc`:

- `KV` → KV namespace binding
- `AI` → Cloudflare AI binding
- cron trigger → `0 0 * * *` (daily at 00:00 UTC)

## Testing status

There are currently no automated tests in this repo (`npm test` is a placeholder).

## Roadmap ideas

- Optional themes/colors via query params
- Locale/timezone-aware rotation
- Configurable prompt profiles (serious/funny/minimal)
- Basic smoke tests for fetch + text mode

## Contributing

PRs are welcome. Keep changes focused and include a short description of behavior changes.

## License

MIT — see [LICENSE](./LICENSE).
