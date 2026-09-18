import { createRouterClient } from "@orpc/server";

import { auth } from "#/lib/auth";
import { router } from "#/orpc/router";

export const PASSWORD = "changeme-1234";

let seq = 0;

/** Create a user through Better Auth's email + password sign-up. */
export async function createUser(
	input: { email?: string; password?: string; name?: string } = {},
) {
	seq++;
	const email = input.email ?? `user${seq}-${Date.now()}@test.local`;
	const password = input.password ?? PASSWORD;
	const name = input.name ?? `User ${seq}`;
	const { user } = await auth.api.signUpEmail({
		body: { email, password, name },
	});
	return { user, email, password, name };
}

/** Sign in with email + password and return headers carrying the session cookie. */
export async function signInHeaders(
	email: string,
	password = PASSWORD,
): Promise<Headers> {
	const { headers } = await auth.api.signInEmail({
		body: { email, password },
		returnHeaders: true,
	});
	const cookie = headers
		.getSetCookie()
		.map((c) => c.split(";")[0])
		.join("; ");
	return new Headers({ cookie });
}

/** Create a user and sign in. */
export async function userHeaders(
	input: { email?: string; name?: string } = {},
) {
	const { email, password } = await createUser(input);
	return signInHeaders(email, password);
}

/** In-process oRPC client (same path SSR uses, no HTTP). */
export function rpc(headers: Headers = new Headers()) {
	return createRouterClient(router, { context: { headers } });
}
