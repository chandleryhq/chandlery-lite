import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		cloudflare({
			viteEnvironment: { name: "ssr" },
			// Share miniflare state with `pnpm db:migrate:local` so dev and migrations use one D1.
			persistState: { path: ".wrangler/state" },
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
