import path from "node:path";
import { fileURLToPath } from "node:url";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

// Tests run inside workerd (@cloudflare/vitest-plugin) and get the top-level
// (local) bindings from wrangler.jsonc. Drizzle migrations are injected through a
// test-only binding and applied per test file in test/setup.ts.
const here = path.dirname(fileURLToPath(import.meta.url));

async function readTestBindings(): Promise<Record<string, string>> {
	try {
		const { readFile } = await import("node:fs/promises");
		return JSON.parse(await readFile(path.join(here, "test/bindings.json"), "utf8"));
	} catch {
		return {};
	}
}

export default defineConfig({
	resolve: {
		// Honors the `#/*` -> `./src/*` alias from tsconfig.json.
		tsconfigPaths: true,
		alias: {
			// Better Auth's tanstackStartCookies plugin imports this module to write
			// cookies; the real one needs TanStack Start's vite virtual entry, which
			// does not exist under vitest. See test/stubs/start-server.ts.
			"@tanstack/react-start/server": path.join(
				here,
				"test/stubs/start-server.ts",
			),
		},
	},
	plugins: [
		cloudflareTest(async () => {
			const migrations = await readD1Migrations(path.join(here, "migrations"));
			return {
				// Override wrangler's `main`: tests import business modules directly and
				// do not need the TanStack Start entry (it depends on vite virtual modules).
				main: path.join(here, "test/worker.ts"),
				wrangler: { configPath: "./wrangler.jsonc" },
				// Remote-only bindings (AI, Browser Rendering, ...) are not used in unit
				// tests; disabling the proxy avoids needing CLOUDFLARE_API_TOKEN.
				remoteBindings: false,
				miniflare: {
					bindings: {
						TEST_MIGRATIONS: migrations,
						BETTER_AUTH_URL: "http://localhost:3000",
						BETTER_AUTH_SECRET: "test-secret-not-for-production-0123456789abcdef",
						// Recipes add non-secret test values (e.g. a test webhook signing key)
						// to test/bindings.json; real secrets never live in the repo.
						...(await readTestBindings()),
					},
				},
			};
		}),
	],
	test: {
		include: [
			"test/**/*.test.ts",
			"test/**/*.test.tsx",
			"src/**/*.test.ts",
			"src/**/*.test.tsx",
		],
		setupFiles: ["./test/setup.ts"],
		// When Better Auth throws an APIError inside workerd (e.g. 401 on a bad
		// login) its span wrapper reports one extra, already-handled rejection.
		// Ignore only that class of error; everything else still fails the run.
		onUnhandledError(error) {
			const e = error as { name?: string; statusCode?: number };
			if (
				e?.name === "APIError" &&
				typeof e.statusCode === "number" &&
				e.statusCode < 500
			) {
				return false;
			}
		},
	},
});
