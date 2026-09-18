import startEntry from "@tanstack/react-start/server-entry";

// Thin wrapper instead of `main: "@tanstack/react-start/server-entry"` so the
// same Worker can export more than the HTTP handler. Add here as needed:
//   export { MyRoom } from "#/server/my-room";          // Durable Object classes
//   export { MyWorkflow } from "#/server/my-workflow";  // Workflows
//   async queue(batch, env, ctx) { ... }                // Queue consumers
// Remember to declare them in wrangler.jsonc (top level AND each env block) and
// re-export Durable Objects from test/worker.ts as well.
export default {
	fetch(request, env, ctx) {
		return (
			startEntry.fetch as unknown as ExportedHandlerFetchHandler<Cloudflare.Env>
		)(request, env, ctx);
	},

	// Runs only when `triggers.crons` is configured in wrangler.jsonc.
	async scheduled() {},
} satisfies ExportedHandler<Cloudflare.Env>;
