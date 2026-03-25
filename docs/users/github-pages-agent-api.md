# GitHub Pages + Agent API

Bu repo ile GitHub Pages üzerinde çalışan bir AI asistanı kurmak için statik frontend + serverless API deseni kullanılır.

## Mimari
1. **GitHub Pages**: arayüz (chat UI)
2. **Cloudflare Worker**: `/chat` endpoint'i, API key güvenliği
3. **Model provider**: OpenAI Chat Completions API

## Bu repoda hazır gelen API
`apps/agent-api/` içinde örnek Worker hazırdır.

### Kurulum
```bash
npm --prefix apps/agent-api install
npx --prefix apps/agent-api wrangler secret put OPENAI_API_KEY
npm --prefix apps/agent-api run dev
```

### Deploy
```bash
npm --prefix apps/agent-api run deploy
```

Deploy sonrası frontend tarafında Worker URL'sini kullanın.

## Public API konusu
- Endpoint'iniz internete açık (**public**) olabilir.
- Ancak model anahtarınız (`OPENAI_API_KEY`) kesinlikle backend'de kalmalıdır.
- `ALLOWED_ORIGIN` değerini Pages domain'inize sabitleyin.
