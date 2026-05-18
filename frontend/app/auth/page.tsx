"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftRight, Eye, EyeOff, ArrowRight } from "lucide-react";

/* ─── constants ─────────────────────────────────────────────────── */

const SKILL_CATEGORIES = [
  "Beauty & Care",
  "Home & Trade",
  "Food & Cooking",
  "Tech",
  "Fitness & Sport",
  "Education",
  "Creative & Arts",
  "Music & Dance",
];

const TESTIMONIALS = [
  {
    initials: "OE",
    avatarColor: "#1C1A14",
    quote:
      "\"I taught SAT math for 3 sessions and got my dog watched for a whole weekend. Unreal deal.\"",
    name: "Jaden B.",
    stars: 4,
  },
  {
    initials: "NY",
    avatarColor: "#C4763A",
    quote:
      "\"Traded piano lessons for Squarespace help. Found someone in my building through Mutual.\"",
    name: "Nam Y.",
    stars: 5,
  },
];

/* ─── illustration ──────────────────────────────────────────────── */

function Illustration() {
  return (
    <svg
      viewBox="0 0 360 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[320px]"
      aria-hidden="true"
    >
      {/* background circle */}
      <circle cx="180" cy="150" r="138" fill="#EDE9DA" />

      {/* monitor */}
      <rect x="95" y="68" width="170" height="118" rx="8" fill="#1C1A14" />
      <rect x="103" y="76" width="154" height="102" rx="5" fill="#F5F1E6" />
      {/* code lines */}
      <rect x="117" y="92" width="88" height="5" rx="2.5" fill="#3D6B4F" opacity="0.7" />
      <rect x="117" y="107" width="62" height="5" rx="2.5" fill="#8A887E" opacity="0.5" />
      <rect x="117" y="122" width="108" height="5" rx="2.5" fill="#3D6B4F" opacity="0.4" />
      <rect x="117" y="137" width="52" height="5" rx="2.5" fill="#C4763A" opacity="0.6" />
      <rect x="117" y="152" width="78" height="5" rx="2.5" fill="#3D6B4F" opacity="0.3" />
      {/* stand */}
      <rect x="170" y="186" width="20" height="18" fill="#1C1A14" opacity="0.7" />
      <rect x="148" y="202" width="64" height="8" rx="4" fill="#1C1A14" opacity="0.6" />

      {/* left person */}
      <circle cx="60" cy="160" r="20" fill="#D4A462" />
      <path d="M 40 162 Q 60 146 80 162" fill="#3D2E18" opacity="0.85" />
      <rect x="42" y="178" width="36" height="48" rx="10" fill="#4A4840" />

      {/* right person */}
      <circle cx="296" cy="136" r="21" fill="#C88850" />
      <rect x="275" y="157" width="42" height="52" rx="10" fill="#C4763A" />
      {/* tablet */}
      <rect x="264" y="186" width="52" height="40" rx="6" fill="#1C1A14" opacity="0.85" />
      <rect x="269" y="191" width="42" height="30" rx="3" fill="#EAF0EB" />
      <rect x="275" y="198" width="30" height="3" rx="1.5" fill="#3D6B4F" opacity="0.5" />
      <rect x="275" y="207" width="20" height="3" rx="1.5" fill="#8A887E" opacity="0.4" />
      <rect x="275" y="216" width="26" height="3" rx="1.5" fill="#3D6B4F" opacity="0.3" />

      {/* gear */}
      <circle cx="318" cy="76" r="18" fill="none" stroke="#8A887E" strokeWidth="3" />
      <circle cx="318" cy="76" r="9" fill="none" stroke="#8A887E" strokeWidth="2.5" />

      {/* plant */}
      <rect x="30" y="256" width="7" height="32" rx="3.5" fill="#8B5E3C" />
      <ellipse cx="33" cy="246" rx="15" ry="20" fill="#3D6B4F" opacity="0.65" />
      <ellipse cx="47" cy="241" rx="11" ry="15" fill="#3D6B4F" opacity="0.45" />
      <ellipse cx="21" cy="243" rx="9" ry="13" fill="#6B9E7C" opacity="0.5" />

      {/* floating code bracket */}
      <text
        x="175"
        y="63"
        fontSize="18"
        fontFamily="monospace"
        fill="#3D6B4F"
        opacity="0.4"
        textAnchor="middle"
      >
        {"</>"}
      </text>
    </svg>
  );
}

