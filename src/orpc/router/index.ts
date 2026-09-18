import { publicProc, sessionProc } from "#/orpc/middleware";
import { addTodo, listTodos, removeTodo } from "./todos";

// Group procedures by domain as the app grows, e.g. `{ health, me, posts: postsRouter }`.
// Every procedure must start from a named builder in src/orpc/middleware.ts.
export const router = {
	health: publicProc.handler(() => ({ ok: true }) as const),
	me: sessionProc.handler(({ context }) => context.session.user),
	listTodos,
	addTodo,
	removeTodo,
};

export type AppRouter = typeof router;

export default router;
