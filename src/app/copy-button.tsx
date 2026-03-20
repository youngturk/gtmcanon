"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API blocked, user can select text manually
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 px-3 py-1.5 text-xs rounded border border-[var(--card-border)] hover:border-[var(--muted)] bg-[var(--background)] transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
