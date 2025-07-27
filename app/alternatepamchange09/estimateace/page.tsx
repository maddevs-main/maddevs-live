"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head';

export default function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("admin_jwt");
      if (!token) {
        router.replace("/alternatepamchange09");
        return;
      }

      // Validate token with backend
      try {
        const response = await fetch('/api/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Token is invalid, clear it and redirect
          localStorage.removeItem("admin_jwt");
          router.replace("/alternatepamchange09");
          return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // Network error or other issue, redirect to login
        localStorage.removeItem("admin_jwt");
        router.replace("/alternatepamchange09");
      }
    };

    validateToken();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_jwt");
    router.replace("/alternatepamchange09");
  };

  // Show loading or redirect if not authenticated
  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "#222222",
        color: "white",
        fontFamily: "Inter, Arial, sans-serif"
      }}>
        {isLoading ? "Validating authentication..." : "Redirecting to login..."}
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: 132, fontFamily: "Inter, Arial, sans-serif" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Admin Management</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
          <a href="/alternatepamchange09/estimateace/manage/onboard" style={{ fontSize: 20, color: "#0074d9", textDecoration: "underline", marginBottom: 8 }}>Onboard Management</a>
          <a href="/alternatepamchange09/estimateace/manage/blogs" style={{ fontSize: 20, color: "#0074d9", textDecoration: "underline", marginBottom: 8 }}>Blogs Management</a>
          <a href="/alternatepamchange09/estimateace/manage/news" style={{ fontSize: 20, color: "#0074d9", textDecoration: "underline", marginBottom: 8 }}>News Management</a>
        </div>
        <button onClick={handleLogout} style={{ padding: 12, borderRadius: 4, background: "#ff4136", color: "#fff", fontWeight: 600, fontSize: 16, border: "none", cursor: "pointer" }}>Logout</button>
      </div>
    </>
  );
}