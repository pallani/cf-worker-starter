import { Hono } from "hono";
import { cors } from "hono/cors";
import { apiKeyMiddleware } from "@/middlewares/auth";
import resource from "@/routes/resource";

const app = new Hono();

// Enable CORS
app.use("*", cors());

// Health check endpoint
app.get("/ping", (c) => c.json({ message: "pong" }));

// Protected routes
app.use("*", apiKeyMiddleware);
app.route("/resources", resource);

export default app;
