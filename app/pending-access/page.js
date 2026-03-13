import Link from "next/link";
import styles from "./page.module.css";

const REASON_COPY = {
  "missing-email": "Your provider account did not return an email address.",
  "unverified-email": "Your email is not verified with the identity provider.",
  "not-allowlisted": "Your email is not in the current access allowlist.",
  "unsupported-provider": "This sign-in provider is not allowed for this app.",
};

export const metadata = {
  title: "Pending Access | Concept Lab",
};

export default async function PendingAccessPage({ searchParams }) {
  const query = await searchParams;
  const reason = String(query?.reason || "").trim();

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Account Verification</p>
        <h1 className={styles.title}>Access pending</h1>
        <p className={styles.copy}>
          {REASON_COPY[reason] || "Your account could not be verified for Concept Lab access yet."}
        </p>
        <p className={styles.subtle}>
          If this is unexpected, verify your provider email and contact the admin to be allowlisted.
        </p>

        <Link href="/login" className={styles.button}>
          Try another account
        </Link>
      </section>
    </main>
  );
}
