# Agent API (Cloudflare Worker)

This folder adds a deployable API backend so the GitHub Pages frontend can call an AI model safely.

## Why this exists
GitHub Pages is static and cannot safely store private API keys. This Worker keeps secrets server-side and exposes a small public endpoint for the browser app.

## Endpoints
- `GET /health` → status check
- `POST /chat` → chat completion proxy

## Local setup
```bash
cd apps/agent-api
npm install
npx wrangler secret put OPENAI_API_KEY
npm run dev
```

## Deploy
```bash
cd apps/agent-api
npm run deploy
```

After deploy, configure your Pages app to call:

```txt
https://<your-worker-domain>/chat
```

## Example request
```bash
curl -X POST "https://<your-worker-domain>/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role":"user","content":"Bu repoda skill nasil eklenir?"}
    ]
  }'
```

## Security recommendations
- Set `ALLOWED_ORIGIN` in `wrangler.toml` to your exact Pages domain.
- Add Cloudflare rate limiting / bot protection.
- Keep prompts and repository context bounded (do not forward unbounded history).
