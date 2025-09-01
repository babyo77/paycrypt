import type { Metadata } from "next";
import { Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { appMetadata } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./fonts.css";
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const HankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
});
export const metadata: Metadata = {
  ...appMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${HankenGrotesk.className} ${HankenGrotesk.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
