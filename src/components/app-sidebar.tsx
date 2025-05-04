"use client";
import * as React from "react";
import {
  IconInnerShadowTop,
  IconTransfer,
  IconHelp,
  IconBrandAirbnb,
  IconActivity,
  IconLinkPlus,
  IconCreditCard,
  IconCode,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Receipt, Settings2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "./ui/button";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconActivity,
      description: "Overview of balances and recent activity",
    },

    {
      title: "Transactions",
      url: "/transactions",
      icon: IconTransfer,
    },

    {
      title: "Payment",
      url: "/links",
      icon: IconLinkPlus,
      items: [
        {
          title: "Create Payment Link",
          url: "/links/create",
        },
        {
          title: "Payment Links History",
          url: "/links/history",
        },
      ],
    },
    {
      title: "Developer",
      url: "/developer",
      icon: IconCode,
      items: [
        {
          title: "API keys",
          url: "/settings/api-keys",
        },
        {
          title: "Webhooks",
          url: "/settings/webhooks",
        },
        // {
        //   title: "SDK",
        //   url: "/settings/sdk",
        // },
        {
          title: "Documentation",
          url: "/docs",
        },
      ],
    },
    {
      title: "Payout",
      url: "/payout",
      icon: Receipt,
    },
    {
      title: "Integrations",
      url: "/integrations",
      icon: IconBrandAirbnb,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Support & Help",
      url: "/support",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link prefetch href="https://paycrypt.tech">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <div className="px-3 mb-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 border dark:border-blue-800 rounded-lg p-3 text-sm ">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-medium mb-2">
            <AlertCircle size={16} className="animate-pulse" />
            <span className="uppercase tracking-wide">Testnet Mode</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-300 mb-3">
            You're using the test environment. All transactions are simulated
            and no real funds are involved.
          </p>
          <Link href="/waitlist">
            <Button size="sm" variant="default" className="w-full">
              Join Mainnet Waitlist
            </Button>
          </Link>
        </div>
      </div>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
