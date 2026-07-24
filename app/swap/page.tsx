import SiteLogo from "@/components/SiteLogo";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import HubBanner from "@/components/HubBanner";
import ComingSoon from "@/components/ComingSoon";

export default function SwapPage() {
  return (
    <main className="vault-page">
      <SiteLogo />
      <SiteNav />
      <HubBanner />
      <ComingSoon
        title="Swap"
        description="Token swaps for the gno.land ecosystem are coming soon. Check back once the vault and explorer integrations settle in."
      />
      <SiteFooter />
    </main>
  );
}
