import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db, schema } from "#/db";
import { publicProc } from "#/orpc/middleware";

/**
 * A small, real vertical slice: the database, a procedure, and validation. Kept because it is the
 * first thing an assistant reads to learn how a procedure is written here, so it has to be right.
 *
 * Two things it does on purpose:
 *
 * Every procedure starts from a named builder in `src/orpc/middleware.ts` — `publicProc` here, so
 * anyone can read the list. Swap it for `sessionProc` and the same procedure needs a signed-in user,
 * with no other change.
 *
 * State lives in the database, never in a module. A Worker is not one long-running process: your
 * code is started, used, and thrown away, many copies at once. A `const todos = []` at the top of a
 * file looks like storage and behaves like a cache that empties without warning — the single most
 * expensive mistake to make on this platform, because it works perfectly until it is in front of
 * real people.
 */

export const listTodos = publicProc
	.route({ method: "GET", path: "/todos", tags: ["todos"] })
	.input(
		z
			.object({ limit: z.number().int().min(1).max(100).default(50) })
			.optional(),
	)
	.handler(async ({ input }) => {
		return db
			.select()
			.from(schema.todos)
			.orderBy(desc(schema.todos.id))
			.limit(input?.limit ?? 50);
	});

export const addTodo = publicProc
	.route({ method: "POST", path: "/todos", tags: ["todos"] })
	// Validation is the procedure's own business: a caller that sends nonsense gets an answer, not a
	// database error.
	.input(z.object({ title: z.string().trim().min(1).max(200) }))
	.handler(async ({ input }) => {
		const [row] = await db
			.insert(schema.todos)
			.values({ title: input.title })
			.returning();
		return row;
	});

export const removeTodo = publicProc
	.route({ method: "DELETE", path: "/todos/{id}", tags: ["todos"] })
	.input(z.object({ id: z.number().int().positive() }))
	.handler(async ({ input }) => {
		const [row] = await db
			.delete(schema.todos)
			.where(eq(schema.todos.id, input.id))
			.returning();
		return { removed: Boolean(row) };
	});
