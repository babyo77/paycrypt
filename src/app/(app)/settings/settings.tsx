"use client";
import React, { useState } from "react";
import { useUser } from "@/app/provider/user-provider";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  User,
  Key,
  Wallet,
  Bell,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  const { userData } = useUser();
  const router = useRouter();

  const apiKeyExpiryDate = userData?.api_key_expiry
    ? format(new Date(userData.api_key_expiry), "MMMM d, yyyy")
    : "Not available";

  const settingsCards = [
    {
      id: "profile",
      title: "Profile Information",
      description: "Manage your personal information and account settings",
      icon: <User className="h-6 w-6 text-blue-500" />,
      path: "/settings/profile",
      detail: userData?.full_name || "Not set",
    },
    {
      id: "apikey",
      title: "API Key",
      description: "View and manage your API keys",
      icon: <Key className="h-6 w-6 text-purple-500" />,
      path: "/settings/api-keys",
      detail: `Expires: ${apiKeyExpiryDate}`,
    },
    {
      id: "wallet",
      title: "Wallet Addresses",
      description: "Manage your connected blockchain wallets",
      icon: <Wallet className="h-6 w-6 text-green-500" />,
      path: "/settings/wallets",
      detail: userData?.sol_address ? "Connected" : "Not connected",
    },
    {
      id: "webhook",
      title: "Webhook Settings",
      description: "Configure webhooks for notifications",
      icon: <Bell className="h-6 w-6 text-orange-500" />,
      path: "/settings/webhooks",
      detail: userData?.webhook_url ? "Configured" : "Not configured",
    },
    {
      id: "security",
      title: "Security Settings",
      description: "Manage security preferences and access controls",
      icon: <ShieldCheck className="h-6 w-6 text-red-500" />,
      path: "/settings/security",
      detail: "Standard",
    },
  ];

  const navigateToSetting = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-gray-50">
      <div className="flex flex-1 flex-col w-full pb-12 px-8 pt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500 mb-8">
          Manage your account settings and preferences
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigateToSetting(card.path)}
              className="group bg-white border border-gray-200 hover:border-primary/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-50 group-hover:bg-blue-50 rounded-lg transition-colors">
                    {card.icon}
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{card.description}</p>
                <div className="text-sm text-gray-600 font-medium mt-auto pt-2 border-t border-gray-100">
                  {card.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
