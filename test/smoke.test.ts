import { ORPCError } from "@orpc/server";
import { describe, expect, it } from "vitest";

import { auth } from "#/lib/auth";

import { createUser, rpc, signInHeaders } from "./helpers";

describe("smoke", () => {
	it("signs up, signs in and reaches the router", async () => {
		const { email, password } = await createUser({ name: "Smoke Tester" });
		const headers = await signInHeaders(email, password);

		const session = await auth.api.getSession({ headers });
		expect(session?.user.email).toBe(email);

		expect(await rpc(headers).health()).toEqual({ ok: true });

		const me = await rpc(headers).me();
		expect(me.email).toBe(email);
	});

	it("public procedures work without a session", async () => {
		expect(await rpc().health()).toEqual({ ok: true });
	});

	it("session procedures reject anonymous callers with UNAUTHORIZED", async () => {
		const err = await rpc()
			.me()
			.catch((e: unknown) => e);
		expect(err).toBeInstanceOf(ORPCError);
		expect((err as ORPCError<string, unknown>).code).toBe("UNAUTHORIZED");
	});
});
