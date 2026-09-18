import { createFileRoute } from "@tanstack/react-router";

import { Auth } from "#/components/auth/auth";

/**
 * Every account screen, at /auth/<name>: sign-in, sign-up, forgot-password, reset-password,
 * sign-out. One route rather than five files, because they are one flow and share a layout.
 */
export const Route = createFileRoute("/auth/$path")({ component: AuthPage });

function AuthPage() {
	const { path } = Route.useParams();

	return (
		<main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
			<Auth path={path} />
		</main>
	);
}
