"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, []);

  return <main className={styles.main}>Redirecting...</main>;
}
