CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching by name
CREATE INDEX IF NOT EXISTS idx_resources_name ON resources(name);

-- Index for timestamp queries
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at);
