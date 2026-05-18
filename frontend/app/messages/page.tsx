"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Send } from "lucide-react";

/* ─── types ──────────────────────────────────────────────────────── */

type Message = {
  id: number;
  text: string;
  sent: boolean;
  time: string;
};

type Thread = {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
  online: boolean;
  lastSeen?: string;
  preview: string;
  time: string;
  unread: number;
  messages: Message[];
};

/* ─── mock data ──────────────────────────────────────────────────── */

const THREADS: Thread[] = [
  {
    id: 1,
    name: "James Arthur",
    initials: "JA",
    avatarColor: "#4A78C4",
    online: true,
    preview: "Sounds great! When are you free this week?",
    time: "2m ago",
    unread: 0,
    messages: [
      { id: 1, text: "Hey! I saw your design listing on Mutual. I'm a graphic designer too and I need help with UI/UX for an app.", sent: false, time: "10:02 AM" },
      { id: 2, text: "Hi James! That sounds like a great match. What kind of app is it?", sent: true, time: "10:05 AM" },
      { id: 3, text: "It's a fitness tracking app — I've got the branding sorted but the user flows are a mess. Could really use a second eye.", sent: false, time: "10:07 AM" },
      { id: 4, text: "I'd love to help! What would you offer in return?", sent: true, time: "10:09 AM" },
      { id: 5, text: "Sounds great! When are you free this week?", sent: false, time: "10:11 AM" },
    ],
  },
  {
    id: 2,
    name: "Melisa Saah",
    initials: "MS",
    avatarColor: "#7A47A8",
    online: false,
    lastSeen: "Last seen 1h ago",
    preview: "I can do Tuesday evenings, does that work?",
    time: "1h ago",
    unread: 2,
    messages: [
      { id: 1, text: "Hello! I noticed you're looking for French lessons. I'm a native French speaker and I teach conversational French.", sent: false, time: "9:15 AM" },
      { id: 2, text: "That's perfect! I've been trying to improve my French for a while. What do you need in return?", sent: true, time: "9:20 AM" },
      { id: 3, text: "I saw you offer React development — I'm building a portfolio site and could really use the help!", sent: false, time: "9:22 AM" },
      { id: 4, text: "I can do Tuesday evenings, does that work?", sent: false, time: "9:23 AM" },
    ],
  },
  {
    id: 3,
    name: "Guy Hawkins",
    initials: "GH",
    avatarColor: "#C4963A",
    online: true,
    preview: "Hey Eleanor! Saw your Figma listing — I think we'd be a great match.",
    time: "3h ago",
    unread: 0,
    messages: [
      { id: 1, text: "Hey Eleanor! Saw your Figma listing — I think we'd be a great match. I tutor SAT/GRE math and I've been wanting to learn UI design.", sent: false, time: "8:00 AM" },
      { id: 2, text: "Hey Guy! That sounds like it could work really well. I've been wanting to brush up on my math.", sent: true, time: "8:15 AM" },
      { id: 3, text: "Great! I usually do sessions over video call or in person near Cantonments. Either works for me.", sent: false, time: "8:18 AM" },
      { id: 4, text: "Video call works perfectly for me. Want to set up an intro call first?", sent: true, time: "8:25 AM" },
      { id: 5, text: "Definitely! I'm free most evenings after 6pm. How about Thursday?", sent: false, time: "8:30 AM" },
    ],
  },
  {
    id: 4,
    name: "Kathryn Murphy",
    initials: "KM",
    avatarColor: "#2D7D6F",
    online: false,
    lastSeen: "Last seen yesterday",
    preview: "Thanks for the session yesterday, it was really helpful!",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, text: "Hi Eleanor! I wanted to reach out about the cooking lessons you're looking for.", sent: false, time: "Yesterday 4:00 PM" },
      { id: 2, text: "Hi Kathryn! Yes, I've been wanting to learn more West African recipes especially.", sent: true, time: "Yesterday 4:10 PM" },
      { id: 3, text: "Oh perfect — that's my specialty! Jollof, fufu, light soup. I've been cooking these for 20 years.", sent: false, time: "Yesterday 4:12 PM" },
      { id: 4, text: "That sounds amazing! I'd love to swap with design work if that's useful to you.", sent: true, time: "Yesterday 4:15 PM" },
      { id: 5, text: "Thanks for the session yesterday, it was really helpful!", sent: false, time: "Yesterday 5:30 PM" },
    ],
  },
  {
    id: 5,
    name: "Leslie Alexander",
    initials: "LA",
    avatarColor: "#C4763A",
    online: false,
    lastSeen: "Last seen 3 days ago",
    preview: "Let me know if that works for you.",
    time: "3 days ago",
    unread: 0,
    messages: [
      { id: 1, text: "Hey! I do furniture repair and woodworking. Saw you're looking for that.", sent: false, time: "Mon 11:00 AM" },
      { id: 2, text: "Yes! I have a bookshelf that needs fixing. Is that something you'd be able to help with?", sent: true, time: "Mon 11:20 AM" },
      { id: 3, text: "Absolutely. I'd need to see some photos first to estimate the work. Can you send them over?", sent: false, time: "Mon 11:25 AM" },
      { id: 4, text: "Sure, I'll take some today and send them across.", sent: true, time: "Mon 11:30 AM" },
      { id: 5, text: "Let me know if that works for you.", sent: false, time: "Mon 12:00 PM" },
    ],
  },
];