/* ─── stars ─────────────────────────────────────────────────────── */

function Stars({ count }: { count: number }) {
  return (
    <span className="text-amber-400">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

/* ─── shared input ───────────────────────────────────────────────── */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-ink">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-cream-dark bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage/30 transition-shadow";

/* ─── page ───────────────────────────────────────────────────────── */

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"create" | "signin">("create");

  /* create-account state */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  /* sign-in state */
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [showSiPw, setShowSiPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ─ helpers ─ */

  function toggleCat(cat: string) {
    setSelectedCats((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : prev.length < 3
        ? [...prev, cat]
        : prev
    );
    if (errors.skills) setErrors((e) => ({ ...e, skills: "" }));
  }

  function clearError(key: string) {
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateCreate() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!emailRe.test(email)) e.email = "Enter a valid email address";
    if (!neighbourhood.trim()) e.neighbourhood = "Neighbourhood is required";
    if (selectedCats.length === 0) e.skills = "Pick at least one skill category";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Must be at least 8 characters";
    if (!agreeTerms) e.terms = "You must agree to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateSignIn() {
    const e: Record<string, string> = {};
    if (!siEmail.trim()) e.siEmail = "Email is required";
    else if (!emailRe.test(siEmail)) e.siEmail = "Enter a valid email address";
    if (!siPassword) e.siPassword = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCreate(ev: React.FormEvent) {
    ev.preventDefault();
    if (validateCreate()) router.push("/browse");
  }

  function handleSignIn(ev: React.FormEvent) {
    ev.preventDefault();
    if (validateSignIn()) router.push("/browse");
  }

  /* ─ render ─ */

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] flex-col bg-cream px-10 py-8 xl:px-16">
        {/* logo */}
        <Link href="/browse" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
            <ArrowLeftRight className="h-4 w-4 text-cream" />
          </span>
          <span className="text-lg font-semibold text-ink">Mutual</span>
        </Link>

        {/* illustration */}
        <div className="mt-8 flex justify-center">
          <Illustration />
        </div>

        {/* tagline */}
        <div className="mt-4">
          <h2 className="font-display text-4xl font-bold leading-tight text-ink xl:text-[2.6rem]">
            Your skills are{" "}
            <span className="italic text-sage">worth more</span>
            <br />
            than money.
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            Mutual is a no-money skill exchange. List something you do well,
            ask for something you need help with — we&apos;ll match you with
            neighbours who fit.
          </p>
        </div>

        {/* testimonials */}
        <div className="relative mt-8 h-52">
          {/* back card */}
          <div className="absolute left-10 top-4 w-[300px] rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: TESTIMONIALS[1].avatarColor }}
              >
                {TESTIMONIALS[1].initials}
              </div>
              <p className="text-[13px] leading-snug text-ink-soft">
                {TESTIMONIALS[1].quote}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between pl-12">
              <span className="text-xs font-medium text-ink">
                {TESTIMONIALS[1].name}
              </span>
              <Stars count={TESTIMONIALS[1].stars} />
            </div>
          </div>

          {/* front card */}
          <div className="absolute bottom-0 left-0 z-10 w-[310px] rounded-2xl bg-white p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: TESTIMONIALS[0].avatarColor }}
              >
                {TESTIMONIALS[0].initials}
              </div>
              <p className="text-[13px] leading-snug text-ink-soft">
                {TESTIMONIALS[0].quote}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between pl-12">
              <span className="text-xs font-medium text-ink">
                {TESTIMONIALS[0].name}
              </span>
              <Stars count={TESTIMONIALS[0].stars} />
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          {/* heading */}
          <div className="mb-6 text-center">
            <h1 className="font-display text-3xl font-bold text-ink">
              {tab === "create" ? "Join Mutual" : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              {tab === "create"
                ? "Create your free account in seconds"
                : "Sign in to your Mutual account"}
            </p>
          </div>

          {/* tab switcher */}
          <div className="mb-6 flex rounded-full bg-cream-dark p-1">
            <button
              onClick={() => { setTab("signin"); setErrors({}); }}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                tab === "signin"
                  ? "bg-ink text-cream shadow-sm"
                  : "text-ink-muted hover:text-ink-soft"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setTab("create"); setErrors({}); }}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                tab === "create"
                  ? "bg-ink text-cream shadow-sm"
                  : "text-ink-muted hover:text-ink-soft"
              }`}
            >
              Create account
            </button>
          </div>

          {/* ── CREATE ACCOUNT FORM ── */}
          {tab === "create" && (
            <form onSubmit={handleCreate} noValidate className="space-y-4">
              {/* name row */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" error={errors.firstName}>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); clearError("firstName"); }}
                    className={inputCls}
                  />
                </Field>
                <Field label="Last name" error={errors.lastName}>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); clearError("lastName"); }}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Email address" error={errors.email}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                  className={inputCls}
                />
              </Field>

              <Field label="Neighbourhood" error={errors.neighbourhood}>
                <input
                  type="text"
                  placeholder="e.g. Osu, Accra"
                  value={neighbourhood}
                  onChange={(e) => { setNeighbourhood(e.target.value); clearError("neighbourhood"); }}
                  className={inputCls}
                />
              </Field>

              {/* skill categories */}
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-ink">
                  What can you offer?{" "}
                  <span className="font-normal text-ink-muted">(pick up to 3)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {SKILL_CATEGORIES.map((cat) => {
                    const selected = selectedCats.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCat(cat)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          selected
                            ? "border-ink bg-ink text-cream"
                            : "border-cream-dark bg-white text-ink-soft hover:border-ink-muted hover:text-ink"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                {errors.skills && (
                  <p className="text-xs text-red-500">{errors.skills}</p>
                )}
              </div>

              {/* password */}
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                    className={inputCls + " pr-11"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-soft"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              {/* terms */}
              <div className="flex flex-col gap-1">
                <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => { setAgreeTerms(e.target.checked); clearError("terms"); }}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-sage"
                  />
                  <span className="leading-snug text-ink-soft">
                    I agree to Mutual&apos;s{" "}
                    <Link href="#" className="text-sage underline-offset-2 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-sage underline-offset-2 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-500">{errors.terms}</p>
                )}
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
              >
                Create my account
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* ── SIGN IN FORM ── */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} noValidate className="space-y-4">
              <Field label="Email address" error={errors.siEmail}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={siEmail}
                  onChange={(e) => { setSiEmail(e.target.value); clearError("siEmail"); }}
                  className={inputCls}
                />
              </Field>

              <Field label="Password" error={errors.siPassword}>
                <div className="relative">
                  <input
                    type={showSiPw ? "text" : "password"}
                    placeholder="Your password"
                    value={siPassword}
                    onChange={(e) => { setSiPassword(e.target.value); clearError("siPassword"); }}
                    className={inputCls + " pr-11"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSiPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-soft"
                    tabIndex={-1}
                  >
                    {showSiPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-sage"
                />
                Remember me
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
              >
                Sign in
              </button>

              <p className="text-center text-sm text-ink-muted">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setTab("create"); setErrors({}); }}
                  className="font-medium text-ink underline-offset-2 hover:underline"
                >
                  Create one
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
