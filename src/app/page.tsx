"use client";
// import styles from "./page.module.css";
import { Roboto } from "next/font/google";
import Explore from "./components/explore";

export default function Home() {
  return (
    // <main className={styles.main}>
    <main>
      <Explore />
    </main>
  );
}
