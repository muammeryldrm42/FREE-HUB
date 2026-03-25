const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const ipRateStore = new Map();

const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });

const parseAllowedOrigins = (value = "") =>
  value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

const resolveOrigin = (requestOrigin, allowedOrigins) => {
  if (!requestOrigin || !allowedOrigins.length) return null;
  if (allowedOrigins.includes(requestOrigin)) return requestOrigin;
  return null;
};

const buildCorsHeaders = (resolvedOrigin) => ({
  "access-control-allow-origin": resolvedOrigin,
  "access-control-allow-methods": "POST,OPTIONS",
  "access-control-allow-headers": "content-type,x-api-key",
  "access-control-max-age": "86400",
  vary: "Origin",
});

const errorResponse = ({ code, message, status, requestId, corsHeaders }) =>
  json(
    {
      ok: false,
      requestId,
      error: { code, message },
    },
    { status, headers: corsHeaders },
  );

const trimMessages = (messages = []) =>
  messages
    .filter((m) => m && typeof m.role === "string" && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

const getClientIp = (request) => {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  return "unknown";
};

const consumeRateLimit = (ip) => {
  const now = Date.now();
  const existing = ipRateStore.get(ip);

  if (!existing || now > existing.resetAt) {
    ipRateStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_WINDOW_MS };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  ipRateStore.set(ip, existing);
  return { allowed: true, remaining: RATE_LIMIT_MAX - existing.count, resetAt: existing.resetAt };
};

export default {
  async fetch(request, env) {
    const requestId = crypto.randomUUID();
    const url = new URL(request.url);
    const requestOrigin = request.headers.get("origin");
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS || "");
    const resolvedOrigin = resolveOrigin(requestOrigin, allowedOrigins);

    if (request.method === "OPTIONS") {
      if (!resolvedOrigin) {
        return errorResponse({
          code: "origin_not_allowed",
          message: "Origin is not allowed.",
          status: 403,
          requestId,
          corsHeaders: {},
        });
      }
      return new Response(null, { status: 204, headers: buildCorsHeaders(resolvedOrigin) });
    }

    if (!resolvedOrigin) {
      return errorResponse({
        code: "origin_not_allowed",
        message: "Origin is not allowed.",
        status: 403,
        requestId,
        corsHeaders: {},
      });
    }

    const corsHeaders = buildCorsHeaders(resolvedOrigin);

    if (request.method === "GET" && url.pathname === "/health") {
      return json(
        {
          ok: true,
          requestId,
          service: "talons-agent-api",
          date: new Date().toISOString(),
        },
        { headers: corsHeaders },
      );
    }

    if (request.method !== "POST" || url.pathname !== "/chat") {
      return errorResponse({
        code: "not_found",
        message: "Endpoint not found.",
        status: 404,
        requestId,
        corsHeaders,
      });
    }

    if (!env.OPENAI_API_KEY) {
      return errorResponse({
        code: "server_config_error",
        message: "OPENAI_API_KEY is missing in Worker secrets.",
        status: 500,
        requestId,
        corsHeaders,
      });
    }

    if (!env.CLIENT_API_KEY || request.headers.get("x-api-key") !== env.CLIENT_API_KEY) {
      return errorResponse({
        code: "unauthorized",
        message: "Invalid API key.",
        status: 401,
        requestId,
        corsHeaders,
      });
    }

    const ip = getClientIp(request);
    const rate = consumeRateLimit(ip);
    if (!rate.allowed) {
      return errorResponse({
        code: "rate_limited",
        message: "Too many requests. Please retry shortly.",
        status: 429,
        requestId,
        corsHeaders: {
          ...corsHeaders,
          "retry-after": String(Math.ceil((rate.resetAt - Date.now()) / 1000)),
        },
      });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return errorResponse({
        code: "invalid_json",
        message: "Request body must be valid JSON.",
        status: 400,
        requestId,
        corsHeaders,
      });
    }

    const userMessages = trimMessages(payload.messages);
    if (!userMessages.length) {
      return errorResponse({
        code: "invalid_messages",
        message: "Body must include a non-empty messages array.",
        status: 400,
        requestId,
        corsHeaders,
      });
    }

    const model = payload.model || env.OPENAI_MODEL || "gpt-4.1-mini";
    const systemPrompt = env.SYSTEM_PROMPT || "You are a helpful assistant.";

    const upstreamResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [{ role: "system", content: systemPrompt }, ...userMessages],
      }),
    });

    if (!upstreamResponse.ok) {
      await upstreamResponse.text();
      return errorResponse({
        code: "upstream_error",
        message: "Model provider request failed.",
        status: 502,
        requestId,
        corsHeaders,
      });
    }

    const completion = await upstreamResponse.json();
    const answer = completion.choices?.[0]?.message?.content || "";

    return json(
      {
        ok: true,
        requestId,
        model,
        answer,
      },
      {
        headers: {
          ...corsHeaders,
          "x-ratelimit-remaining": String(rate.remaining),
          "x-ratelimit-reset": String(rate.resetAt),
        },
      },
    );
  },
};
