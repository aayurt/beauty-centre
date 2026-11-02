"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Use hard navigation to ensure session cookie is attached cleanly across server components
      window.location.href = "/admin";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border/80 rounded-3xl shadow-xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="size-14 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20 text-white">
              <Lock className="size-6" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage your salon</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-username"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5"
            >
              Username
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoFocus
              className="w-full px-4 py-3 border border-border bg-background rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-border bg-background rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all duration-200 active:scale-[0.99]"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <span className="font-semibold text-primary">K &amp; S Beauty Centre</span> Admin
        </p>
      </div>
    </div>
  );
}
