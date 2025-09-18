// app/login/page.tsx (updated)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "../components/LoginPage";

export default function Login() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if already logged in
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = (email: string, password: string) => {
    localStorage.setItem("isAuthenticated", "true");
    router.push("/");
  };

  return <LoginPage onLogin={handleLogin} />;
}