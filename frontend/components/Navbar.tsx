"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Plus } from "lucide-react";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/messages", label: "Chats" },
];

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/auth") return null;

  return (
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
          {NAV_LINKS.map(({ href, label }) => (
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
          <Link
            href="/post-skill"
            className="hidden items-center gap-1.5 rounded-full border border-ink px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream md:flex"
          >
            <Plus className="h-3.5 w-3.5" />
            List a skill
          </Link>
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-sm font-semibold text-white"
          >
            EA
          </Link>
        </div>
      </div>
    </header>
  );
}
