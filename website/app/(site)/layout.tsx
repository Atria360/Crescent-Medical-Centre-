import Script from "next/script";
import TopBar from "@/components/site/TopBar";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Effects from "@/components/site/Effects";
import FloatingCall from "@/components/site/FloatingCall";
import { getBlock, s } from "@/lib/content";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getBlock("settings");
  const chatbotId = s(settings, "chatbot_embed_id");

  return (
    <>
      <TopBar settings={settings} />
      <Header logo={s(settings, "logo")} siteName={s(settings, "site_name", "Crescent Medical Centre")} />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingCall phone={s(settings, "phone")} />
      <Effects />
      {chatbotId ? (
        <Script
          id="collect-chat"
          src={`https://links.collect.chat/${chatbotId}`}
          strategy="lazyOnload"
        />
      ) : null}
    </>
  );
}
