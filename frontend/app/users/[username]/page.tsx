"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, ArrowLeftRight, X, Send, ChevronLeft } from "lucide-react";
import { isLoggedIn } from "@/lib/auth";
import AuthPromptModal from "@/components/AuthPromptModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const PILL_COLORS = [
  { bg: "#FFE8D9", text: "#B85C3A" },
  { bg: "#EAF0EB", text: "#3D6B4F" },
  { bg: "#DBEAFE", text: "#1E4FAF" },
  { bg: "#FEF3C7", text: "#8B5E00" },
  { bg: "#F5E6F0", text: "#9B3E7A" },
  { bg: "#F0EAF5", text: "#7A47A8" },
];

const AVATAR_COLORS = [
  "#3D6B4F", "#9B3E7A", "#7A47A8", "#C4763A",
  "#8B7040", "#2D7D6F", "#6B5E3F", "#B05E9A", "#C48A2A",
];

function pillStyle(skill: string) {
  const hash = [...skill].reduce((a, c) => a + c.charCodeAt(0), 0);
  return PILL_COLORS[hash % PILL_COLORS.length];
}

function toAvatarColor(name: string) {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function toInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

interface ApiSkill {
  id: number;
  title: string;
  needsInReturn: string;
  category: string;
  location: string;
  username: string;
}

export default function UserProfilePage() {
  const { username } = useParams() as { username: string };
  const decodedUsername = decodeURIComponent(username);
  const router = useRouter();

  const [skills, setSkills] = useState<ApiSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [proposalSkill, setProposalSkill] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalSent, setProposalSent] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    fetch(`${BASE_URL}/skills`)
      .then((res) => res.json())
      .then((data: ApiSkill[]) => {
        setSkills(Array.isArray(data) ? data.filter((s) => s.username === decodedUsername) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [decodedUsername]);

  const location = skills[0]?.location ?? "";
  const skillsOffer = skills.map((s) => s.title).filter(Boolean);
  const skillsNeed = skills.map((s) => s.needsInReturn).filter(Boolean);

  function openModal() {
    if (!loggedIn) { setAuthPrompt(true); return; }
    setModalOpen(true);
    setProposalSent(false);
    setProposalSkill("");
    setProposalMessage("");
  }

  function closeModal() { setModalOpen(false); }

  function handleSend() {
    if (!proposalSkill || !proposalMessage.trim()) return;
    setProposalSent(true);
  }

  return (
    <div className="min-h-screen bg-cream py-8">

      {/* back button — mobile only */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 md:hidden"
        style={{ padding: "4px 16px", fontSize: 14, color: "#4A4840", background: "none", border: "none" }}
      >
        <ChevronLeft className="h-4 w-4" />
        Browse Skills
      </button>

      <div className="mx-auto max-w-[760px] space-y-4 px-4 sm:px-6">

        {/* ── PROFILE HEADER ─────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-br from-sage to-sage-mid" />
          <div className="px-6 pb-6">
            <div className="-mt-9 mb-1">
              <div
                className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 border-white text-lg font-semibold text-white shadow-sm"
                style={{ backgroundColor: toAvatarColor(decodedUsername) }}
              >
                {toInitials(decodedUsername)}
              </div>
            </div>
            <div className="mt-3">
              <h1 className="font-display text-2xl font-bold text-ink">{decodedUsername}</h1>
              {location && (
                <div className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {location}
                </div>
              )}
            </div>
            <div className="mt-5">
              <button
                onClick={openModal}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Propose a swap
              </button>
            </div>
          </div>
        </div>

        {/* ── ABOUT ──────────────────────────────────────────── */}
        <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">About</p>
          <p className="text-sm leading-relaxed text-ink-soft">No about yet.</p>
        </div>

        {/* ── SKILLS GRID ────────────────────────────────────── */}
        {!loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Skills I Offer
              </p>
              <div className="flex flex-wrap gap-2">
                {skillsOffer.length > 0 ? skillsOffer.map((skill) => {
                  const s = pillStyle(skill);
                  return (
                    <span key={skill} className="rounded-full px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: s.bg, color: s.text }}>
                      {skill}
                    </span>
                  );
                }) : (
                  <p className="text-sm text-ink-muted">None listed yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Skills I Need
              </p>
              <div className="flex flex-wrap gap-2">
                {skillsNeed.length > 0 ? skillsNeed.map((skill) => {
                  const s = pillStyle(skill);
                  return (
                    <span key={skill} className="rounded-full px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: s.bg, color: s.text }}>
                      {skill}
                    </span>
                  );
                }) : (
                  <p className="text-sm text-ink-muted">None listed yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {authPrompt && (
        <AuthPromptModal
          title="Join Mutual to propose a swap"
          onClose={() => setAuthPrompt(false)}
        />
      )}

      {/* ── PROPOSE A SWAP MODAL ───────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-cream p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {proposalSent ? (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage-light">
                  <Send className="h-5 w-5 text-sage" />
                </div>
                <h3 className="text-lg font-bold text-ink">Proposal sent!</h3>
                <p className="mt-1.5 text-sm text-ink-muted">
                  {decodedUsername} will be notified of your swap proposal.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 w-full rounded-xl bg-ink py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-ink">Propose a swap</h3>
                    <p className="mt-0.5 text-sm text-ink-muted">with {decodedUsername}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-cream-dark"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-5 rounded-xl border border-cream-dark bg-white p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    They offer
                  </p>
                  <p className="mt-1 text-ink-soft">
                    {skillsOffer.join(", ") || "—"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">
                      Your skill to offer in return
                    </label>
                    <input
                      type="text"
                      value={proposalSkill}
                      onChange={(e) => setProposalSkill(e.target.value)}
                      placeholder="e.g. Guitar lessons, Web design..."
                      className="w-full rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Message</label>
                    <textarea
                      value={proposalMessage}
                      onChange={(e) => setProposalMessage(e.target.value)}
                      rows={4}
                      placeholder={`Hi ${decodedUsername.split(" ")[0]}, I'd love to swap skills with you...`}
                      className="w-full resize-none rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage/30"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!proposalSkill || !proposalMessage.trim()}
                    className="w-full rounded-xl bg-ink py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send proposal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
