"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight, X, Send } from "lucide-react";
import { isLoggedIn } from "@/lib/auth";
import AuthPromptModal from "@/components/AuthPromptModal";

const CATEGORIES = [
  "All Skills",
  "Beauty & Care",
  "Home & Trade",
  "Food & Cooking",
  "Fitness & Sport",
  "Education",
  "Creative & Arts",
  "Tech",
  "Music & Dance",
];

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  "Beauty & Care":  { bg: "#F5E6F0", color: "#9B3E7A" },
  "Home & Trade":   { bg: "#FEF3C7", color: "#92400E" },
  "Food & Cooking": { bg: "#FEE2CC", color: "#9A3412" },
  "Fitness & Sport":{ bg: "#EAF0EB", color: "#3D6B4F" },
  "Education":      { bg: "#DBEAFE", color: "#1E40AF" },
  "Creative & Arts":{ bg: "#EDE9FE", color: "#5B21B6" },
  "Tech":           { bg: "#DBEAFE", color: "#1E40AF" },
  "Music & Dance":  { bg: "#F0EAF5", color: "#7A47A8" },
};

interface SkillListing {
  id: number;
  name: string;
  initials: string;
  location: string;
  offers: string;
  needs: string;
  category: string;
  avatarColor: string;
  availability: string;
}

interface ApiSkill {
  id: number;
  title: string;
  needsInReturn: string;
  category: string;
  location: string;
  username: string;
  description?: string;
}

const AVATAR_COLORS = [
  "#3D6B4F", "#9B3E7A", "#7A47A8", "#C4763A",
  "#8B7040", "#2D7D6F", "#6B5E3F", "#B05E9A", "#C48A2A",
];

function toInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function toAvatarColor(name: string) {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function mapApiSkill(s: ApiSkill): SkillListing {
  return {
    id: s.id,
    name: s.username ?? "Unknown",
    initials: toInitials(s.username ?? "?"),
    location: s.location ?? "",
    offers: s.title,
    needs: s.needsInReturn ?? "",
    category: s.category ?? "Other",
    avatarColor: toAvatarColor(s.username ?? ""),
    availability: "",
  };
}

const FALLBACK_LISTINGS: SkillListing[] = [
  {
    id: 1,
    name: "Emmanuel Amoah",
    initials: "EA",
    location: "East Legon, Accra",
    offers: "UI/UX Design (Figma & prototyping)",
    needs: "West African cooking lessons",
    category: "Creative & Arts",
    avatarColor: "#3D6B4F",
    availability: "Weekday evenings",
  },
  {
    id: 2,
    name: "Abena Mensah",
    initials: "AM",
    location: "Labone, Accra",
    offers: "Hair braiding & natural hair styling",
    needs: "Python programming basics",
    category: "Beauty & Care",
    avatarColor: "#9B3E7A",
    availability: "Weekends",
  },
  {
    id: 3,
    name: "Kofi Asante",
    initials: "KA",
    location: "Santasi, Kumasi",
    offers: "Guitar & Afrobeats music lessons",
    needs: "Interior design consultation",
    category: "Music & Dance",
    avatarColor: "#7A47A8",
    availability: "Saturday mornings",
  },
  {
    id: 4,
    name: "Naana Okai",
    initials: "NO",
    location: "Tema, Greater Accra",
    offers: "Jollof rice & traditional Ghanaian cooking",
    needs: "Yoga & mindfulness coaching",
    category: "Food & Cooking",
    avatarColor: "#C4763A",
    availability: "Weekends",
  },
  {
    id: 5,
    name: "Kweku Eshun",
    initials: "KE",
    location: "Suame, Kumasi",
    offers: "Plumbing & basic electrical repairs",
    needs: "WASSCE Mathematics tutoring",
    category: "Home & Trade",
    avatarColor: "#8B7040",
    availability: "Weekday mornings",
  },
  {
    id: 6,
    name: "Zainab Alidu",
    initials: "ZA",
    location: "Tamale, Northern Region",
    offers: "French language lessons (beginners)",
    needs: "React & web development lessons",
    category: "Education",
    avatarColor: "#2D7D6F",
    availability: "Evenings",
  },
  {
    id: 7,
    name: "Naa Ofori",
    initials: "NO",
    location: "Cantonments, Accra",
    offers: "Photography & Lightroom editing",
    needs: "Personal training & fitness coaching",
    category: "Creative & Arts",
    avatarColor: "#6B5E3F",
    availability: "Flexible",
  },
  {
    id: 8,
    name: "Ama Owusu",
    initials: "AO",
    location: "Adum, Kumasi",
    offers: "Personal training & HIIT workouts",
    needs: "Graphic design for small business",
    category: "Fitness & Sport",
    avatarColor: "#B05E9A",
    availability: "Early mornings",
  },
  {
    id: 9,
    name: "Sena Attipoe",
    initials: "SA",
    location: "Ho, Volta Region",
    offers: "React & Next.js development",
    needs: "Ewe & Twi language lessons",
    category: "Tech",
    avatarColor: "#C48A2A",
    availability: "Weekends",
  },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const MY_SKILLS = ["UI/UX Design (Figma)", "Wireframing", "User Research"];

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Skills");
  const [proposalTarget, setProposalTarget] = useState<SkillListing | null>(null);
  const [proposalSkill, setProposalSkill] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalSent, setProposalSent] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(false);
  const [listings, setListings] = useState<SkillListing[]>(FALLBACK_LISTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/skills`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: ApiSkill[]) => {
        console.log("API response:", data);
        if (Array.isArray(data) && data.length > 0) {
          setListings(data.map(mapApiSkill));
        }
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = listings.filter((s) => {
    const matchCat =
      activeCategory === "All Skills" || s.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.offers.toLowerCase().includes(q) ||
      s.needs.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  function openModal(listing: SkillListing) {
    if (!isLoggedIn()) {
      setAuthPrompt(true);
      return;
    }
    setProposalTarget(listing);
    setProposalSent(false);
    setProposalSkill("");
    setProposalMessage("");
  }

  function closeModal() {
    setProposalTarget(null);
  }

  function handleSend() {
    if (!proposalSkill || !proposalMessage.trim()) return;
    setProposalSent(true);
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold leading-[1.1] text-ink md:text-5xl">
          Trade what you know
          <br />
          <span className="italic text-sage">for what you need.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
          A no-money skill exchange between neighbours. Any skill counts —
          browse what&apos;s available and propose a swap.
        </p>

        {/* Search bar */}
        <div className="mt-8 flex items-stretch gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill or location..."
              className="h-12 w-full rounded-[12px] border border-cream-dark bg-white pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          </div>
          <button className="h-12 shrink-0 rounded-[12px] bg-ink px-6 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft">
            Search
          </button>
        </div>

        {/* Category chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "border-ink bg-ink text-cream"
                  : "border-cream-dark bg-white text-ink-soft hover:border-ink-muted hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-ink-muted">Loading skills…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream-dark">
              <Search className="h-6 w-6 text-ink-muted" />
            </div>
            <h3 className="text-base font-semibold text-ink">No skills found</h3>
            <p className="mt-1.5 text-sm text-ink-muted">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => {
              const catStyle = CATEGORY_STYLES[listing.category] ?? {
                bg: "#EAF0EB",
                color: "#3D6B4F",
              };
              return (
                <div
                  key={listing.id}
                  className="flex flex-col overflow-hidden rounded-[12px] shadow-sm transition-shadow hover:shadow-md"
                  style={{ border: "1.5px solid #EDE9DA" }}
                >
                  {/* TOP — white */}
                  <div className="flex items-center gap-3 bg-white px-4 pb-3 pt-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: listing.avatarColor }}
                    >
                      {listing.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {listing.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-ink-muted">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* MIDDLE — cream wraps both rows */}
                  <div style={{ backgroundColor: "#F5F1E6" }}>
                    <div
                      className="flex h-[46px] items-center gap-2 bg-white px-4"
                      style={{ borderTop: "1px dashed #EAF0EB" }}
                    >
                      <span className="shrink-0 rounded-full border border-sage px-2 py-0.5 text-[10px] font-bold tracking-wide text-sage">
                        OFFERS
                      </span>
                      <span className="truncate text-sm text-ink-soft">
                        {listing.offers}
                      </span>
                    </div>
                    <div
                      className="flex h-[46px] items-center gap-2 bg-white px-4"
                      style={{ borderBottom: "1px dashed #EAF0EB" }}
                    >
                      <span className="shrink-0 rounded-full border border-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-600">
                        NEEDS
                      </span>
                      <span className="truncate text-sm text-ink-soft">
                        {listing.needs}
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM — white */}
                  <div className="bg-white px-4 pb-4 pt-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: catStyle.bg,
                        color: catStyle.color,
                      }}
                    >
                      {listing.category}
                    </span>

                    <div className="mt-3 flex items-stretch gap-2">
                      <button
                        onClick={() => openModal(listing)}
                        className="flex h-11 flex-1 items-center justify-center gap-1.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: "#1C1A14",
                          borderRadius: "8px",
                        }}
                      >
                        Propose a swap
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/users/${listing.id}`}
                        className="flex h-11 shrink-0 items-center justify-center px-4 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #EAF0EB",
                          borderRadius: "8px",
                        }}
                      >
                        View profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Propose a swap modal */}
      {proposalTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-[560px] bg-white p-6 shadow-2xl"
            style={{ borderRadius: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            {proposalSent ? (
              /* Success state */
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage-light">
                  <Send className="h-5 w-5 text-sage" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink">Proposal sent!</h3>
                <p className="mt-1.5 text-sm text-ink-muted">
                  {proposalTarget.name} will be notified of your swap proposal.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 w-full rounded-xl bg-ink py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
                >
                  Back to Browse
                </button>
              </div>
            ) : (
              /* Form state */
              <>
                {/* Header */}
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink">
                      Propose a Swap
                    </h3>
                    <p className="mt-0.5 text-sm" style={{ color: "#8A887E" }}>
                      with {proposalTarget.name}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-cream-dark"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Swap preview box */}
                <div className="mb-5 space-y-0 overflow-hidden" style={{ backgroundColor: "#F5F1E6", borderRadius: 10, padding: 14 }}>
                  {/* YOU GIVE row */}
                  <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px dashed #C8D5CA" }}>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide"
                      style={{ border: "1px solid #6B9E7C", backgroundColor: "#EAF0EB", color: "#3D6B4F" }}
                    >
                      YOU GIVE
                    </span>
                    <span className="text-sm italic" style={{ color: proposalSkill ? "#1C1A14" : "#8A887E" }}>
                      {proposalSkill || "Select your skill below"}
                    </span>
                  </div>
                  {/* THEY GIVE row */}
                  <div className="flex items-center gap-3 pt-3">
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide"
                      style={{ border: "1px solid #B07A1A", backgroundColor: "#FBF0DC", color: "#B07A1A" }}
                    >
                      THEY GIVE
                    </span>
                    <span className="text-sm text-ink-soft">{proposalTarget.offers}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Skill dropdown */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#8A887E" }}>
                      Your Skill
                    </label>
                    <div className="relative">
                      <select
                        value={proposalSkill}
                        onChange={(e) => setProposalSkill(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-cream-dark px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sage/30"
                        style={{ backgroundColor: "#F5F1E6" }}
                      >
                        <option value="">Choose what you are offering..</option>
                        {MY_SKILLS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">▾</span>
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#8A887E" }}>
                      Message
                    </label>
                    <textarea
                      value={proposalMessage}
                      onChange={(e) => setProposalMessage(e.target.value)}
                      rows={4}
                      placeholder={`Hi! I came across your listing and think we'd be a great match. I can offer [skill] exchange for [their skill]. I'm free on...`}
                      className="w-full resize-none rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage/30"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 rounded-xl border border-cream-dark bg-white py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink-muted hover:text-ink"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSend}
                      className="flex min-h-[48px] flex-[2] items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                      style={{ backgroundColor: "#1C1A14" }}
                    >
                      Send proposal
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {authPrompt && (
        <AuthPromptModal onClose={() => setAuthPrompt(false)} />
      )}
    </div>
  );
}
