"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, ArrowUpDown, Send, ChevronLeft } from "lucide-react";
import { getUser } from "@/lib/auth";

/* ─── data ───────────────────────────────────────────────────────── */

const CATEGORIES = [
  { name: "Beauty & Care",  icon: "✂️" },
  { name: "Home & Trade",   icon: "🔧" },
  { name: "Food & Cooking", icon: "🍳" },
  { name: "Fitness & Sport",icon: "🏃" },
  { name: "Education",      icon: "📚" },
  { name: "Creative & Arts",icon: "🎨" },
  { name: "Tech",           icon: "💻" },
  { name: "Music & Dance",  icon: "🎵" },
];

const TITLE_MAX = 80;
const DESC_MAX  = 200;

/* ─── page ───────────────────────────────────────────────────────── */

export default function PostSkillPage() {
  const router = useRouter();

  const [category,    setCategory]    = useState("");
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [returnSkill, setReturnSkill] = useState("");
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [success,     setSuccess]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [apiError,    setApiError]    = useState("");

  function clearError(key: string) {
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!category)           e.category    = "Please select a category";
    if (!title.trim())       e.title       = "Please describe your skill";
    if (!returnSkill.trim()) e.returnSkill = "Please enter what you want in return";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePost() {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const user = getUser();
      const username = user?.name || "";
      const token = typeof window !== "undefined"
        ? (localStorage.getItem("mutual_token") ?? localStorage.getItem("token"))
        : null;
      const location = typeof window !== "undefined"
        ? (localStorage.getItem("mutual_neighbourhood") || "")
        : "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/skills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            title,
            description,
            category,
            location,
            needsInReturn: returnSkill,
            username,
          }),
        }
      );
      const responseText = await res.text();
      console.log("Post skill response:", res.status, responseText);
      if (!res.ok) throw new Error("Post failed");
      setSuccess(true);
      setTimeout(() => router.push("/browse"), 1000);
    } catch {
      setApiError("Failed to post your listing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* shared input style — cream bg against the white card */
  const inputCls =
    "w-full rounded-xl border border-cream-dark bg-cream px-4 py-3 text-sm text-ink " +
    "placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage/30 transition-shadow";

  return (
    <div className="min-h-screen bg-cream py-8">

      {/* back button — mobile only */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 md:hidden"
        style={{ padding: "4px 16px", fontSize: 14, color: "#4A4840", background: "none", border: "none" }}
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mx-auto max-w-[600px] px-4 sm:px-6">

        {/* page heading */}
        <h1 className="font-display text-3xl font-bold text-ink">Post a Skill</h1>
        <p className="mb-6 mt-2 text-sm text-ink-soft">
          Tell the community what you can offer and what you&apos;d like in return.
        </p>

        {/* ── MAIN CARD ──────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-sm">

          {/* CATEGORY */}
          <div className="p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Category
            </p>
            <div className="grid grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => { setCategory(cat.name); clearError("category"); }}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl px-2 py-5 text-xs font-medium transition-colors ${
                    category === cat.name
                      ? "border-2 border-sage bg-sage-light text-sage"
                      : "border border-cream-dark bg-cream-dark text-ink-soft hover:border-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="text-xl leading-none">{cat.icon}</span>
                  <span className="text-center leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-2 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="border-t border-cream-dark" />

          {/* YOU OFFER */}
          <div className="space-y-5 p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-light px-3 py-1 text-xs font-semibold text-sage">
              <ArrowLeftRight className="h-3 w-3" />
              YOU OFFER
            </span>

            {/* skill title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                What&apos;s your skill?
              </label>
              <input
                type="text"
                value={title}
                maxLength={TITLE_MAX}
                onChange={(e) => { setTitle(e.target.value); clearError("title"); }}
                placeholder="e.g. Haircuts & styling, Guitar lessons, Plumbing help, Coding..."
                className={inputCls}
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.title
                  ? <p className="text-xs text-red-500">{errors.title}</p>
                  : <span />
                }
                <span className="text-xs text-ink-muted">{title.length}/{TITLE_MAX}</span>
              </div>
            </div>

            {/* description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Briefly describe what you&apos;ll provide{" "}
                <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <textarea
                value={description}
                maxLength={DESC_MAX}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="e.g. I've been doing hair 5 years - braids, locs, cuts and natural styles. Happy to do sessions at your place"
                className={inputCls + " resize-none"}
              />
              <div className="mt-1 flex justify-end">
                <span className="text-xs text-ink-muted">
                  {description.length}/{DESC_MAX}
                </span>
              </div>
            </div>
          </div>

          {/* ↕ swap divider */}
          <div className="flex items-center gap-4 px-6 py-1">
            <div className="flex-1 border-t border-cream-dark" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-dark bg-cream text-ink-muted">
              <ArrowUpDown className="h-4 w-4" />
            </div>
            <div className="flex-1 border-t border-cream-dark" />
          </div>

          {/* IN RETURN FOR */}
          <div className="space-y-4 p-6">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
              IN RETURN FOR
            </span>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                What skill do you want back?
              </label>
              <input
                type="text"
                value={returnSkill}
                onChange={(e) => { setReturnSkill(e.target.value); clearError("returnSkill"); }}
                placeholder="e.g. Helping fixing my sink, Yoga sessions, CV writing..."
                className={inputCls}
              />
              {errors.returnSkill && (
                <p className="mt-1 text-xs text-red-500">{errors.returnSkill}</p>
              )}
              <p className="mt-2 text-xs text-ink-muted">
                Be specific — the more concrete, the more likely you&apos;ll find a match.
              </p>
            </div>
          </div>

          <div className="border-t border-cream-dark" />

          {/* PREVIEW */}
          <div className="p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Preview – How it will appear on Browse Skills
            </p>
            <div className="rounded-xl border border-cream-dark bg-cream p-4">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded-full border border-sage px-2 py-0.5 text-[10px] font-bold tracking-wide text-sage">
                    OFFERS
                  </span>
                  <span
                    className={`text-sm leading-snug ${
                      title ? "text-ink-soft" : "italic text-ink-muted"
                    }`}
                  >
                    {title || "Your skill title will appear here..."}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded-full border border-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-600">
                    NEEDS
                  </span>
                  <span
                    className={`text-sm leading-snug ${
                      returnSkill ? "text-ink-soft" : "italic text-ink-muted"
                    }`}
                  >
                    {returnSkill || "What you want in return..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CANCEL + POST ──────────────────────────────────── */}
        {apiError && (
          <p className="mt-3 text-center text-sm text-red-500">{apiError}</p>
        )}

        <div className="mt-4 flex gap-3 pb-10">
          <button
            type="button"
            onClick={() => router.push("/browse")}
            className="min-h-[48px] flex-1 rounded-xl border border-cream-dark py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-ink-muted hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePost}
            disabled={loading}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              "Posting…"
            ) : (
              <>
                <Send className="h-4 w-4" />
                Post listing
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── SUCCESS MODAL ──────────────────────────────────── */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-cream p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage-light">
              <Send className="h-5 w-5 text-sage" />
            </div>
            <h3 className="font-display text-xl font-bold text-ink">
              Your listing is live!
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Your skill has been posted. Neighbours can now find you and propose a swap.
            </p>
            <button
              onClick={() => router.push("/browse")}
              className="mt-6 w-full rounded-xl bg-ink py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
            >
              Back to Browse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
