import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";

export const REALM_PATH = "gno.land/r/test1/tba";
export const RPC_URL = "https://rpc.topaz.testnets.gno.land";
export const CHAIN_ID = "topaz-1";

let providerPromise: Promise<GnoJSONRPCProvider> | null = null;

function getProvider(): Promise<GnoJSONRPCProvider> {
  if (!providerPromise) {
    providerPromise = GnoJSONRPCProvider.create(RPC_URL);
  }
  return providerPromise;
}

function parseGnoLine(line: string): string | undefined {
  const trimmed = line.trim();
  if (trimmed === "(undefined)") return undefined;

  const match = trimmed.match(/^\((.*) ([^ )]+)\)$/);
  if (!match) return trimmed;

  let value = match[1];
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  return value;
}

function parseGnoReturns(raw: string): (string | undefined)[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map(parseGnoLine);
}

export async function readAllTokens(): Promise<string[]> {
  const provider = await getProvider();
  const raw = await provider.evaluateExpression(REALM_PATH, "AllTokensCSV()");
  const [csv] = parseGnoReturns(raw);
  if (!csv) return [];
  return csv.split(",").filter(Boolean);
}

export async function readTokensOf(owner: string): Promise<string[]> {
  const provider = await getProvider();
  const raw = await provider.evaluateExpression(
    REALM_PATH,
    `TokensOfCSV("${owner}")`
  );
  const [csv] = parseGnoReturns(raw);
  if (!csv) return [];
  return csv.split(",").filter(Boolean);
}

export interface TokenInfo {
  tid: string;
  name: string;
  image: string;
  owner: string;
  vault: string;
  balance: string;
}

export async function readTokenInfo(tid: string): Promise<TokenInfo> {
  const provider = await getProvider();
  const raw = await provider.evaluateExpression(
    REALM_PATH,
    `TokenInfo("${tid}")`
  );
  const [name, image, owner, vault, balance] = parseGnoReturns(raw);
  return {
    tid,
    name: name ?? "",
    image: image ?? "",
    owner: owner ?? "",
    vault: vault ?? "",
    balance: balance ?? "0",
  };
}

declare global {
  interface Window {
    adena?: {
      AddEstablish: (appName: string) => Promise<unknown>;
      GetAccount: () => Promise<{
        data: { address: string; coins: string };
      }>;
      AddNetwork: (network: {
        chainId: string;
        chainName: string;
        rpcUrl: string;
      }) => Promise<unknown>;
      DoContract: (params: {
        messages: Array<{
          type: string;
          value: Record<string, unknown>;
        }>;
        memo?: string;
      }) => Promise<{
        code: number;
        status: "success" | "failure";
        type: string;
        message: string;
        data?: { hash: string; height: string };
      }>;
    };
  }
}

export function isAdenaInstalled(): boolean {
  return typeof window !== "undefined" && !!window.adena;
}

export async function connectAdena(): Promise<string> {
  if (!window.adena) throw new Error("Adena is not installed");
  await window.adena.AddEstablish("Gno Token Bound Accounts");
  const account = await window.adena.GetAccount();
  return account.data.address;
}

export async function ensureLocalNetwork(): Promise<void> {
  if (!window.adena) throw new Error("Adena is not installed");
  try {
    await window.adena.AddNetwork({
      chainId: CHAIN_ID,
      chainName: "Local Gno Dev",
      rpcUrl: RPC_URL,
    });
  } catch {
    // network may already exist - not fatal
  }
}

async function callContract(caller: string, func: string, args: string[]) {
  if (!window.adena) throw new Error("Adena is not installed");
  const result = await window.adena.DoContract({
    messages: [
      {
        type: "/vm.m_call",
        value: {
          caller,
          send: "",
          pkg_path: REALM_PATH,
          func,
          args,
        },
      },
    ],
  });
  if (result.status !== "success") {
    throw new Error(result.message || "transaction failed");
  }
  return result;
}

export const doSetup = (caller: string) => callContract(caller, "Setup", []);

export const doMint = (caller: string, to: string, name: string, image: string) =>
  callContract(caller, "Mint", [to, name, image]);

export const doTransferFrom = (caller: string, from: string, to: string, tid: string) =>
  callContract(caller, "TransferFrom", [from, to, tid]);

export const doWithdraw = (caller: string, tid: string, to: string, amount: string) =>
  callContract(caller, "Withdraw", [tid, to, amount]);

// --- GovDAO (Vote page) ---

export const GOVDAO_PATH = "gno.land/r/gov/dao";

export async function readGovDaoRender(path: string = ""): Promise<string> {
  const provider = await getProvider();
  return provider.getRenderOutput(GOVDAO_PATH, path);
}

export const doVote = (
  caller: string,
  pid: string,
  option: "YES" | "NO" | "ABSTAIN"
) => callContract(caller, "MustVoteOnProposalSimple", [pid, option]);
