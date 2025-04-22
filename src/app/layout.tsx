import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
    images: ["https://logo-images.b-cdn.net/graident.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paycrypt - Cryptocurrency Payment Solutions",
    description:
      "Accept crypto payments globally with low fees and enhanced security",
    images: ["https://logo-images.b-cdn.net/graident.png"],
  },
  icons: {
    icon: "https://logo-images.b-cdn.net/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
