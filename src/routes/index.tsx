import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/")({ component: Home });

/**
 * The first page anybody sees, and the first page you should replace.
 *
 * It is deliberately small. Its only job is to prove the pieces are connected — you can create an
 * account, you can sign in, and the page knows who you are — so that when you start describing what
 * you actually want, you are changing something that already works.
 */
function Home() {
	const { data: session, isPending } = authClient.useSession();

	return (
		<main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-4 py-16">
			<h1 className="text-4xl font-semibold tracking-tight">chandlery-lite</h1>
			<p className="mt-3 text-lg text-muted-foreground">
				Your project is running. Accounts, the database and the deploy route are
				already working — what it does is up to you.
			</p>

			<div className="mt-8 rounded-lg border p-5">
				{isPending ? (
					<p className="text-sm text-muted-foreground">
						Checking whether you are signed in…
					</p>
				) : session?.user ? (
					<>
						<p className="text-sm">
							Signed in as <strong>{session.user.email}</strong>.
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							The first account created is yours; it is a normal account like
							any other.
						</p>
						<Button className="mt-4" variant="secondary" asChild>
							<Link to="/auth/$path" params={{ path: "sign-out" }}>
								Sign out
							</Link>
						</Button>
					</>
				) : (
					<>
						<p className="text-sm">Nobody is signed in.</p>
						<p className="mt-1 text-sm text-muted-foreground">
							Create an account to see the signed-in side. It is stored on your
							own computer until you put this online.
						</p>
						<div className="mt-4 flex gap-2">
							<Button asChild>
								<Link to="/auth/$path" params={{ path: "sign-up" }}>
									Create an account
								</Link>
							</Button>
							<Button variant="secondary" asChild>
								<Link to="/auth/$path" params={{ path: "sign-in" }}>
									Sign in
								</Link>
							</Button>
						</div>
					</>
				)}
			</div>

			<p className="mt-8 text-sm text-muted-foreground">
				Next: edit{" "}
				<code className="rounded bg-muted px-1 py-0.5">
					src/routes/index.tsx
				</code>
				. The database, the accounts and the tests are already wired up.
			</p>
		</main>
	);
}
