"use client";

import { useState } from "react";

function shortenAddress(addr: string) {
  if (!addr || addr.length < 14) return addr;
  return `${addr.slice(0, 7)}\u2026${addr.slice(-6)}`;
}

export default function AddressChip({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard not available - the title tooltip still works
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : `${address} (click to copy)`}
      className="addr-chip"
    >
      {copied ? "copied!" : shortenAddress(address)}
    </button>
  );
}
