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
import { WalletIcon, Settings2 } from "lucide-react";
import Link from "next/link";
import { NavSecondary } from "./nav-secondary";

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
      title: "Integrations",
      url: "/integrations",
      icon: IconBrandAirbnb,
    },
    // {
    //   title: "Wallet",
    //   url: "/wallet",
    //   icon: WalletIcon,
    // },
    // {
    //   title: "Billing",
    //   url: "/billing",
    //   icon: IconCreditCard,
    // },
    // {
    //   title: "KYC & Verification",
    //   url: "/kyc",
    //   icon: IconShield,
    // },
  ],
  navSecondary: [
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
              <Link prefetch href="/">
                <IconInnerShadowTop className="!size-5 text-primary" />
                <span className="text-primary font-semibold leading-tight">
                  Paycrypt
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
