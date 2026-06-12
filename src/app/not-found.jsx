"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Map not found</h1>
          <p>The page or map you were looking for could not be found.</p>
          <div className={styles.ctas}>
            <Link className={styles.primary} href="/">
              Return home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
