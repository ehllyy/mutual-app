"use client";

import { useState } from "react";
import { MapPin, Pencil, X, Plus } from "lucide-react";

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

/* ─── pill component ─────────────────────────────────────────────── */

function Pill({
  skill,
  onRemove,
}: {
  skill: string;
  onRemove?: () => void;
}) {
  const s = pillStyle(skill);
  return (
    <span
      className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {skill}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

/* ─── section header ─────────────────────────────────────────────── */

function SectionHeader({
  title,
  editing,
  onEdit,
  onSave,
  onCancel,
}: {
  title: string;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {title}
      </p>
      {editing ? (
        <div className="flex gap-3 text-xs font-medium">
          <button
            onClick={onSave}
            className="text-sage hover:text-sage/80 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="text-ink-muted hover:text-ink-soft transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={onEdit}
          className="text-xs font-medium text-ink-muted hover:text-ink-soft transition-colors"
        >
          Edit
        </button>
      )}
    </div>
  );
}

/* ─── static data ────────────────────────────────────────────────── */

const DEFAULT_BIO =
  "I'm a UI/UX designer based in East Legon, Accra. I've been working in product design for 3 years — mostly on mobile apps and SaaS dashboards. Outside of work I play acoustic guitar and I'm learning West African cooking. I love meeting neighbours through Mutual because every swap teaches me something new. Happy to do sessions online or in person locally.";

const DEFAULT_OFFER = ["Design", "React", "B2 German"];
const DEFAULT_NEED = ["Furniture repair", "French lessons", "Cooking lessons"];

/* ─── page ───────────────────────────────────────────────────────── */

export default function ProfilePage() {
  /* about */
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(bio);

  /* skills offer */
  const [offer, setOffer] = useState(DEFAULT_OFFER);
  const [editingOffer, setEditingOffer] = useState(false);
  const [offerDraft, setOfferDraft] = useState([...DEFAULT_OFFER]);
  const [offerInput, setOfferInput] = useState("");

  /* skills need */
  const [need, setNeed] = useState(DEFAULT_NEED);
  const [editingNeed, setEditingNeed] = useState(false);
  const [needDraft, setNeedDraft] = useState([...DEFAULT_NEED]);
  const [needInput, setNeedInput] = useState("");

  /* ─ about handlers ─ */
  function startBioEdit() {
    setBioDraft(bio);
    setEditingBio(true);
  }
  function saveBio() {
    setBio(bioDraft.trim() || bio);
    setEditingBio(false);
  }
  function cancelBio() {
    setEditingBio(false);
  }

  /* ─ offer handlers ─ */
  function startOfferEdit() {
    setOfferDraft([...offer]);
    setOfferInput("");
    setEditingOffer(true);
  }
  function saveOffer() {
    setOffer([...offerDraft]);
    setEditingOffer(false);
  }
  function cancelOffer() {
    setEditingOffer(false);
    setOfferInput("");
  }
  function addOffer() {
    const t = offerInput.trim();
    if (t && !offerDraft.includes(t)) {
      setOfferDraft((prev) => [...prev, t]);
    }
    setOfferInput("");
  }

  /* ─ need handlers ─ */
  function startNeedEdit() {
    setNeedDraft([...need]);
    setNeedInput("");
    setEditingNeed(true);
  }
  function saveNeed() {
    setNeed([...needDraft]);
    setEditingNeed(false);
  }
  function cancelNeed() {
    setEditingNeed(false);
    setNeedInput("");
  }
  function addNeed() {
    const t = needInput.trim();
    if (t && !needDraft.includes(t)) {
      setNeedDraft((prev) => [...prev, t]);
    }
    setNeedInput("");
  }

  const addInputCls =
    "flex-1 rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage/30";

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="mx-auto max-w-[760px] space-y-4 px-4 sm:px-6">

        {/* ── PROFILE HEADER CARD ───────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-sm">
          {/* banner */}
          <div className="h-32 bg-gradient-to-br from-sage to-sage-mid" />

          {/* content */}
          <div className="px-6 pb-6">
            {/* avatar */}
            <div className="-mt-9 mb-1">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 border-white bg-[#4A78C4] text-lg font-semibold text-white shadow-sm">
                EA
              </div>
            </div>

            {/* name row */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-ink">
                  Emmanuel Amoah
                </h1>
                <div className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  East Legon, Accra
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── ABOUT CARD ────────────────────────────────────── */}
        <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
          <SectionHeader
            title="About"
            editing={editingBio}
            onEdit={startBioEdit}
            onSave={saveBio}
            onCancel={cancelBio}
          />
          {editingBio ? (
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              rows={5}
              autoFocus
              className="w-full resize-none rounded-xl border border-cream-dark bg-cream px-4 py-3 text-sm leading-relaxed text-ink focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          ) : (
            <p className="text-sm leading-relaxed text-ink-soft">{bio}</p>
          )}
        </div>

        {/* ── SKILLS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Skills I Need */}
          <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
            <SectionHeader
              title="Skills I Need"
              editing={editingNeed}
              onEdit={startNeedEdit}
              onSave={saveNeed}
              onCancel={cancelNeed}
            />
            <div className="flex flex-wrap gap-2">
              {(editingNeed ? needDraft : need).map((skill, i) => (
                <Pill
                  key={skill + i}
                  skill={skill}
                  onRemove={
                    editingNeed
                      ? () => setNeedDraft((prev) => prev.filter((_, idx) => idx !== i))
                      : undefined
                  }
                />
              ))}
            </div>
            {editingNeed && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={needInput}
                  onChange={(e) => setNeedInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNeed()}
                  placeholder="Add a skill..."
                  className={addInputCls}
                />
                <button
                  onClick={addNeed}
                  className="flex items-center gap-1 rounded-xl border border-cream-dark px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink-muted hover:text-ink"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Skills I Offer */}
          <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
            <SectionHeader
              title="Skills I Offer"
              editing={editingOffer}
              onEdit={startOfferEdit}
              onSave={saveOffer}
              onCancel={cancelOffer}
            />
            <div className="flex flex-wrap gap-2">
              {(editingOffer ? offerDraft : offer).map((skill, i) => (
                <Pill
                  key={skill + i}
                  skill={skill}
                  onRemove={
                    editingOffer
                      ? () => setOfferDraft((prev) => prev.filter((_, idx) => idx !== i))
                      : undefined
                  }
                />
              ))}
            </div>
            {editingOffer && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={offerInput}
                  onChange={(e) => setOfferInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addOffer()}
                  placeholder="Add a skill..."
                  className={addInputCls}
                />
                <button
                  onClick={addOffer}
                  className="flex items-center gap-1 rounded-xl border border-cream-dark px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink-muted hover:text-ink"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
