import { z } from "zod";
import { D1Database, KVNamespace } from "@cloudflare/workers-types";

export type Bindings = {
  db: D1Database;
  API_KEYS: KVNamespace;
};

export const ResourceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateResourceSchema = ResourceSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type Resource = z.infer<typeof ResourceSchema>;
export type CreateResource = z.infer<typeof CreateResourceSchema>;
