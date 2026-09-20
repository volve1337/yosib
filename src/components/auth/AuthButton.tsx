"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogIn, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthButton() {
  const { user, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  // The server and the first browser render must be identical. Supabase can
  // restore a cached session before selective hydration reaches the navbar,
  // so keep the deterministic placeholder until this component is mounted.
  if (!mounted || loading) {
    return <div className="h-9 w-9 animate-pulse rounded-full border border-white/10 bg-white/5" aria-label="Loading account" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white px-3 text-xs font-black text-black transition hover:bg-neutral-200"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden lg:inline">Sign in</span>
      </Link>
    );
  }

  const email = user.email ?? "Account";
  const displayName = user.user_metadata?.full_name || email.split("@")[0];
  const initial = String(displayName).charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white/5 pl-1 pr-2 text-xs font-bold text-white transition hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-black text-black">
          {initial || <UserRound className="h-4 w-4" />}
        </span>
        <span className="hidden max-w-24 truncate xl:block">{displayName}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-2xl" role="menu">
          <div className="border-b border-white/10 px-3 py-3">
            <p className="truncate text-sm font-bold text-white">{displayName}</p>
            <p className="mt-0.5 truncate text-xs text-neutral-500">{email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-neutral-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            role="menuitem"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
