"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface Props {
  title?: string;
  onClose: () => void;
}

export default function AuthPromptModal({
  title = "Join Mutual to propose a swap",
  onClose,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full bg-white p-8"
        style={{ maxWidth: 400, borderRadius: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-ink-muted transition-colors hover:bg-cream-dark"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <h2
          className="font-display font-bold leading-tight text-ink"
          style={{ fontSize: 22, color: "#1C1A14" }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        <p
          className="leading-relaxed"
          style={{ fontSize: 14, color: "#8A887E", marginTop: 8 }}
        >
          Create a free account to connect with neighbours in your area. It
          takes seconds.
        </p>

        {/* CTA button */}
        <Link
          href="/auth?tab=register"
          className="mt-6 flex w-full items-center justify-center font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            marginTop: 24,
            height: 46,
            backgroundColor: "#1C1A14",
            borderRadius: 10,
            fontSize: 14,
          }}
          onClick={onClose}
        >
          Create a free account
        </Link>

        {/* Sign in link */}
        <p className="mt-4 text-center text-sm">
          <Link
            href="/auth?tab=signin"
            className="font-medium transition-opacity hover:opacity-80"
            style={{ color: "#3D6B4F" }}
            onClick={onClose}
          >
            Already have one? Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
