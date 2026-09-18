import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

// A module-level handle is safe here: `env` from `cloudflare:workers` resolves
// lazily on access, and `env.DB` is the Worker's D1 binding, not a connection
// that needs per-request lifecycle management. Never open connection pools in a
// Worker; bindings are the only way to reach D1.
export const db = drizzle(env.DB, { schema });
export { schema };
export type Db = typeof db;
