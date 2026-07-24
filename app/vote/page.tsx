import SiteLogo from "@/components/SiteLogo";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import HubBanner from "@/components/HubBanner";
import VoteBoard from "@/components/VoteBoard";
import { readGovDaoRender } from "@/lib/gno";

export default async function VotePage() {
  let renderMd = "";
  let loadError: string | null = null;
  try {
    renderMd = await readGovDaoRender("");
  } catch (e) {
    loadError = e instanceof Error ? e.message : "failed to load GovDAO data";
  }

  return (
    <main className="vault-page">
      <SiteLogo />
      <SiteNav />
      <HubBanner />
      <VoteBoard initialRender={renderMd} initialError={loadError} />
      <SiteFooter />
    </main>
  );
}
