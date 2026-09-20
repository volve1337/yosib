"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "signin" | "signup" | "forgot" | "reset";

const copy: Record<AuthMode, { title: string; subtitle: string; submit: string }> = {
  signin: { title: "Welcome back", subtitle: "Sign in to continue to YosiBreak.", submit: "Sign in" },
  signup: { title: "Create your account", subtitle: "Save your session securely across devices.", submit: "Create account" },
  forgot: { title: "Reset your password", subtitle: "We’ll email you a secure recovery link.", submit: "Send reset link" },
  reset: { title: "Choose a new password", subtitle: "Enter a new password for your YosiBreak account.", submit: "Update password" },
};

export default function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [mode, setMode] = useState<AuthMode>(searchParams.get("mode") === "reset" ? "reset" : "signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("reset");
    });
    return () => subscription.unsubscribe();
  }, []);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push("/");
        router.refresh();
        return;
      }

      if (mode === "signup") {
        if (password.length < 8) throw new Error("Password must be at least 8 characters.");
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setMessage("Account created. Check your email to confirm your account, then sign in.");
          setMode("signin");
          setPassword("");
        }
        return;
      }

      if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`,
        });
        if (resetError) throw resetError;
        setMessage("Password reset link sent. Check your email.");
        return;
      }

      if (password.length < 8) throw new Error("Password must be at least 8 characters.");
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setMessage("Password updated successfully. You can continue to YosiBreak.");
      setPassword("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!authLoading && user && mode !== "reset") {
    return (
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-950/85 p-8 text-center shadow-2xl backdrop-blur-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white text-xl font-black text-black">
          {(user.user_metadata?.full_name || user.email || "Y").charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-black text-white">You’re signed in</h1>
        <p className="mt-2 text-sm text-neutral-400">{user.email}</p>
        <Link href="/" className="mt-7 block rounded-xl bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-neutral-200">
          Continue to YosiBreak
        </Link>
        <button type="button" onClick={() => void signOut()} className="mt-3 text-sm font-bold text-neutral-500 transition hover:text-white">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/85 shadow-2xl backdrop-blur-2xl">
      <div className="border-b border-white/10 p-7 pb-6">
        <div className="mb-7 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-neutral-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/icon-192.png" width={34} height={34} alt="YosiBreak logo" className="rounded-xl border border-white/10" />
            <span className="font-black tracking-[-0.05em] text-white">YOSIBREAK</span>
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">{copy[mode].title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">{copy[mode].subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-7">
        {mode === "signup" && (
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">Name</span>
            <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 focus-within:border-white/30">
              <UserRound className="h-4 w-4 text-neutral-500" />
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                autoComplete="name"
                placeholder="Your name"
                className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-neutral-600"
              />
            </span>
          </label>
        )}

        {mode !== "reset" && (
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">Email</span>
            <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 focus-within:border-white/30">
              <Mail className="h-4 w-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-neutral-600"
              />
            </span>
          </label>
        )}

        {mode !== "forgot" && (
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">
              {mode === "reset" ? "New password" : "Password"}
            </span>
            <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 focus-within:border-white/30">
              <LockKeyhole className="h-4 w-4 text-neutral-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={mode === "signin" ? undefined : 8}
                autoComplete={mode === "signup" || mode === "reset" ? "new-password" : "current-password"}
                placeholder="••••••••"
                className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-neutral-600"
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-neutral-500 transition hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
        )}

        {error && <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-neutral-200">{error}</p>}
        {message && <p className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white">{message}</p>}

        <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-black text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? "Please wait…" : copy[mode].submit}
        </button>

        {mode === "signin" && (
          <div className="flex items-center justify-between gap-4 text-sm">
            <button type="button" onClick={() => switchMode("signup")} className="font-bold text-white hover:underline">Create account</button>
            <button type="button" onClick={() => switchMode("forgot")} className="text-neutral-500 transition hover:text-white">Forgot password?</button>
          </div>
        )}
        {mode === "signup" && <button type="button" onClick={() => switchMode("signin")} className="w-full text-sm text-neutral-500 transition hover:text-white">Already registered? <span className="font-bold text-white">Sign in</span></button>}
        {mode === "forgot" && <button type="button" onClick={() => switchMode("signin")} className="w-full text-sm font-bold text-neutral-400 transition hover:text-white">Return to sign in</button>}
      </form>
    </div>
  );
}
