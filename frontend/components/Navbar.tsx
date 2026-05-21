"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Plus } from "lucide-react";
import { getUser, logout, type AuthUser } from "@/lib/auth";
import AuthPromptModal from "@/components/AuthPromptModal";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/messages", label: "Chats" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authPrompt, setAuthPrompt] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const u = getUser();
      setUser(u);
    };
    checkAuth();
    window.addEventListener("mutual-auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("mutual-auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (pathname === "/auth") return null;

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-cream-dark bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/browse" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
            <ArrowLeftRight className="h-4 w-4 text-cream" />
          </span>
          <span className="text-lg font-semibold text-ink">Mutual</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.filter(({ href }) => href !== "/messages" || !!user).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink-soft"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/messages"
              className={`text-sm font-medium transition-colors md:hidden ${
                pathname.startsWith("/messages") ? "text-ink" : "text-ink-muted hover:text-ink-soft"
              }`}
            >
              Chats
            </Link>
          )}
          <button
            onClick={() => user ? router.push("/post-skill") : setAuthPrompt(true)}
            className="hidden items-center gap-1.5 rounded-full border border-ink px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream md:flex"
          >
            <Plus className="h-3.5 w-3.5" />
            List a skill
          </button>

          {user ? (
            /* Logged-in: avatar + dropdown */
            <div ref={ref} className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-sm font-semibold text-white"
              >
                {initials}
              </button>

              {open && (
                <div
                  className="absolute right-0 z-50"
                  style={{
                    top: "calc(100% + 8px)",
                    minWidth: 220,
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid rgba(28,26,20,0.09)",
                    boxShadow: "0 4px 24px rgba(28,26,20,0.12)",
                  }}
                >
                  {/* User info */}
                  <div style={{ padding: 14 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1A14", lineHeight: 1.4 }}>
                      {user.name}
                    </p>
                    <p style={{ fontSize: 11, color: "#8A887E", marginTop: 2 }}>
                      {user.email}
                    </p>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, backgroundColor: "rgba(28,26,20,0.09)" }} />

                  {/* View profile */}
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="block transition-colors"
                    style={{ padding: "12px 14px", fontSize: 13, color: "#4A4840" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F5F1E6")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                  >
                    View profile
                  </Link>

                  {/* Divider */}
                  <div style={{ height: 1, backgroundColor: "rgba(28,26,20,0.09)" }} />

                  {/* Sign out */}
                  <button
                    onClick={() => {
                      logout();
                      setUser(null);
                      setOpen(false);
                      router.push("/browse");
                    }}
                    className="block w-full text-left transition-colors"
                    style={{ padding: "12px 14px", fontSize: 13, fontWeight: 500, color: "#C4571A" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAEDE4")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out: Join Mutual */
            <Link
              href="/auth"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-cream transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1C1A14" }}
            >
              Join Mutual
            </Link>
          )}
        </div>
      </div>
    </header>

    {authPrompt && (
      <AuthPromptModal
        title="Join Mutual to list a skill"
        onClose={() => setAuthPrompt(false)}
      />
    )}
  </>
  );
}
