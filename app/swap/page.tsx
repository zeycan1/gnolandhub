import SiteLogo from "@/components/SiteLogo";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import HubBanner from "@/components/HubBanner";
import SwapLive from "@/components/SwapLive";

export default function SwapPage() {
  return (
    <main className="vault-page">
      <SiteLogo />
      <SiteNav />
      <HubBanner />
      <SwapLive />
      <SiteFooter />
    </main>
  );
}
