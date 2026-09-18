// Test stand-in: Better Auth's tanstackStartCookies plugin dynamically imports
// "@tanstack/react-start/server" to write cookies. The real module depends on
// TanStack Start's vite virtual entry, which does not exist under vitest
// (workerd). Tests only care about auth.api return values, so cookie writes are
// a no-op here (the plugin already wraps them in try/catch).
export function setCookie(): void {}
export function getRequestHeaders(): Headers {
	return new Headers();
}
