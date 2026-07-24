// 1 GNOT = 1,000,000 ugnot. All on-chain amounts are ugnot; the UI
// should always speak GNOT to match Adena's own Send screen.

export function gnotToUgnot(gnot: string): string {
  const [whole, frac = ""] = gnot.trim().split(".");
  const fracPadded = (frac + "000000").slice(0, 6);
  const wholeBig = BigInt(whole || "0");
  const fracBig = BigInt(fracPadded || "0");
  return (wholeBig * 1000000n + fracBig).toString();
}

export function ugnotToGnot(ugnot: string): string {
  const big = BigInt(ugnot || "0");
  const whole = big / 1000000n;
  const frac = big % 1000000n;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(6, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}
