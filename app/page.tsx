"use client";

import Image from "next/image";
import styles from "@/app/page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <Image
            className={styles.logo}
            src="/assets/bilt-logo.png"
            alt="Bilt logo"
            width={200}
            height={33}
            priority
          />
        </div>

        <div className={styles.instructionContainer}>
          <div className={styles.header}>Hello!</div>
          <div className={styles.body}>
            We&apos;re all set up! Please feel free to use the internet to look
            anything up during the assessment.
            <br />
            <br />
            Good luck!
          </div>
        </div>
      </main>
    </div>
  );
}
