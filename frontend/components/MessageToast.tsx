"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUser, type AuthUser } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type ApiMessage = {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
};

type Toast = { sender: string; preview: string };

const AVATAR_COLORS = [
  "#3D6B4F", "#9B3E7A", "#7A47A8", "#C4763A",
  "#8B7040", "#2D7D6F", "#6B5E3F", "#B05E9A", "#C48A2A",
];

function toAvatarColor(name: string) {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function toInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function MessageToast() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const pathnameRef = useRef(pathname);
  const seenIdsRef = useRef<Set<number> | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep pathnameRef current so the polling closure always reads the latest path
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  // Dismiss toast when navigating to /messages
  useEffect(() => {
    if (pathname === "/messages") setToast(null);
  }, [pathname]);

  // Track auth state
  useEffect(() => {
    setUser(getUser());
    const handle = () => setUser(getUser());
    window.addEventListener("mutual-auth-change", handle);
    return () => window.removeEventListener("mutual-auth-change", handle);
  }, []);

  // Polling — restarts when the logged-in user changes
  useEffect(() => {
    if (!user?.name) return;

    // Reset seen IDs on user change so we start fresh
    seenIdsRef.current = null;

    async function poll() {
      try {
        const res = await fetch(`${BASE_URL}/messages/${encodeURIComponent(user!.name)}`);
        if (!res.ok) return;
        const data: ApiMessage[] = await res.json();
        if (!Array.isArray(data)) return;

        const received = data.filter((m) => m.receiver === user!.name);

        if (seenIdsRef.current === null) {
          // First poll — baseline snapshot, no toast
          seenIdsRef.current = new Set(received.map((m) => m.id));
          return;
        }

        const newMsgs = received.filter((m) => !seenIdsRef.current!.has(m.id));

        if (newMsgs.length > 0 && pathnameRef.current !== "/messages") {
          const latest = [...newMsgs].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];

          setToast({
            sender: latest.sender,
            preview: latest.content.length > 40
              ? latest.content.slice(0, 40) + "…"
              : latest.content,
          });

          if (dismissTimer.current) clearTimeout(dismissTimer.current);
          dismissTimer.current = setTimeout(() => setToast(null), 4000);
        }

        received.forEach((m) => seenIdsRef.current!.add(m.id));
      } catch { /* silent */ }
    }

    poll();
    const id = setInterval(poll, 10000);
    return () => {
      clearInterval(id);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [user?.name]);

  if (!toast) return null;

  return (
    <div
      onClick={() => { setToast(null); router.push("/messages"); }}
      className="fixed z-50 flex cursor-pointer items-center gap-3 rounded-[12px] bg-[#1c1a14] px-4 py-3 shadow-lg
        top-4 left-1/2 -translate-x-1/2 w-[280px]
        md:top-auto md:bottom-4 md:left-auto md:right-4 md:translate-x-0 md:w-[320px]"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
        style={{ backgroundColor: toAvatarColor(toast.sender) }}
      >
        {toInitials(toast.sender)}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-white">New message from {toast.sender}</p>
        <p className="mt-0.5 truncate text-xs text-white/70">{toast.preview}</p>
      </div>
    </div>
  );
}
