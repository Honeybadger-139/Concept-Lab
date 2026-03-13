import { auth, signOut } from "@/auth";
import { isAuthEnabled } from "@/lib/authMode";
import styles from "./AuthControls.module.css";

export default async function AuthControls() {
  if (!isAuthEnabled()) return null;

  const session = await auth();
  const email = String(session?.user?.email || "").trim();

  if (!email) return null;

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.email} title={email}>
        {email}
      </span>
      <form action={handleSignOut}>
        <button className={styles.signOut} type="submit">
          Sign out
        </button>
      </form>
    </div>
  );
}
