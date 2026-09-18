import { ORPCError, os } from "@orpc/server";

import { auth } from "#/lib/auth";

// Starting context for every procedure. Both the catch-all HTTP handler
// (src/routes/api.rpc.$.ts) and the in-process router client (src/orpc/client.ts)
// inject `headers`; the middleware resolves the Better Auth session from them.
export interface BaseContext {
	headers: Headers | Record<string, string>;
}

export interface AuthedContext extends BaseContext {
	session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
}

export function toHeaders(input: BaseContext["headers"]): Headers {
	return input instanceof Headers ? input : new Headers(input);
}

export const requireSession = os
	.$context<BaseContext>()
	.middleware(async ({ context, next }) => {
		const session = await auth.api
			.getSession({ headers: toHeaders(context.headers) })
			.catch(() => null);
		if (!session) {
			throw new ORPCError("UNAUTHORIZED", { message: "Not signed in" });
		}
		return next({ context: { ...context, session } });
	});

// `role` is populated by Better Auth's admin plugin (or a `role` additional
// field on the user). It is read loosely so this compiles before you enable it.
function roleOf(session: AuthedContext["session"]): string | null {
	const role = (session.user as { role?: string | null }).role;
	return typeof role === "string" && role.length > 0 ? role : null;
}

export const requireAdmin = os
	.$context<AuthedContext>()
	.middleware(async ({ context, next }) => {
		if (roleOf(context.session) !== "admin") {
			throw new ORPCError("FORBIDDEN", { message: "Admin access required" });
		}
		return next({ context });
	});

// Public procedure (health checks, sign-in page helpers, ...).
export const publicProc = os.$context<BaseContext>();

// Requires a signed-in user.
export const sessionProc = publicProc.use(requireSession);

// Requires `session.user.role === "admin"`.
export const adminProc = sessionProc.use(requireAdmin);
