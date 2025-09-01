"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ComponentType<any>;
    items?: {
      title: string;
      url: string;
      icon?: React.ComponentType<any>;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className=" space-y-1.5">
          {items.map((item) => {
            // Check if this item or any subitems are active
            const isItemActive = pathname === item.url;
            const isSubItemActive = item.items?.some(
              (subItem) => pathname === subItem.url
            );
            const showSubmenu = item.items && item.items.length > 0;

            return showSubmenu ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isItemActive || isSubItemActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild
                  className="cursor-pointer"
                  >
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        isItemActive ? "text-white" : "text-white/80"
                      )}
                      isActive={isItemActive}
                    >
                      {item.icon && <item.icon />}
                      <span className={isItemActive ? "text-white" : "text-white/80"}>
                        {item.title}
                      </span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="space-y-1.5"> 
                      {item.items?.map((subItem) => {
                        const isSubActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                isSubActive
                                  ? "text-white bg-primary font-medium"
                                  : "text-white"
                              )}
                            >
                              <Link prefetch href={subItem.url}>
                                {subItem.icon && (
                                  <subItem.icon className="h-4 w-4 mr-2" />
                                )}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <Link
                prefetch
                key={item.title}
                href={item.url}
                className="w-full"
              >
                <SidebarMenuItem className="cursor-pointer">
                  <SidebarMenuButton
                    className={cn(
                      pathname === item.url
                        ? "text-white cursor-pointer"
                        : "text-white/80 cursor-pointer"
                    )}
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    {item.icon && (
                      <item.icon
                        className={isItemActive ? "text-white" : "text-white/80"}
                      />
                    )}
                    <span className={isItemActive ? "text-white" : "text-white/80"}>
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
