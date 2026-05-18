"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight, X, Send } from "lucide-react";

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

const LISTINGS: SkillListing[] = [
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

const MY_SKILLS = ["UI/UX Design (Figma)", "Wireframing", "User Research"];

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Skills");
  const [proposalTarget, setProposalTarget] = useState<SkillListing | null>(null);
  const [proposalSkill, setProposalSkill] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalSent, setProposalSent] = useState(false);

  const filtered = LISTINGS.filter((s) => {
    const matchCat =
      activeCategory === "All Skills" || s.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.offers.toLowerCase().includes(q) ||
      s.needs.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  function openModal(listing: SkillListing) {
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
        <h1 className="font-display text-5xl font-bold leading-[1.1] text-ink sm:text-6xl">
          Trade what you know
          <br />
          <span className="italic text-sage">for what you need.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
          A no-money skill exchange between neighbours. Any skill counts —
          browse what&apos;s available and propose a swap.
        </p>

        {/* Search bar */}
        <div className="mt-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skills, e.g. hairdressing or piano lessons...."
              className="w-full rounded-full border border-cream-dark bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          </div>
          <button className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft">
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
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-ink-muted">
            No skills match your search. Try a different term or category.
          </p>
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
                  className="flex flex-col rounded-2xl border border-cream-dark bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* User header */}
                  <div className="flex items-center gap-3">
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

                  {/* Offers / Needs */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 rounded-full border border-sage px-2 py-0.5 text-[10px] font-bold tracking-wide text-sage">
                        OFFERS
                      </span>
                      <span className="text-sm leading-snug text-ink-soft">
                        {listing.offers}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 rounded-full border border-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-600">
                        NEEDS
                      </span>
                      <span className="text-sm leading-snug text-ink-soft">
                        {listing.needs}
                      </span>
                    </div>
                  </div>

                  {/* Category tag */}
                  <div className="mt-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: catStyle.bg,
                        color: catStyle.color,
                      }}
                    >
                      {listing.category}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-ink-muted">
                    {listing.availability}
                  </p>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-4 pt-1">
                    <button
                      onClick={() => openModal(listing)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
                    >
                      Propose a swap
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      href={`/users/${listing.id}`}
                      className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                    >
                      View profile
                    </Link>
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
            className="w-full max-w-md rounded-2xl bg-cream p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {proposalSent ? (
              /* Success state */
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage-light">
                  <Send className="h-5 w-5 text-sage" />
                </div>
                <h3 className="text-lg font-bold text-ink">Proposal sent!</h3>
                <p className="mt-1.5 text-sm text-ink-muted">
                  {proposalTarget.name} will be notified of your swap proposal.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 w-full rounded-xl bg-ink py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
                >
                  Back to Browse
                </button>
              </div>
            ) : (
              /* Form state */
              <>
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-ink">
                      Propose a swap
                    </h3>
                    <p className="mt-0.5 text-sm text-ink-muted">
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

                {/* What they offer, so you know context */}
                <div className="mb-5 rounded-xl border border-cream-dark bg-white p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    They offer
                  </p>
                  <p className="mt-1 text-ink-soft">{proposalTarget.offers}</p>
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
                      placeholder={`Hi ${proposalTarget.name.split(" ")[0]}, I'd love to swap skills with you...`}
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
