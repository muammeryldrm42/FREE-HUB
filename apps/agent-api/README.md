# Agent API (Cloudflare Worker)

This folder adds a deployable API backend so the GitHub Pages frontend can call an AI model safely.

## Why this exists
GitHub Pages is static and cannot safely store private API keys. This Worker keeps secrets server-side and exposes a small public endpoint for the browser app.

## Endpoints
- `GET /health` → status check
- `POST /chat` → chat completion proxy

## Security included
- strict allowlist origin check (`ALLOWED_ORIGINS`)
- required client header key (`x-api-key` = `CLIENT_API_KEY`)
- basic per-IP in-memory rate limit (30 req/min)
- normalized error response format

## Local setup
```bash
cd apps/agent-api
npm install
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put CLIENT_API_KEY
npm run dev
```

## Deploy
```bash
cd apps/agent-api
npm run deploy
```

After deploy, configure your Pages app env:

```txt
VITE_AGENT_API_URL=https://<your-worker-domain>/chat
VITE_AGENT_PUBLIC_KEY=<same-as-CLIENT_API_KEY>
```

## Example request
```bash
curl -X POST "https://<your-worker-domain>/chat" \
  -H "Content-Type: application/json" \
  -H "x-api-key: <CLIENT_API_KEY>" \
  -d '{
    "messages": [
      {"role":"user","content":"Bu repoda skill nasil eklenir?"}
    ]
  }'
```

## Error shape
```json
{
  "ok": false,
  "requestId": "uuid",
  "error": {
    "code": "invalid_messages",
    "message": "Body must include a non-empty messages array."
  }
}
```
