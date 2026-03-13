import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

const ALLOWED_EMAILS = new Set(
  String(process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
);

function isAllowlistEnabled() {
  return ALLOWED_EMAILS.size > 0;
}

function isAllowlisted(email) {
  if (!isAllowlistEnabled()) return true;
  return ALLOWED_EMAILS.has(String(email || "").trim().toLowerCase());
}

async function hasVerifiedGithubEmail(account, userEmail) {
  if (!account?.access_token) return false;

  try {
    const response = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${account.access_token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    });

    if (!response.ok) return false;
    const rows = await response.json();
    if (!Array.isArray(rows)) return false;

    const normalizedUserEmail = String(userEmail || "").trim().toLowerCase();
    const verified = rows.find((row) => row?.verified && String(row?.email || "").trim().toLowerCase() === normalizedUserEmail);
    if (verified) return true;

    return rows.some((row) => row?.verified && row?.primary);
  } catch {
    return false;
  }
}

const providers = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: { params: { scope: "read:user user:email" } },
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (providers.length === 0) {
  // Keeps the app fail-fast if OAuth env vars are missing in deployment.
  throw new Error("No OAuth providers configured. Set Google and/or GitHub auth env vars.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = String(user?.email || "").trim().toLowerCase();
      if (!email) return "/pending-access?reason=missing-email";

      if (account?.provider === "google") {
        if (profile?.email_verified !== true) return "/pending-access?reason=unverified-email";
      } else if (account?.provider === "github") {
        const verified = await hasVerifiedGithubEmail(account, email);
        if (!verified) return "/pending-access?reason=unverified-email";
      } else {
        return "/pending-access?reason=unsupported-provider";
      }

      if (!isAllowlisted(email)) return "/pending-access?reason=not-allowlisted";
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = String(user.email).trim().toLowerCase();
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.email) session.user.email = token.email;
      return session;
    },
  },
});
