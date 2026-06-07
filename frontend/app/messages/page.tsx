"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Send, ArrowLeft } from "lucide-react";
import { isLoggedIn, getUser } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/* ─── types ──────────────────────────────────────────────────────── */

type ApiMessage = {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
};

type Contact = {
  name: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
};

/* ─── localStorage for sent contacts ────────────────────────────── */

const SENT_KEY = "mutual_sent_contacts";

function getSentContacts(): string[] {
  try { return JSON.parse(localStorage.getItem(SENT_KEY) ?? "[]"); }
  catch { return []; }
}

function saveSentContact(name: string): void {
  const existing = getSentContacts();
  if (!existing.includes(name)) {
    localStorage.setItem(SENT_KEY, JSON.stringify([...existing, name]));
  }
}

/* ─── helpers ─────────────────────────────────────────────────────── */

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

function formatRelative(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return "Yesterday";
    return `${Math.floor(hours / 24)} days ago`;
  } catch { return ""; }
}

function formatClock(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

/* ─── page ───────────────────────────────────────────────────────── */

export default function MessagesPage() {
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    if (!isLoggedIn()) router.push("/auth");
  }, [router]);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [thread, setThread] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showChat, setShowChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ─ load contacts ─ */
  const loadContacts = useCallback(async () => {
    if (!user?.name) return;
    try {
      // Received messages — grouped by the other party
      const res = await fetch(`${BASE_URL}/messages/${encodeURIComponent(user.name)}`);
      if (!res.ok) return;
      const data: ApiMessage[] = await res.json();
      if (!Array.isArray(data)) return;

      const sorted = [...data].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const map = new Map<string, { lastMessage: string; lastTime: string; unread: number }>();
      for (const msg of sorted) {
        const other = msg.sender === user.name ? msg.receiver : msg.sender;
        const existing = map.get(other);
        const isReceived = msg.receiver === user.name;
        map.set(other, {
          lastMessage: msg.content,
          lastTime: msg.timestamp,
          unread: (existing?.unread ?? 0) + (isReceived ? 1 : 0),
        });
      }

      // Sent-only contacts from localStorage — fetch their last message
      const sentOnly = getSentContacts().filter((name) => !map.has(name));
      await Promise.all(
        sentOnly.map(async (contactName) => {
          try {
            const r = await fetch(
              `${BASE_URL}/messages/between/${encodeURIComponent(user.name)}/${encodeURIComponent(contactName)}`
            );
            if (!r.ok) return;
            const thread: ApiMessage[] = await r.json();
            if (!Array.isArray(thread) || thread.length === 0) return;
            const last = [...thread].sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )[0];
            map.set(contactName, { lastMessage: last.content, lastTime: last.timestamp, unread: 0 });
          } catch { /* skip */ }
        })
      );

      const list: Contact[] = Array.from(map.entries())
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());

      setContacts(list);
    } catch { /* silent */ }
  }, [user?.name]);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  /* ─ load thread when contact changes ─ */
  const loadThread = useCallback(async (contactName: string) => {
    if (!user?.name) return;
    try {
      const res = await fetch(
        `${BASE_URL}/messages/between/${encodeURIComponent(user.name)}/${encodeURIComponent(contactName)}`
      );
      if (!res.ok) return;
      const data: ApiMessage[] = await res.json();
      if (!Array.isArray(data)) return;
      setThread(
        [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      );
    } catch { /* silent */ }
  }, [user?.name]);

  useEffect(() => {
    if (selectedContact) loadThread(selectedContact);
  }, [selectedContact, loadThread]);

  /* ─ scroll to bottom on new messages ─ */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread]);

  /* ─ poll thread every 5 s when a conversation is open ─ */
  useEffect(() => {
    if (!selectedContact || !user?.name) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/messages/between/${encodeURIComponent(user.name)}/${encodeURIComponent(selectedContact)}`
        );
        if (!res.ok) return;
        const data: ApiMessage[] = await res.json();
        if (!Array.isArray(data)) return;
        const sorted = [...data].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setThread((prev) =>
          JSON.stringify(prev) === JSON.stringify(sorted) ? prev : sorted
        );
      } catch { /* silent */ }
    }, 5000);
    return () => clearInterval(id);
  }, [selectedContact, user?.name]);

  /* ─ poll contacts every 10 s ─ */
  useEffect(() => {
    const id = setInterval(() => { loadContacts(); }, 10000);
    return () => clearInterval(id);
  }, [loadContacts]);

  /* ─ handlers ─ */
  function selectContact(name: string) {
    setSelectedContact(name);
    setShowChat(true);
    setContacts((prev) => prev.map((c) => (c.name === name ? { ...c, unread: 0 } : c)));
  }

  async function sendMessage() {
    const text = newMessage.trim();
    if (!text || !selectedContact || !user?.name) return;
    setNewMessage("");
    try {
      await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: user.name,
          receiver: selectedContact,
          content: text,
          timestamp: new Date().toISOString(),
        }),
      });
      saveSentContact(selectedContact);
      await loadThread(selectedContact);
      const now = new Date().toISOString();
      setContacts((prev) => {
        const updated = prev.map((c) =>
          c.name === selectedContact ? { ...c, lastMessage: text, lastTime: now } : c
        );
        if (!prev.find((c) => c.name === selectedContact)) {
          updated.unshift({ name: selectedContact, lastMessage: text, lastTime: now, unread: 0 });
        }
        return updated.sort(
          (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
        );
      });
    } catch { /* silent */ }
  }

  const visible = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.unread > 0;
    return matchSearch && matchFilter;
  });

  const activeContact = contacts.find((c) => c.name === selectedContact);

  return (
    <div style={{ position: "fixed", top: 60, left: 0, right: 0, bottom: 0, display: "flex", overflow: "hidden" }}>

      {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
      <div className={`${showChat ? "hidden" : "flex"} md:flex w-full md:w-[300px] shrink-0 flex-col overflow-hidden border-r border-cream-dark bg-white`}>

        <div className="px-5 pt-6 pb-4">
          <h1 className="font-display text-xl font-bold text-ink">Messages</h1>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-full border border-cream-dark bg-cream px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages"
              className="flex-1 bg-transparent text-xs text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-1 px-4 pb-3">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                filter === f ? "bg-ink text-cream" : "text-ink-muted hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {visible.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-ink-muted">No messages yet.</p>
          )}
          {visible.map((contact) => (
            <button
              key={contact.name}
              onClick={() => selectContact(contact.name)}
              style={{ minHeight: 80 }}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-cream/60 ${
                contact.name === selectedContact
                  ? "border-l-[3px] border-sage bg-[#d4e8d8]/40"
                  : "border-l-[3px] border-transparent"
              }`}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: toAvatarColor(contact.name) }}
              >
                {toInitials(contact.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`truncate text-sm ${contact.unread ? "font-semibold text-ink" : "font-medium text-ink"}`}>
                    {contact.name}
                  </span>
                  <span className="shrink-0 text-[10px] text-ink-muted">{formatRelative(contact.lastTime)}</span>
                </div>
                <p className={`mt-0.5 truncate text-xs ${contact.unread ? "text-ink-soft" : "text-ink-muted"}`}>
                  {contact.lastMessage}
                </p>
              </div>

              {contact.unread > 0 && (
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sage text-[10px] font-bold text-white">
                  {contact.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT CHAT AREA ──────────────────────────────────── */}
      <div className={`${showChat ? "flex" : "hidden"} md:flex min-w-0 flex-1 flex-col overflow-hidden bg-cream`}>

        {!selectedContact ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-ink-muted">Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* top bar */}
            <div className="flex items-center gap-3 border-b border-cream-dark bg-white px-4 py-4 md:px-6">
              <button
                onClick={() => setShowChat(false)}
                className="mr-1 flex shrink-0 items-center justify-center rounded-full p-1.5 text-ink-muted transition-colors hover:bg-cream-dark md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: toAvatarColor(selectedContact) }}
              >
                {toInitials(selectedContact)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{selectedContact}</p>
                {activeContact && (
                  <p className="text-xs text-ink-muted">
                    Last message {formatRelative(activeContact.lastTime)}
                  </p>
                )}
              </div>
              <Link
                href={`/users/${encodeURIComponent(selectedContact)}`}
                className="rounded-xl border border-cream-dark px-4 py-2 text-xs font-medium text-ink-soft transition-colors hover:border-ink-muted hover:text-ink"
              >
                View profile
              </Link>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
              {thread.length === 0 ? (
                <p className="text-center text-sm text-ink-muted">No messages yet. Say hello!</p>
              ) : (
                <div className="space-y-1">
                  {thread.map((msg, i) => {
                    const isSent = msg.sender === user?.name;
                    const prevIsSent = i > 0 ? thread[i - 1].sender === user?.name : null;
                    const showTime = i === 0 || isSent !== prevIsSent;

                    return (
                      <div key={msg.id}>
                        {showTime && (
                          <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1 ${i > 0 ? "mt-4" : ""}`}>
                            <span className="text-[12px] text-[#8a887e]">{formatClock(msg.timestamp)}</span>
                          </div>
                        )}
                        <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1`}>
                          <div
                            className="max-w-[68%] px-4 py-2.5 text-sm leading-relaxed text-ink"
                            style={{
                              backgroundColor: isSent ? "#d4e8d8" : "#ffffff",
                              borderRadius: 18,
                              boxShadow: isSent ? "none" : "0 1px 2px rgba(0,0,0,0.06)",
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* input bar */}
            <div className="flex items-center gap-3 border-t border-cream-dark bg-white px-6 py-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 rounded-2xl bg-[#f5f1e6] px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-colors hover:bg-ink-soft disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
