import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { isAuthEnabled } from "@/lib/authMode";
import styles from "./page.module.css";

export const metadata = {
  title: "Sign In | Concept Lab",
};

export default async function LoginPage({ searchParams }) {
  if (!isAuthEnabled()) {
    redirect("/");
  }

  const session = await auth();
  const query = await searchParams;
  const callbackUrl = String(query?.callbackUrl || "/");
  const hasGoogle = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const hasGitHub = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
  const hasAnyProvider = hasGoogle || hasGitHub;

  if (session?.user?.email) {
    redirect(callbackUrl);
  }

  async function signInWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl });
  }

  async function signInWithGitHub() {
    "use server";
    await signIn("github", { redirectTo: callbackUrl });
  }

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Concept Lab Access</p>
        <h1 className={styles.title}>Sign in to continue</h1>
        <p className={styles.copy}>
          Use your Google or GitHub account. Verified users are redirected to the learning workspace automatically.
        </p>

        <div className={styles.actions}>
          {hasGoogle && (
            <form action={signInWithGoogle}>
              <button className={styles.button} type="submit">
                Continue with Google
              </button>
            </form>
          )}
          {hasGitHub && (
            <form action={signInWithGitHub}>
              <button className={styles.buttonSecondary} type="submit">
                Continue with GitHub
              </button>
            </form>
          )}
          {!hasAnyProvider && (
            <p className={styles.warning}>
              OAuth providers are not configured yet. Add Google/GitHub keys in <code>.env.local</code> and restart the server.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
