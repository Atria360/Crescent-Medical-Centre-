"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient px-4">
      <form onSubmit={submit} className="card w-full max-w-md p-10">
        <h1 className="text-2xl">Admin Login</h1>
        <p className="mt-2 text-sm text-brand-body">Crescent Medical Centre CMS</p>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-8 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal"
        />
        {error && <p className="mt-4 text-sm font-bold text-brand-red">{error}</p>}
        <button type="submit" disabled={loading} className="btn-teal mt-6 w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
