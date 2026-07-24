"use client";

import { useEffect, useState, useCallback } from "react";
import {
  readAllTokens,
  readTokenInfo,
  isAdenaInstalled,
  connectAdena,
  ensureLocalNetwork,
  doSetup,
  doMint,
  doWithdraw,
  doTransferFrom,
  type TokenInfo,
} from "@/lib/gno";
import SiteLogo from "@/components/SiteLogo";
import SiteFooter from "@/components/SiteFooter";
import AddressChip from "@/components/AddressChip";
import SiteNav from "@/components/SiteNav";
import HubBanner from "@/components/HubBanner";
import { gnotToUgnot, ugnotToGnot } from "@/lib/units";
function Keyhole() {
  return (
    <svg className="vault-keyhole" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="4.5" stroke="#c79a4b" strokeWidth="1.4" />
      <path d="M12 12.5 L9 20 H15 Z" fill="#c79a4b" opacity="0.85" />
    </svg>
  );
}

function short(addr: string) {
  if (!addr || addr.length < 14) return addr;
  return `${addr.slice(0, 7)}…${addr.slice(-6)}`;
}

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const loadGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ids = await readAllTokens();
      const infos = await Promise.all(ids.map((id) => readTokenInfo(id)));
      setTokens(infos);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  async function handleConnect() {
    setError(null);
    if (!isAdenaInstalled()) {
      setError("Adena wallet extension not found. Install it first.");
      return;
    }
    try {
      await ensureLocalNetwork();
      const addr = await connectAdena();
      setAccount(addr);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleSetup() {
    if (!account) return;
    setStatus("Sealing the registry with Setup()…");
    setError(null);
    try {
      await doSetup(account);
      setStatus("Registry sealed.");
      await loadGallery();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus(null);
    }
  }

  async function handleMint(form: FormData) {
    if (!account) return;
    const to = (form.get("to") as string) || account;
    const name = (form.get("name") as string) || "Untitled";
    const image = (form.get("image") as string) || "";
    setStatus("Casting a new vault…");
    setError(null);
    try {
      await doMint(account, to, name, image);
      setStatus("Vault cast.");
      await loadGallery();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus(null);
    }
  }

  async function handleWithdraw(tid: string) {
    if (!account) return;
    const amount = window.prompt("Amount to withdraw, in GNOT:", "1");
    if (!amount) return;
    setStatus(`Unlocking vault #${tid}…`);
    setError(null);
    try {
      await doWithdraw(account, tid, account, gnotToUgnot(amount));
      setStatus("Funds withdrawn.");
      await loadGallery();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus(null);
    }
  }

  async function handleTransfer(tid: string, currentOwner: string) {
    if (!account) return;
    const to = window.prompt("Hand the vault key to address:");
    if (!to) return;
    setStatus(`Transferring vault #${tid}…`);
    setError(null);
    try {
      await doTransferFrom(account, currentOwner, to, tid);
      setStatus("Vault transferred.");
      await loadGallery();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus(null);
    }
  }

  return (
    <main className="vault-page">
     <SiteLogo />
      <SiteNav />
      <HubBanner />
      <header className="vault-header">
        <div>
          <p className="vault-eyebrow">gno.land · realm.Sub() token bound accounts</p>
          <h1 className="vault-title">Token Bound Accounts</h1>
          <p className="vault-lede">
            Each NFT below is cast with its own on-chain vault. Anyone can
            deposit into it directly. Only whoever holds the NFT right now
            can open it.
          </p>
        </div>
        <div className="wallet-strip">
          {account ? (
            <>
              <span className="wallet-address">
                <span className="dot" />
                {short(account)}
              </span>
              <button className="btn btn-ghost btn-small" onClick={handleSetup}>
                Run Setup()
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleConnect}>
              Connect Adena
            </button>
          )}
        </div>
      </header>

      <div className="steps-strip">
        <div className="step">
          <span className="step-num">01 — CAST</span>
          <p className="step-text">Admin mints a vault-bound NFT to an owner.</p>
        </div>
        <div className="step">
          <span className="step-num">02 — FUND</span>
          <p className="step-text">
            Anyone sends coins straight to the vault&rsquo;s address.
          </p>
        </div>
        <div className="step">
          <span className="step-num">03 — HOLD THE KEY</span>
          <p className="step-text">
            Only the current NFT owner can withdraw — ownership moves, control follows.
          </p>
        </div>
      </div>

      {error && <p className="status-line status-error">{error}</p>}
      {status && <p className="status-line status-ok">{status}</p>}

      {account && (
        <form action={handleMint} className="mint-panel">
          <h3>Cast a new vault (admin only)</h3>
          <div className="field">
            <label>To address</label>
            <input name="to" placeholder="defaults to your address" />
          </div>
          <div className="field">
            <label>Name</label>
            <input name="name" placeholder="e.g. Vault of the North Wind" />
          </div>
          <div className="field">
            <label>Image URL</label>
            <input name="image" placeholder="https://…" />
          </div>
          <button type="submit" className="btn btn-primary">
            Mint
          </button>
        </form>
      )}

      <p className="vault-wall-heading">
        The vault wall {loading ? "· loading…" : `· ${tokens.length} cast`}
      </p>

      {tokens.length === 0 && !loading ? (
        <div className="vault-empty">
          No vaults have been cast yet. Connect and run Setup(), then mint the first one.
        </div>
      ) : (
        <div className="vault-wall">
          {tokens.map((t) => (
            <div key={t.tid} className="vault-card">
              <div className="vault-plate">
                <span className="vault-number">#{t.tid.padStart(3, "0")}</span>
                <Keyhole />
              </div>
              {t.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="vault-image" src={t.image} alt={t.name} />
              )}
              <h4 className="vault-name">{t.name || "Untitled vault"}</h4>
              <div className="vault-row">
                <span>owner</span>
                <AddressChip address={t.owner} />
              </div>
              <div className="vault-row">
                <span>vault addr</span>
                <AddressChip address={t.vault} />
              </div>
              <p className="vault-balance">{ugnotToGnot(t.balance)} GNOT</p>
              {account === t.owner && (
                <div className="vault-actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => handleWithdraw(t.tid)}
                  >
                    Withdraw
                  </button>
                  <button
                    className="btn btn-ghost btn-small"
                    onClick={() => handleTransfer(t.tid, t.owner)}
                  >
                    Transfer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
     <SiteFooter />
    </main>
  );
}


