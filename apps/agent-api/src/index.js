const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });

const buildCorsHeaders = (origin, allowedOrigin) => {
  const allowOrigin = allowedOrigin === "*" ? "*" : origin || allowedOrigin;
  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
};

const trimMessages = (messages = []) =>
  messages
    .filter((m) => m && typeof m.role === "string" && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin");
    const corsHeaders = buildCorsHeaders(origin, env.ALLOWED_ORIGIN || "*");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json(
        {
          ok: true,
          service: "talons-agent-api",
          date: new Date().toISOString(),
        },
        { headers: corsHeaders },
      );
    }

    if (request.method !== "POST" || url.pathname !== "/chat") {
      return json({ error: "Not found" }, { status: 404, headers: corsHeaders });
    }

    if (!env.OPENAI_API_KEY) {
      return json(
        { error: "OPENAI_API_KEY is not configured in Worker secrets" },
        { status: 500, headers: corsHeaders },
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, { status: 400, headers: corsHeaders });
    }

    const userMessages = trimMessages(payload.messages);
    if (!userMessages.length) {
      return json(
        { error: "Body must contain a non-empty messages array" },
        { status: 400, headers: corsHeaders },
      );
    }

    const model = payload.model || env.OPENAI_MODEL || "gpt-4.1-mini";
    const systemPrompt = env.SYSTEM_PROMPT || "You are a helpful assistant.";

    const completionResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      return json(
        { error: "Upstream model request failed", details: errorText.slice(0, 500) },
        { status: 502, headers: corsHeaders },
      );
    }

    const completion = await completionResponse.json();
    const answer = completion.choices?.[0]?.message?.content || "";

    return json({ answer, model }, { headers: corsHeaders });
  },
};
