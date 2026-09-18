// Test-only Worker entry. Unit tests import business modules (auth / oRPC / db)
// directly and never run the full TanStack Start app, so src/server/entry.ts is
// not used here. If you add Durable Objects, re-export their classes from this
// file too, otherwise the vitest plugin cannot instantiate their bindings.
export default {
	fetch: () => new Response("test worker"),
} satisfies ExportedHandler;
