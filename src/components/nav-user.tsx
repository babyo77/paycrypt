"use client";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/app/provider/user-provider";
import { api } from "@/lib/utils";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { userData } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-9 w-9 rounded-md">
                <AvatarImage
                  src={`https://avatar.tobi.sh/${userData?.full_name.slice(
                    0,
                    1
                  )}.svg?text=${userData?.full_name
                    .slice(0, 2)
                    .toUpperCase()}&size=512`}
                  alt={userData?.full_name}
                />
                <AvatarFallback className="rounded-md object-cover">
                  CN
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {userData?.full_name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {userData?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) text-red-500 shadow-none min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={10}
          >
            <DropdownMenuItem
              onClick={async () => {
                await api
                  .get("/auth/logout", {
                    credentials: "include",
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      window.location.href = "/account";
                    }
                  });
              }}
            >
              <IconLogout className=" text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
