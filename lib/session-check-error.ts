/**
 * Thrown by `getSession()` (app/(auth)/actions.ts) when a session check
 * fails for a reason unrelated to actually being signed out — rate
 * limited, network error, malformed response — as opposed to returning
 * `null` for a genuine 401/no-cookie. Kept in its own plain module because
 * a "use server" file may only export async functions, not a class.
 */
export class SessionCheckError extends Error {}
