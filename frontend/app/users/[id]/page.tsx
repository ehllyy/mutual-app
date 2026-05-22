"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowLeftRight, X, Send } from "lucide-react";
import { isLoggedIn } from "@/lib/auth";
import AuthPromptModal from "@/components/AuthPromptModal";

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

/* ─── types & data ───────────────────────────────────────────────── */

interface UserProfile {
  id: number;
  name: string;
  initials: string;
  location: string;
  avatarColor: string;
  bio: string;
  skillsOffer: string[];
  skillsNeed: string[];
}

const MY_SKILLS = ["Design", "React", "B2 German"];

const USERS: UserProfile[] = [
  {
    id: 1,
    name: "Emmanuel Amoah",
    initials: "EA",
    location: "East Legon, Accra",
    avatarColor: "#4A78C4",
    bio: "I'm a UI/UX designer with 4 years of experience — I've worked on fintech apps and a few consumer products. I'm great at user flows, interactive Figma prototypes, and design systems. Outside of design I'm slowly learning to fix things around my apartment and would love help from someone who actually knows what they're doing. Always up for a swap, online or in person locally.",
    skillsOffer: ["Design", "React", "B2 German"],
    skillsNeed: ["Furniture repair", "French lessons", "Cooking lessons"],
  },
  {
    id: 2,
    name: "Abena Mensah",
    initials: "AM",
    location: "Labone, Accra",
    avatarColor: "#9B3E7A",
    bio: "Natural hair specialist with 5+ years helping people embrace their curls and coils. Based in Labone but happy to travel across Accra. Looking to level up my coding skills — even just learning Python basics would open so many doors for managing my client bookings.",
    skillsOffer: ["Hair braiding", "Natural hair styling", "Locs maintenance"],
    skillsNeed: ["Python basics", "Website help"],
  },
  {
    id: 3,
    name: "Kofi Asante",
    initials: "KA",
    location: "Santasi, Kumasi",
    avatarColor: "#7A47A8",
    bio: "Guitarist and music teacher who plays Afrobeats, highlife, and a bit of jazz. Been teaching guitar since 2018. Looking to make my apartment feel more like home — need someone with a good eye for interior design.",
    skillsOffer: ["Guitar lessons", "Music theory", "Afrobeats rhythms"],
    skillsNeed: ["Interior design", "Home decor advice"],
  },
  {
    id: 4,
    name: "Naana Okai",
    initials: "NO",
    location: "Tema, Greater Accra",
    avatarColor: "#C4763A",
    bio: "Home cook turned community cook. I can teach you how to make proper Ghanaian jollof rice, banku, kontomire stew, and more. My sessions are hands-on and very relaxed. Looking for someone to teach me yoga — I have a bad back and need to start moving.",
    skillsOffer: ["Jollof rice & Ghanaian cooking", "Baking", "Meal prep"],
    skillsNeed: ["Yoga classes", "Meditation basics"],
  },
  {
    id: 5,
    name: "Kweku Eshun",
    initials: "KE",
    location: "Suame, Kumasi",
    avatarColor: "#8B7040",
    bio: "Journeyman plumber and electrician with 10 years in the trade. Can fix leaks, install fittings, and sort out basic wiring. You provide the parts, I provide the know-how. Looking for help with my son's WASSCE maths — he's struggling and I want to help him pass.",
    skillsOffer: ["Plumbing", "Electrical repairs", "Tiling"],
    skillsNeed: ["WASSCE Maths tutoring", "Physics tutoring"],
  },
  {
    id: 6,
    name: "Zainab Alidu",
    initials: "ZA",
    location: "Tamale, Northern Region",
    avatarColor: "#2D7D6F",
    bio: "Tamale-based French teacher who learned the language during two years in Senegal. I teach conversational French for beginners and intermediate speakers. Want to learn how to build websites — even a simple portfolio page would open new opportunities.",
    skillsOffer: ["French language", "Arabic basics"],
    skillsNeed: ["React development", "Web design basics"],
  },
  {
    id: 7,
    name: "Naa Ofori",
    initials: "NO",
    location: "Cantonments, Accra",
    avatarColor: "#6B5E3F",
    bio: "Freelance photographer based in Accra. I shoot weddings, portraits, and street photography. Also do Lightroom editing and can teach photo composition basics. Trying to get into fitness but don't know where to start — would love a structured beginner program.",
    skillsOffer: ["Photography", "Lightroom editing", "Photo composition"],
    skillsNeed: ["Personal training", "Nutrition basics"],
  },
  {
    id: 8,
    name: "Ama Owusu",
    initials: "AO",
    location: "Adum, Kumasi",
    avatarColor: "#B05E9A",
    bio: "Certified personal trainer and group fitness instructor. I specialise in HIIT, functional training, and helping beginners build gym confidence. I run a small tailoring business on the side and need help with branding and marketing materials.",
    skillsOffer: ["HIIT training", "Functional fitness", "Nutrition coaching"],
    skillsNeed: ["Graphic design", "Social media content"],
  },
  {
    id: 9,
    name: "Sena Attipoe",
    initials: "SA",
    location: "Ho, Volta Region",
    avatarColor: "#C48A2A",
    bio: "Full-stack developer working with React and Next.js. Remote-first, based in Ho but happy to do sessions online. Looking to reconnect with my roots — want to properly learn Ewe and improve my Twi, which is very rusty.",
    skillsOffer: ["React development", "Next.js", "REST APIs"],
    skillsNeed: ["Ewe language lessons", "Twi language lessons"],
  },
];

