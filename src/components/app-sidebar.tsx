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
import { useUser } from "@/app/provider/user-provider";
import { UserData } from "@/app/provider/user-provider";
import { api, TESTNET } from "@/lib/utils";
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
    // {
    //   title: "Support & Help",
    //   url: "/support",
    //   icon: IconHelp,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userData, dispatch } = useUser();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link className=" -ml-1.5" prefetch href="https://paycrypt.tech">
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
        <div className="bg-gray-50 dark:bg-gray-900/20 border dark:border-gray-800 rounded-lg p-3 text-sm ">
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-400 font-medium mb-2">
            <AlertCircle size={16} />
            <span className="uppercase tracking-wide">
              {TESTNET ? "Testnet Mode" : "Mainnet Mode"}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
            {TESTNET
              ? "You're using the test environment. All transactions are simulated and no real funds are involved."
              : "You're using the mainnet environment. All transactions are real and involve actual funds."}
          </p>

          <Link
            href={
              !TESTNET
                ? "https://dev.paycrypt.tech"
                : "https://app.paycrypt.tech"
            }
          >
            <Button size="sm" variant="default" className="w-full">
              {TESTNET ? "Switch to Mainnet" : "Switch to Testnet"}
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
