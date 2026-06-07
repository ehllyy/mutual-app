"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, X } from "lucide-react";
import { getUser } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/* ─── pill colours ──────────────────────────────────────────────── */

const PILL_COLORS = [
  { bg: "#FFE8D9", text: "#B85C3A" },
  { bg: "#EAF0EB", text: "#3D6B4F" },
  { bg: "#DBEAFE", text: "#1E4FAF" },
  { bg: "#FEF3C7", text: "#8B5E00" },
  { bg: "#F5E6F0", text: "#9B3E7A" },
  { bg: "#F0EAF5", text: "#7A47A8" },
];

function pillStyle(skill: string) {
  const hash = [...skill].reduce((a, c) => a + c.charCodeAt(0), 0);
  return PILL_COLORS[hash % PILL_COLORS.length];
}

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

/* ─── pill component ─────────────────────────────────────────────── */

function Pill({ skill, onRemove }: { skill: string; onRemove?: () => void }) {
  const s = pillStyle(skill);
  return (
    <span
      className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {skill}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 opacity-60 transition-opacity hover:opacity-100">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

/* ─── section header ─────────────────────────────────────────────── */

function SectionHeader({
  title, editing, onEdit, onSave, onCancel,
}: {
  title: string; editing: boolean; onEdit: () => void; onSave: () => void; onCancel: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{title}</p>
      {editing ? (
        <div className="flex gap-3 text-xs font-medium">
          <button onClick={onSave} className="text-sage transition-colors hover:text-sage/80">Save</button>
          <button onClick={onCancel} className="text-ink-muted transition-colors hover:text-ink-soft">Cancel</button>
        </div>
      ) : (
        <button onClick={onEdit} className="text-xs font-medium text-ink-muted transition-colors hover:text-ink-soft">
          Edit
        </button>
      )}
    </div>
  );
}

interface ApiSkill {
  id: number;
  title: string;
  needsInReturn: string;
  username: string;
  location: string;
  category: string;
}

/* ─── page ───────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");

  /* about */
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [bioSaved, setBioSaved] = useState(false);

  /* skills from API */
  const [offer, setOffer] = useState<string[]>([]);
  const [need, setNeed] = useState<string[]>([]);


  useEffect(() => {
    const user = getUser();
    const savedName = user?.name ?? "";
    const savedNeighbourhood =
      user?.neighbourhood ||
      (typeof window !== "undefined" ? localStorage.getItem("mutual_neighbourhood") ?? "" : "");

    setName(savedName);
    setNeighbourhood(savedNeighbourhood);

    if (user?.id) {
      fetch(`${BASE_URL}/users/${user.id}`)
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          const about = data?.about ?? "";
          setBio(about);
          setBioDraft(about);
        })
        .catch(() => {});
    }

    if (savedName) {
      fetch(`${BASE_URL}/skills`)
        .then((res) => res.json())
        .then((data: ApiSkill[]) => {
          const mine = Array.isArray(data) ? data.filter((s) => s.username === savedName) : [];
          const titles = mine.map((s) => s.title).filter(Boolean);
          const needs = mine.map((s) => s.needsInReturn).filter(Boolean);
          setOffer(titles);
          setNeed(needs);
        })
        .catch(() => {});
    }
  }, []);

  /* ─ about handlers ─ */
  function startBioEdit() { setBioDraft(bio); setEditingBio(true); }
  async function saveBio() {
    const updated = bioDraft.trim() || bio;
    setBio(updated);
    setEditingBio(false);
    const user = getUser();
    if (!user?.id) return;
    try {
      const res = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about: updated }),
      });
      if (res.ok) {
        setBioSaved(true);
        setTimeout(() => setBioSaved(false), 2000);
      }
    } catch { /* silent — bio already updated in UI */ }
  }
  function cancelBio() { setEditingBio(false); }


  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="mx-auto max-w-[760px] space-y-4 px-4 sm:px-6">

        {/* ── PROFILE HEADER ─────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-br from-sage to-sage-mid" />
          <div className="px-6 pb-6">
            <div className="-mt-9 mb-1">
              <div
                className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 border-white text-lg font-semibold text-white shadow-sm"
                style={{ backgroundColor: name ? toAvatarColor(name) : "#3D6B4F" }}
              >
                {name ? toInitials(name) : "?"}
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-ink">
                  {name || "Your Name"}
                </h1>
                {neighbourhood && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {neighbourhood}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── ABOUT ──────────────────────────────────────────── */}
        <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
          <SectionHeader
            title="About"
            editing={editingBio}
            onEdit={startBioEdit}
            onSave={saveBio}
            onCancel={cancelBio}
          />
          {bioSaved && (
            <p className="mb-2 text-xs font-medium text-sage">Saved ✓</p>
          )}
          {editingBio ? (
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              rows={5}
              autoFocus
              className="w-full resize-none rounded-xl border border-cream-dark bg-cream px-4 py-3 text-sm leading-relaxed text-ink focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          ) : (
            <p className="text-sm leading-relaxed text-ink-soft">
              {bio || "No about yet. Click Edit to add a bio."}
            </p>
          )}
        </div>

        {/* ── SKILLS GRID ────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Skills I Need */}
          <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Skills I Need</p>
              <button
                onClick={() => router.push("/post-skill")}
                className="text-xs font-medium text-ink-muted transition-colors hover:text-ink-soft"
              >
                Add skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {need.map((skill, i) => (
                <Pill key={skill + i} skill={skill} />
              ))}
              {need.length === 0 && (
                <p className="text-sm text-ink-muted">None listed yet.</p>
              )}
            </div>
          </div>

          {/* Skills I Offer */}
          <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Skills I Offer</p>
              <button
                onClick={() => router.push("/post-skill")}
                className="text-xs font-medium text-ink-muted transition-colors hover:text-ink-soft"
              >
                Add skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {offer.map((skill, i) => (
                <Pill key={skill + i} skill={skill} />
              ))}
              {offer.length === 0 && (
                <p className="text-sm text-ink-muted">None listed yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
