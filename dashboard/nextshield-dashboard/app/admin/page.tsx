"use client";
import React from "react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/client";
import logo from "../../../public/logo.jpg";
import background from "../../../public/logo1.jpg";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
      });
      setLoading(false);
      if (error) {
        setErr(error.message);
        return;
      }
      router.push("/admin");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_0_20px_#00ffbf20]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              NetShield Admin {isSignup ? "Signup" : "Login"}
            </h1>
            <p className="text-xs text-slate-400">
              Restricted access for admin console
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setErr("");
              setIsSignup((v) => !v);
            }}
            className="text-[11px] text-emerald-300 hover:text-emerald-200"
          >
            {isSignup ? "Have an account?" : "Create account"}
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:ring-emerald-500/60 focus:ring-2 outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Password</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:ring-emerald-500/60 focus:ring-2 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          {err && (
            <div className="text-[11px] text-red-300 bg-red-900/40 border border-red-700/60 rounded-md px-2 py-1">
              {err}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-md bg-emerald-500/90 text-slate-900 text-xs font-semibold py-2 hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
              ? "Sign up"
              : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
