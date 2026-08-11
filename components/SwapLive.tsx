export default function SwapLive() {
  return (
    <div className="coming-soon">
      <span className="nav-soon">live</span>
      <h1 className="vault-title">Swap</h1>
      <p className="vault-lede">
        GnoSwap Beta is now live on Sapphire, the final testnet ahead of mainnet. We have not embedded it directly here yet, so head over to the official app to swap, provide liquidity, or stake.
      </p>
      <p className="vault-lede">
        <a href="https://beta.gnoswap.io" target="_blank" rel="noopener noreferrer">
          Open GnoSwap
        </a>
      </p>
      <p className="vault-lede">
        Make sure Adena is switched to the Sapphire network before connecting, and double check the address bar reads beta.gnoswap.io exactly. GnoSwap will never ask for your seed phrase.
      </p>
    </div>
  );
}
