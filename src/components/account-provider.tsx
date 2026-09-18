import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AuthProvider } from "#/components/auth/auth-provider";
import { authClient } from "#/lib/auth-client";

/**
 * The account screens, wired to this project.
 *
 * The screens themselves come from better-auth-ui, which lives in `src/components/auth/` as ordinary
 * files you own and can edit. This wrapper is the only place that knows how they connect to the rest
 * of the app, which is what makes them replaceable: if you ever swap the account screens for your
 * own, this file changes and nothing else does.
 *
 * `navigate` and `Link` come from TanStack Router. The screens do not import a router themselves —
 * they are handed one — which is why they work here at all.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
	const navigate = useNavigate();

	return (
		<AuthProvider
			authClient={authClient}
			navigate={navigate}
			// Where somebody lands after signing in. Change this to your own signed-in page.
			redirectTo="/"
			emailAndPassword={{ requireEmailVerification: false }}
			Link={({ href, ...props }) => <Link to={href} {...props} />}
		>
			{children}
		</AuthProvider>
	);
}
