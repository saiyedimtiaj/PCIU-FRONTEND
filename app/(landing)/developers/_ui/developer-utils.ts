export function initials(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

/** The admin may enter a bare username or a full profile URL. */
export function githubProfile(value: string) {
  const handle = value
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0];
  return { handle, href: `https://github.com/${handle}` };
}

export const DOT_PATTERN = {
  backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
  backgroundSize: "24px 24px",
};
