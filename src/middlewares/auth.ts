import { Bindings } from "@/types";
import { createMiddleware } from "hono/factory";
import { sha256 } from "js-sha256";

export const apiKeyMiddleware = createMiddleware<{ Bindings: Bindings }>(
  async (c, next) => {
    const apiKey = c.req.header("x-api-key");
    if (!apiKey) {
      return c.json({ error: "Missing API key" }, 401);
    }

    const hashedKey = sha256(apiKey);
    const storedValue = await c.env.API_KEYS.get(hashedKey);

    if (!storedValue) {
      return c.json({ error: "Invalid API key" }, 403);
    }

    const data = JSON.parse(storedValue);
    const allowedDomains = data.allowedDomains || [];
    const origin = c.req.header("origin") || c.req.header("referer") || "";

    if (
      origin &&
      allowedDomains.length > 0 &&
      !allowedDomains.includes(new URL(origin).host)
    ) {
      console.log(`Failed domain check with ${data.keyPrefix}`);
      return c.json({ error: "Domain not allowed" }, 403);
    }

    console.log(`Authenticated with ${data.keyPrefix}`);
    await next();
  },
);
