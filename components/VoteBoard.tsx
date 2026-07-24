"use client";

import { useState } from "react";
import { renderSimpleMarkdown } from "@/lib/simpleMarkdown";
import {
  connectAdena,
  ensureLocalNetwork,
  doVote,
} from "@/lib/gno";

interface VoteBoardProps {
  initialRender: string;
  initialError: string | null;
}

export default function VoteBoard({ initialRender, initialError }: VoteBoardProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [pid, setPid] = useState("");
  const [option, setOption] = useState<"YES" | "NO" | "ABSTAIN">("YES");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleConnect() {
    try {
      await ensureLocalNetwork();
      const addr = await connectAdena();
      setAddress(addr);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "failed to connect wallet");
    }
  }

  async function handleVote() {
    if (!address) return;
    if (!pid.trim()) {
      setStatus("enter a proposal ID first");
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await doVote(address, pid.trim(), option);
      setStatus(`vote submitted for proposal #${pid} (${option})`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "vote failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="vault-page-section">
      <h2>GovDAO</h2>
      <p>
        Real, on-chain governance data from gno.land&apos;s GovDAO (
        <code>gno.land/r/gov/dao</code>). GovDAO is currently in a bootstrap
        phase limited to core team / validator addresses, most visitors
        cannot cast a vote yet. You can still browse proposal history below.
      </p>

      {initialError && (
        <p className="error-text">Could not load GovDAO data: {initialError}</p>
      )}

      {initialRender && <div className="govdao-render">{renderSimpleMarkdown(initialRender)}</div>}

      <div className="vote-form">
        <h3>Cast a vote (requires GovDAO membership)</h3>
        {!address ? (
          <button onClick={handleConnect}>Connect Adena</button>
        ) : (
          <p>Connected: {address}</p>
        )}

        <label>
          Proposal ID
          <input
            value={pid}
            onChange={(e) => setPid(e.target.value)}
            placeholder="e.g. 12"
          />
        </label>

        <label>
          Vote
          <select
            value={option}
            onChange={(e) =>
              setOption(e.target.value as "YES" | "NO" | "ABSTAIN")
            }
          >
            <option value="YES">YES</option>
            <option value="NO">NO</option>
            <option value="ABSTAIN">ABSTAIN</option>
          </select>
        </label>

        <button onClick={handleVote} disabled={!address || busy}>
          {busy ? "Submitting..." : "Submit vote"}
        </button>

        {status && <p>{status}</p>}
      </div>
    </section>
  );
}
