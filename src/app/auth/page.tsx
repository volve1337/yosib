import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to or create your YosiBreak account.",
};

export default function AuthPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 pb-16 pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.10),transparent_36%)]" />
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="h-[560px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />}>
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}