/* ─── page ───────────────────────────────────────────────────────── */

export default function MessagesPage() {
  const [threads, setThreads] = useState(THREADS);
  const [selectedId, setSelectedId] = useState(THREADS[2].id);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const selected = threads.find((t) => t.id === selectedId)!;

  const visible = threads.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.unread > 0;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedId, selected?.messages.length]);

  function selectThread(id: number) {
    setSelectedId(id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t))
    );
  }

  function sendMessage() {
    const text = newMessage.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? {
              ...t,
              preview: text,
              time: "Just now",
              messages: [...t.messages, { id: t.messages.length + 1, text, sent: true, time: now }],
            }
          : t
      )
    );
    setNewMessage("");
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-cream">

      {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
      <div className="flex w-72 shrink-0 flex-col border-r border-cream-dark bg-white">

        {/* heading */}
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-display text-xl font-bold text-ink">Messages</h1>
        </div>

        {/* search */}
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

        {/* filter tabs */}
        <div className="flex gap-1 px-4 pb-3">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-ink text-cream"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* thread list */}
        <div className="flex-1 overflow-y-auto">
          {visible.map((thread) => (
            <button
              key={thread.id}
              onClick={() => selectThread(thread.id)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-cream/60 ${
                thread.id === selectedId
                  ? "border-l-[3px] border-sage bg-sage-light/40"
                  : "border-l-[3px] border-transparent"
              }`}
            >
              {/* avatar */}
              <div className="relative shrink-0">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: thread.avatarColor }}
                >
                  {thread.initials}
                </div>
                {thread.online && (
                  <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
                )}
              </div>

              {/* content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`truncate text-sm ${thread.unread ? "font-semibold text-ink" : "font-medium text-ink"}`}>
                    {thread.name}
                  </span>
                  <span className="shrink-0 text-[10px] text-ink-muted">{thread.time}</span>
                </div>
                <p className={`mt-0.5 truncate text-xs ${thread.unread ? "text-ink-soft" : "text-ink-muted"}`}>
                  {thread.preview}
                </p>
              </div>

              {/* unread badge */}
              {thread.unread > 0 && (
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sage text-[10px] font-bold text-white">
                  {thread.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT CHAT AREA ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col bg-cream">

        {/* chat header */}
        <div className="flex items-center gap-3 border-b border-cream-dark bg-white px-6 py-4">
          <div className="relative shrink-0">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: selected.avatarColor }}
            >
              {selected.initials}
            </div>
            {selected.online && (
              <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">{selected.name}</p>
            <p className="text-xs text-ink-muted">
              {selected.online ? "Online" : selected.lastSeen}
            </p>
          </div>
          <Link
            href={`/users/${selected.id}`}
            className="rounded-xl border border-cream-dark px-4 py-2 text-xs font-medium text-ink-soft transition-colors hover:border-ink-muted hover:text-ink"
          >
            View profile
          </Link>
        </div>

        {/* messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-1">
            {selected.messages.map((msg, i) => {
              const prevSent = i > 0 ? selected.messages[i - 1].sent : null;
              const showTime = i === 0 || msg.sent !== prevSent;

              return (
                <div key={msg.id}>
                  {showTime && (
                    <div className={`flex ${msg.sent ? "justify-end" : "justify-start"} mb-1 ${i > 0 ? "mt-4" : ""}`}>
                      <span className="text-[10px] text-ink-muted">{msg.time}</span>
                    </div>
                  )}
                  <div className={`flex ${msg.sent ? "justify-end" : "justify-start"} mb-1`}>
                    <div
                      className={`max-w-[68%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.sent
                          ? "bg-sage-light text-ink"
                          : "bg-white text-ink shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* input bar */}
        <div className="flex items-center gap-3 border-t border-cream-dark bg-white px-6 py-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-colors hover:bg-ink-soft"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
