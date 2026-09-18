// Node-only Better Auth config for `pnpm auth:generate`
// (`@better-auth/cli generate`), which reads the plugin schema and writes
// src/db/auth-schema.ts. It cannot import src/lib/auth.ts directly because that
// module depends on `cloudflare:workers`.
//
// Keep the plugin list identical to src/lib/auth.ts, otherwise the generated
// schema will not match what the runtime expects. Adapter and secrets are
// placeholders: the CLI never connects to a database.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	baseURL: "http://localhost",
	secret: "cli-only-placeholder-not-a-real-secret",
	database: drizzleAdapter({} as never, {
		provider: "sqlite",
		usePlural: false,
	}),
	emailAndPassword: {
		enabled: true,
	},
	// Add the same plugins as src/lib/auth.ts here, e.g. `admin()`.
	plugins: [],
});
