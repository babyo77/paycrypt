import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ApiClient from "hmm-api";
import { toast } from "sonner";
import { Metadata } from "next";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const supportApi = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_SUPPORT_API_URL!,
  toast,
});

export const api = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  toast,
  credentials: "include",

  parseErrorResponse(response) {
    console.error("Error from API", response);
    return {
      message: response.message,
    };
  },
});

export const appMetadata: Metadata = {
  title: "Paycrypt - Cryptocurrency Payment Solutions",
  description:
    "Secure cryptocurrency payment processing for e-commerce, subscriptions, and donations. Accept ETH and BTC with low fees and global market access.",
  keywords:
    "cryptocurrency payments, blockchain, e-commerce, digital payments, ETH, BTC, crypto donations",
  authors: [{ name: "Paycrypt" }],
  openGraph: {
    title: "Paycrypt - Cryptocurrency Payment Solutions",
    description:
      "Accept crypto payments globally with low fees and enhanced security",
    type: "website",
    images: [
      "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/gradii-1600x900.webp",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paycrypt - Cryptocurrency Payment Solutions",
    description:
      "Accept crypto payments globally with low fees and enhanced security",
    images: [
      "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/gradii-1600x900.webp",
    ],
  },
  icons: {
    icon: "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/Untitled_design.png",
  },
};

export const TESTNET =
  process.env.NEXT_PUBLIC_MODE === "testnet" ? true : false;
