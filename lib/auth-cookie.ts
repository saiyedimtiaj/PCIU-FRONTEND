/**
 * Session cookie naming.
 *
 * Better Auth prefixes its cookie with `__Secure-` whenever it considers the
 * deployment secure — which it decides from the backend's own `BETTER_AUTH_URL`,
 * not from ours. So the same login endpoint hands us
 * `better-auth.session_token` on one deployment and
 * `__Secure-better-auth.session_token` on another. Matching the bare name only
 * meant the cookie was silently dropped against an https-configured backend, and
 * `proxy.ts` then bounced every /admin navigation straight back to /signin.
 *
 * We therefore match on the unprefixed name and keep whichever name the backend
 * actually used, because that is the name it expects to read back.
 */
export const AUTH_COOKIE_BASE_NAME = "better-auth.session_token";

const COOKIE_PREFIXES = ["__Secure-", "__Host-"] as const;

/** Strips any RFC 6265bis cookie-name prefix. */
export const stripCookiePrefix = (name: string): string => {
  const prefix = COOKIE_PREFIXES.find((p) => name.startsWith(p));
  return prefix ? name.slice(prefix.length) : name;
};

/** True for the session cookie under any (or no) prefix. */
export const isAuthCookieName = (name: string): boolean =>
  stripCookiePrefix(name) === AUTH_COOKIE_BASE_NAME;
