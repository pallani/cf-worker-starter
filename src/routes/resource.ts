import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ResourceService } from "@/services/resource";
import { Bindings, CreateResourceSchema } from "@/types";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  try {
    const name = c.req.query("name");
    const from = c.req.query("from");
    const to = c.req.query("to");

    const resourceService = new ResourceService(c.env.db);
    const resources = await resourceService.getResources({
      name: name || undefined,
      from: from || undefined,
      to: to || undefined,
    });

    return c.json({ data: resources });
  } catch (error) {
    console.error("Error listing resources:", error);
    return c.json({ error: "Failed to list resources" }, 500);
  }
});

app.post("/", zValidator("json", CreateResourceSchema), async (c) => {
  try {
    const body = c.req.valid("json");
    const resourceService = new ResourceService(c.env.db);
    const resource = await resourceService.createResource(body);
    return c.json({ data: resource }, 201);
  } catch (error) {
    console.error("Error creating resource:", error);
    return c.json({ error: "Failed to create resource" }, 500);
  }
});

export default app;
