import type { Metadata } from "next";
import { UserProvider } from "../provider/user-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { getSession } from "@/app/actions/getSession";
import { redirect } from "next/navigation";
import { appMetadata } from "@/lib/utils";

export const metadata: Metadata = {
  ...appMetadata,
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
    <UserProvider
      session={{
        ...session.user,
        timeframe: "WEEKLY",
        networkMode: "TESTNET",
      }}
    >
      <div className="w-full h-full"
         style={{
          background: "linear-gradient(190deg, #3700FF76 0%, #0d001a 40%, #000000 100%)"
      
         }}
      >
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
      </div>
    </UserProvider>
  );
}