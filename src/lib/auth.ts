import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db, schema } from "#/db";

export const auth = betterAuth({
	// BETTER_AUTH_URL doubles as baseURL and trusted origin. Set it and it wins; leave
	// it unset and Better Auth infers the origin from the request instead.
	//
	// The inference is here for one reason: this app can be deployed by clicking a
	// button, and nobody knows the Worker URL until after that click. Requiring the
	// variable first would mean the reward for deploying is an error page. Set it once
	// you have a real domain -- an explicit origin is still the stronger guarantee,
	// because inference trusts whatever Host header arrives.
	baseURL: env.BETTER_AUTH_URL || undefined,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: "sqlite",
		usePlural: false,
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	// Cloudflare puts the real client IP in cf-connecting-ip.
	advanced: {
		ipAddress: { ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"] },
	},
	// Short-lived signed cookie cache for session + user so route guards and
	// oRPC middleware do not hit D1 on every request. Role changes take up to
	// 5 minutes (or a re-login) to show up.
	session: {
		cookieCache: { enabled: true, maxAge: 5 * 60 },
	},
	// Keep tanstackStartCookies() LAST: cookies set by plugins that run after it
	// would never reach the framework cookie store.
	plugins: [tanstackStartCookies()],
});

export type Session = typeof auth.$Infer.Session;
