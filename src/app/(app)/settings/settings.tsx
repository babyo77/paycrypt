"use client";
import React from "react";
import { useUser } from "@/app/provider/user-provider";
import { useRouter } from "next/navigation";
import { User, Receipt, Percent, Key, Webhook, Book, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export default function SettingsPage() {
  const router = useRouter();

  const settingsSections = [
    {
      title: "General",
      items: [
        {
          id: "account",
          title: "Account",
          description: "Basic info like user details and login details",
          icon: <User className="h-5 w-5 text-blue-500" />,
          path: "/settings/account",
          disabled: false,
        },
      ],
    },
    {
      title: "Payments",
      items: [
        {
          id: "invoices",
          title: "Invoices",
          description: "Manage due dates, memos, footers, etc",
          icon: <Receipt className="h-6 w-6 text-blue-500" />,
          path: "/settings/invoices",
          disabled: true,
        },
        {
          id: "promocodes",
          title: "Promocodes",
          description: "Manage promocodes based on your requirements",
          icon: <Percent className="h-6 w-6 text-blue-500" />,
          path: "/settings/promocodes",
          disabled: true,
        },
      ],
    },
    {
      title: "Developer",
      items: [
        {
          id: "api-keys",
          title: "API Keys",
          description: "Manage your API keys",
          icon: <Key className="h-6 w-6 text-blue-500" />,
          path: "/settings/api-keys",
          disabled: false,
        },
        {
          id: "webhooks",
          title: "Webhooks",
          description: "Manage your webhooks",
          icon: <Webhook className="h-6 w-6 text-blue-500" />,
          path: "/settings/webhooks",
          disabled: false,
        },
        {
          id: "sdk",
          title: "SDK",
          description: "Get the SDK",
          icon: <Code className="h-6 w-6 text-blue-500" />,
          path: "/settings/sdk",
          disabled: true,
        },
        {
          id: "documentation",
          title: "Documentation",
          description: "Documentation for the API",
          icon: <Book className="h-6 w-6 text-blue-500" />,
          path: "/docs",
          disabled: false,
        },
      ],
    },
  ];

  const navigateToSetting = (path: string, disabled: boolean) => {
    if (!disabled) {
      router.push(path);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
          >
            <TabsContent
              value="outline"
              className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
              {settingsSections.map((section, index) => (
                <div key={section.title} className={index > 0 ? "mt-6" : ""}>
                  <h2 className="text-base font-medium text-foreground mb-2">
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          navigateToSetting(item.path, item.disabled)
                        }
                        className={cn(
                          "group flex items-center p-3 bg-card border border-border",
                          "rounded-lg shadow-xs transition-all duration-200",
                          !item.disabled &&
                            "cursor-pointer hover:border-primary/30 hover:bg-muted/20",
                          item.disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="flex-shrink-0 p-1.5 rounded-md bg-muted">
                          {item.icon}
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="font-medium text-card-foreground text-sm">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
