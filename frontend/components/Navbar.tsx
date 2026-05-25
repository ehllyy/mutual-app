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

const menuItemBase: React.CSSProperties = {
  height: 56,
  display: "flex",
  alignItems: "center",
  paddingLeft: 20,
  fontSize: 15,
  color: "#1C1A14",
  borderTop: "1px solid rgba(28,26,20,0.07)",
  width: "100%",
  textAlign: "left" as const,
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);       // desktop avatar dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authPrompt, setAuthPrompt] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => setUser(getUser());
    checkAuth();
    window.addEventListener("mutual-auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("mutual-auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Close desktop avatar dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Close mobile menu on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (pathname === "/auth") return null;

  function closeMenu() { setMenuOpen(false); }

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-cream-dark bg-cream/95 backdrop-blur">
      <div ref={menuRef}>

        {/* ── TOP BAR ───────────────────────────────────────── */}
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link href="/browse" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
              <ArrowLeftRight className="h-4 w-4 text-cream" />
            </span>
            <span className="text-lg font-semibold text-ink">Mutual</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.filter(({ href }) => href !== "/messages" || !!user).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(href) ? "text-ink" : "text-ink-muted hover:text-ink-soft"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right-side actions */}
          <div className="flex items-center gap-3">

            {/* Desktop: List a skill */}
            <button
              onClick={() => user ? router.push("/post-skill") : setAuthPrompt(true)}
              className="hidden items-center gap-1.5 rounded-full border border-ink px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream md:flex"
            >
              <Plus className="h-3.5 w-3.5" />
              List a skill
            </button>

            {/* Desktop: avatar dropdown */}
            {user ? (
              <div ref={avatarRef} className="relative hidden md:block">
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
                    <div style={{ padding: 14 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1A14", lineHeight: 1.4 }}>{user.name}</p>
                      <p style={{ fontSize: 11, color: "#8A887E", marginTop: 2 }}>{user.email}</p>
                    </div>
                    <div style={{ height: 1, backgroundColor: "rgba(28,26,20,0.09)" }} />
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
                    <div style={{ height: 1, backgroundColor: "rgba(28,26,20,0.09)" }} />
                    <button
                      onClick={() => { logout(); setUser(null); setOpen(false); router.push("/browse"); }}
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
              /* Desktop: Join Mutual */
              <Link
                href="/auth"
                className="hidden rounded-full px-4 py-1.5 text-sm font-medium text-cream transition-opacity hover:opacity-90 md:block"
                style={{ backgroundColor: "#1C1A14" }}
              >
                Join Mutual
              </Link>
            )}

            {/* Mobile: avatar (no dropdown — hamburger handles menu) */}
            {user ? (
              <Link
                href="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-sm font-semibold text-white md:hidden"
              >
                {initials}
              </Link>
            ) : (
              <Link
                href="/auth"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-cream transition-opacity hover:opacity-90 md:hidden"
                style={{ backgroundColor: "#1C1A14" }}
              >
                Join Mutual
              </Link>
            )}

            {/* Mobile: hamburger button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 flex-col items-center justify-center gap-[7px] md:hidden"
              aria-label="Open menu"
            >
              <span className="block h-[2px] w-5 rounded-[1px] bg-[#1C1A14]" />
              <span className="block h-[2px] w-5 rounded-[1px] bg-[#1C1A14]" />
              <span className="block h-[2px] w-5 rounded-[1px] bg-[#1C1A14]" />
            </button>
          </div>
        </div>

        {/* ── MOBILE HAMBURGER DROPDOWN ─────────────────────── */}
        {menuOpen && (
          <div
            className="md:hidden"
            style={{ backgroundColor: "#fff", boxShadow: "0 8px 24px rgba(28,26,20,0.10)" }}
          >
            {/* Browse */}
            <Link
              href="/browse"
              onClick={closeMenu}
              className="hover:bg-[#F5F1E6] transition-colors block"
              style={menuItemBase}
            >
              Browse
            </Link>

            {/* List a skill */}
            <button
              onClick={() => { closeMenu(); user ? router.push("/post-skill") : setAuthPrompt(true); }}
              className="hover:bg-[#F5F1E6] transition-colors"
              style={menuItemBase}
            >
              List a skill
            </button>

            {user ? (
              <>
                <Link
                  href="/messages"
                  onClick={closeMenu}
                  className="hover:bg-[#F5F1E6] transition-colors block"
                  style={menuItemBase}
                >
                  Chats
                </Link>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="hover:bg-[#F5F1E6] transition-colors block"
                  style={menuItemBase}
                >
                  My profile
                </Link>
                <button
                  onClick={() => { logout(); setUser(null); closeMenu(); router.push("/browse"); }}
                  className="hover:bg-[#FAEDE4] transition-colors"
                  style={{ ...menuItemBase, color: "#C4571A" }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={closeMenu}
                className="hover:opacity-90 transition-opacity block"
                style={{ ...menuItemBase, color: "#3D6B4F", backgroundColor: "#EAF0EB" }}
              >
                Join Mutual
              </Link>
            )}
          </div>
        )}

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
