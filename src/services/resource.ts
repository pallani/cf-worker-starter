import { nanoid } from "nanoid";
import { D1Database } from "@cloudflare/workers-types";
import { CreateResource, Resource, ResourceSchema } from "@/types";

export class ResourceService {
  constructor(private db: D1Database) {}

  async createResource(resource: CreateResource): Promise<Resource> {
    const id = `resource_${nanoid()}`;
    const timestamp = new Date().toISOString();

    const newResource = {
      ...resource,
      id,
      created_at: timestamp,
      updated_at: timestamp,
      metadata: resource.metadata || {},
    };

    await this.db
      .prepare(
        `INSERT INTO resources (
          id, name, description, metadata, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        newResource.id,
        newResource.name,
        newResource.description || null,
        JSON.stringify(newResource.metadata),
        newResource.created_at,
        newResource.updated_at,
      )
      .run();

    return ResourceSchema.parse(newResource);
  }

  async getResources(params: {
    name?: string;
    from?: string;
    to?: string;
  }): Promise<Resource[]> {
    let query = `SELECT * FROM resources WHERE 1=1`;
    const bindParams: unknown[] = [];

    if (params.name) {
      query += ` AND name LIKE ?`;
      bindParams.push(`%${params.name}%`);
    }
    if (params.from) {
      query += ` AND created_at >= ?`;
      bindParams.push(params.from);
    }
    if (params.to) {
      query += ` AND created_at <= ?`;
      bindParams.push(params.to);
    }

    query += ` ORDER BY created_at DESC LIMIT 100`;

    const result = await this.db
      .prepare(query)
      .bind(...bindParams)
      .all();

    return result.results.map((row) => ({
      ...row,
      metadata:
        typeof row.metadata === "string"
          ? JSON.parse(row.metadata)
          : row.metadata,
    }));
  }
}
