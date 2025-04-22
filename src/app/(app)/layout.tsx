import type { Metadata } from "next";
import { UserProvider } from "../provider/user-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { getSession } from "@/app/actions/getSession";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Paycrypt",
    default: "Paycrypt - Cryptocurrency Payment Solutions",
  },
  description:
    "Secure cryptocurrency payment processing for e-commerce, subscriptions, and donations. Accept ETH and BTC with low fees and global market access.",
  keywords:
    "cryptocurrency payments, blockchain, e-commerce, digital payments, ETH, BTC, crypto donations",
  authors: [{ name: "Paycrypt" }],
  openGraph: {
    title: {
      template: "%s | Paycrypt",
      default: "Paycrypt - Cryptocurrency Payment Solutions",
    },
    description:
      "Accept crypto payments globally with low fees and enhanced security",
    type: "website",
    images: ["https://logo-images.b-cdn.net/graident.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | Paycrypt",
      default: "Paycrypt - Cryptocurrency Payment Solutions",
    },
    description:
      "Accept crypto payments globally with low fees and enhanced security",
    images: ["https://logo-images.b-cdn.net/graident.png"],
  },
  icons: {
    icon: "https://logo-images.b-cdn.net/icon.png",
  },
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  console.log("session", session);
  if (session?.user.is_active === false) {
    redirect("/onboard");
  }
  if (!session) {
    redirect("/account");
  }

  return (
    <UserProvider session={session.user}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