/* ─── page ───────────────────────────────────────────────────────── */

export default function UserProfilePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const user = USERS.find((u) => u.id === Number(id)) ?? USERS[0];

  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { setLoggedIn(isLoggedIn()); }, []);

  const [authPrompt, setAuthPrompt] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [proposalSkill, setProposalSkill] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalSent, setProposalSent] = useState(false);

  function openModal() {
    if (!loggedIn) { setAuthPrompt(true); return; }
    setModalOpen(true);
    setProposalSent(false);
    setProposalSkill("");
    setProposalMessage("");
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleSend() {
    if (!proposalSkill || !proposalMessage.trim()) return;
    setProposalSent(true);
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="mx-auto max-w-[760px] space-y-4 px-4 sm:px-6">

        {/* back button — mobile only */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 py-3 md:hidden"
          style={{ fontSize: 14, color: "#4A4840" }}
        >
          ← Browse Skills
        </button>

        {/* ── PROFILE HEADER CARD ───────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-sm">
          {/* banner */}
          <div className="h-32 bg-gradient-to-br from-sage to-sage-mid" />

          {/* content */}
          <div className="px-6 pb-6">
            {/* avatar */}
            <div className="-mt-9 mb-1">
              <div
                className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 border-white text-lg font-semibold text-white shadow-sm"
                style={{ backgroundColor: user.avatarColor }}
              >
                {user.initials}
              </div>
            </div>

            {/* name / location */}
            <div className="mt-3">
              <h1 className="font-display text-2xl font-bold text-ink">
                {user.name}
              </h1>
              <div className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {user.location}
              </div>
            </div>

            {/* CTA button */}
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

        {/* ── ABOUT CARD ────────────────────────────────────── */}
        <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            About
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">{user.bio}</p>
        </div>

        {/* ── SKILLS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Skills I Offer */}
          <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Skills I Offer
            </p>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffer.map((skill) => {
                const s = pillStyle(skill);
                return (
                  <span
                    key={skill}
                    className="rounded-full px-3 py-1.5 text-sm font-medium"
                    style={{ backgroundColor: s.bg, color: s.text }}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Skills I Need */}
          <div className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Skills I Need
            </p>
            <div className="flex flex-wrap gap-2">
              {user.skillsNeed.map((skill) => {
                const s = pillStyle(skill);
                return (
                  <span
                    key={skill}
                    className="rounded-full px-3 py-1.5 text-sm font-medium"
                    style={{ backgroundColor: s.bg, color: s.text }}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {authPrompt && (
        <AuthPromptModal
          title="Join Mutual to propose a swap"
          onClose={() => setAuthPrompt(false)}
        />
      )}

      {/* ── PROPOSE A SWAP MODAL ──────────────────────────── */}
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
                  {user.name} will be notified of your swap proposal.
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
                    <h3 className="text-lg font-bold text-ink">
                      Propose a swap
                    </h3>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      with {user.name}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-cream-dark"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* their offer, for context */}
                <div className="mb-5 rounded-xl border border-cream-dark bg-white p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    They offer
                  </p>
                  <p className="mt-1 text-ink-soft">
                    {user.skillsOffer.join(", ")}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">
                      Your skill to offer in return
                    </label>
                    <select
                      value={proposalSkill}
                      onChange={(e) => setProposalSkill(e.target.value)}
                      className="w-full rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sage/30"
                    >
                      <option value="">Select one of your skills</option>
                      {MY_SKILLS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">
                      Message
                    </label>
                    <textarea
                      value={proposalMessage}
                      onChange={(e) => setProposalMessage(e.target.value)}
                      rows={4}
                      placeholder={`Hi ${user.name.split(" ")[0]}, I'd love to swap skills with you...`}
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
