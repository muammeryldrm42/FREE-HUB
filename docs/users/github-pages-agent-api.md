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
npx --prefix apps/agent-api wrangler secret put CLIENT_API_KEY
npm --prefix apps/agent-api run dev
```

### Deploy
```bash
npm --prefix apps/agent-api run deploy
```

Deploy sonrası frontend env değerleri:

```bash
VITE_AGENT_API_URL=https://<worker-domain>/chat
VITE_AGENT_PUBLIC_KEY=<CLIENT_API_KEY>
```

## Public API konusu
- Endpoint internete açık (**public**) olabilir.
- Model anahtarı (`OPENAI_API_KEY`) sadece backend secret olarak kalmalıdır.
- `ALLOWED_ORIGINS` değerine sadece kendi Pages domaininizi yazın.
- Kötüye kullanım için rate-limit aktif tutulmalıdır.
