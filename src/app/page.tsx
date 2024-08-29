"use client";
// import styles from "./page.module.css";
import { Roboto } from "next/font/google";
import Initial from "./components/initial";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    // <main className={styles.main}>
    <main>
      <QueryClientProvider client={queryClient}>
        <Initial />
      </QueryClientProvider>
    </main>
  );
}
