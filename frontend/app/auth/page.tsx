"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftRight, Eye, EyeOff, ArrowRight } from "lucide-react";
import { login } from "@/lib/auth";
import { registerUser, loginUser } from "@/lib/api";

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
    avatarColor: "#C4571A",
    quote:
      "\"Traded piano lessons for Squarespace help. Found someone in my building through Mutual.\"",
    name: "Nam Y.",
    stars: 5,
  },
];

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

function inputCls(value: string, extra = "") {
  const border = value ? "border-[#3D6B4F]" : "border-[#EDE9DA]";
  return `w-full rounded-lg border ${border} bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage/30 transition-shadow${extra ? " " + extra : ""}`;
}

/* ─── page ───────────────────────────────────────────────────────── */

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"create" | "signin">(
    searchParams.get("tab") === "signin" ? "signin" : "create"
  );

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
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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

  async function handleCreate(ev: React.SyntheticEvent) {
    ev.preventDefault();
    if (!validateCreate()) return;
    setLoading(true);
    setApiError("");
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await registerUser(fullName, email.trim(), password);
      localStorage.setItem("mutual_neighbourhood", neighbourhood.trim());
      login(`${firstName.trim()} ${lastName.trim()}`, email.trim());
      router.push("/browse");
    } catch {
      setApiError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(ev: React.SyntheticEvent) {
    ev.preventDefault();
    if (!validateSignIn()) return;
    setLoading(true);
    setApiError("");
    try {
      await loginUser(siEmail.trim(), siPassword);
      login(siEmail.trim(), siEmail.trim());
      window.dispatchEvent(new Event("mutual-auth-change"));
      setTimeout(() => router.push("/browse"), 150);
    } catch {
      setApiError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  /* ─ render ─ */

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[46%] flex-col bg-cream px-10 py-8 xl:px-16">
        {/* logo */}
        <Link href="/browse" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
            <ArrowLeftRight className="h-4 w-4 text-cream" />
          </span>
          <span className="text-lg font-semibold text-ink">Mutual</span>
        </Link>

        <div style={{ maxWidth: 560 }}>
          {/* illustration */}
          <div className="mt-8 flex justify-center">
            <img src="/sign_illustration.svg" alt="" aria-hidden="true" className="w-full max-w-[380px]" />
          </div>

          {/* tagline */}
          <div className="mt-4">
            <h2 className="font-display text-4xl font-bold leading-tight text-ink xl:text-[2.6rem]">
              Your skills are{" "}
              <span className="italic text-sage">worth more</span>{" "}
              than money.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Mutual is a no-money skill exchange. List something you do well,
              ask for something you need help with — we&apos;ll match you with
              neighbours who fit.
            </p>
          </div>

          {/* testimonials */}
          <div className="mt-8 flex flex-col gap-4">
            {/* card 1 */}
            <div
              style={{
                marginLeft: 0,
                width: "85%",
                padding: 16,
                backgroundColor: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(28,26,20,0.10)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ width: 38, height: 38, backgroundColor: TESTIMONIALS[0].avatarColor }}
                >
                  {TESTIMONIALS[0].initials}
                </div>
                <p className="flex-1 text-[13px] leading-relaxed text-ink-soft">{TESTIMONIALS[0].quote}</p>
              </div>
              <div className="mt-2 flex items-center justify-between" style={{ paddingLeft: 50 }}>
                <span className="text-xs font-medium text-ink">{TESTIMONIALS[0].name}</span>
                <Stars count={TESTIMONIALS[0].stars} />
              </div>
            </div>

            {/* card 2 */}
            <div
              style={{
                marginLeft: 40,
                width: "85%",
                padding: 16,
                backgroundColor: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(28,26,20,0.10)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ width: 38, height: 38, backgroundColor: TESTIMONIALS[1].avatarColor }}
                >
                  {TESTIMONIALS[1].initials}
                </div>
                <p className="flex-1 text-[13px] leading-relaxed text-ink-soft">{TESTIMONIALS[1].quote}</p>
              </div>
              <div className="mt-2 flex items-center justify-between" style={{ paddingLeft: 50 }}>
                <span className="text-xs font-medium text-ink">{TESTIMONIALS[1].name}</span>
                <Stars count={TESTIMONIALS[1].stars} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto bg-white px-6 sm:px-10" style={{ paddingTop: 80 }}>
        <div className="w-full max-w-[420px] pb-12">
          {/* heading */}
          <div className="mb-6 text-center">
            <h1 className="font-display text-3xl font-bold text-ink">
              {tab === "create" ? "Join Mutual" : "Welcome Back"}
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
              onClick={() => { setTab("signin"); setErrors({}); setApiError(""); }}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                tab === "signin"
                  ? "bg-ink text-cream shadow-sm"
                  : "text-ink-muted hover:text-ink-soft"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setTab("create"); setErrors({}); setApiError(""); }}
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
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); clearError("firstName"); }}
                    className={inputCls(firstName)}
                  />
                </Field>
                <Field label="Last name" error={errors.lastName}>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); clearError("lastName"); }}
                    className={inputCls(lastName)}
                  />
                </Field>
              </div>

              <Field label="Email address" error={errors.email}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                  className={inputCls(email)}
                />
              </Field>

              <Field label="Neighbourhood" error={errors.neighbourhood}>
                <input
                  type="text"
                  placeholder="e.g. Osu, Accra"
                  value={neighbourhood}
                  onChange={(e) => { setNeighbourhood(e.target.value); clearError("neighbourhood"); }}
                  className={inputCls(neighbourhood)}
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
                            ? "border-sage bg-sage-light text-sage"
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
                    className={inputCls(password, "pr-11")}
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

              {apiError && (
                <p className="text-center text-sm text-red-500">{apiError}</p>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  !firstName.trim() ||
                  !lastName.trim() ||
                  !email.trim() ||
                  !neighbourhood.trim() ||
                  !password ||
                  !agreeTerms
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account…" : "Create my account"}
                {!loading && <ArrowRight className="h-4 w-4" />}
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
                  className={inputCls(siEmail)}
                />
              </Field>

              <div className="flex flex-col gap-1">
                <Field label="Password" error={errors.siPassword}>
                  <div className="relative">
                    <input
                      type={showSiPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={siPassword}
                      onChange={(e) => { setSiPassword(e.target.value); clearError("siPassword"); }}
                      className={inputCls(siPassword, "pr-11")}
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
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-sage hover:underline underline-offset-2">
                    Forgot password?
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-sage"
                />
                Remember me
              </label>

              {apiError && (
                <p className="text-center text-sm text-red-500">{apiError}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !siEmail.trim() || !siPassword}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in…" : "Sign in"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthContent />
    </Suspense>
  );
}
