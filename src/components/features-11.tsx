import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Wallet,
  Shield,
  CreditCard,
  Globe,
  ChartBar,
  Zap,
  QrCode,
  Bell,
  Store,
  RefreshCcw,
  Users,
  FileCheck,
  Clock,
  BarChart,
  DollarSign,
  Link as LinkIcon,
  Share2,
  Code,
} from "lucide-react";

export default function Features() {
  return (
    <section
      id="solutions"
      className="dark:bg-muted/25 space-y-6 md:py-14 py-12"
    >
      <div className="mx-auto max-w-5xl w-full md:px-0 px-4 text-start space-y-1">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-blue-500 lg:text-5xl font-medium mb-2 sm:mb-4">
            Solutions
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-2 sm:px-0">
            Paycrypt offers a comprehensive crypto payment infrastructure for
            businesses in emerging markets and crypto-native industries.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-14">
        <div className="mx-auto grid md:gap-2 gap-4 sm:grid-cols-5">
          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
            <CardHeader>
              <div className="p-4 md:p-6">
                <p className="font-medium text-lg">No-Code Crypto Checkout</p>
                <p className="text-muted-foreground mt-3 max-w-md text-sm">
                  Start accepting crypto payments in minutes without writing a
                  single line of code. Our plug-and-play infrastructure lets
                  entrepreneurs, freelancers, and businesses of all sizes create
                  professional payment experiences instantly.
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <Code className="size-5 mx-auto text-primary" />
                    <p className="text-xs font-medium mt-1">Zero Coding</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <Share2 className="size-5 mx-auto text-primary" />
                    <p className="text-xs font-medium mt-1">Shareable Links</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <Store className="size-5 mx-auto text-primary" />
                    <p className="text-xs font-medium mt-1">For Any Business</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <div className="relative h-fit pl-4 md:pl-12">
              <div className="bg-background overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2 dark:bg-zinc-950">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                  <div className="flex items-center space-x-4">
                    <LinkIcon className="text-primary size-8" />
                    <div>
                      <p className="font-medium">Smart Payment Links</p>
                      <p className="text-sm text-muted-foreground">
                        One-use, expiring, token-gated links that can be shared
                        via email, SMS, or social media
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <QrCode className="text-primary size-8" />
                    <div>
                      <p className="font-medium">Dynamic QR Codes</p>
                      <p className="text-sm text-muted-foreground">
                        Scannable QR codes that work with any crypto wallet for
                        in-person or remote transactions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
            <CardHeader className="p-4 md:p-6">
              <p className="mx-auto mb-2 text-balance text-center text-lg font-semibold sm:text-2xl">
                No-KYC Transactions
              </p>
              <p className="text-muted-foreground text-sm text-center">
                Accept payments with minimal friction, enabling faster
                onboarding for underserved users
              </p>
            </CardHeader>

            <CardContent className="mt-auto h-fit p-4 md:p-6 md:pt-7">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <div className="text-center">
                    <DollarSign className="mx-auto size-8 text-primary" />
                    <p className="mt-2 font-medium">$1,000/day</p>
                    <p className="text-xs text-muted-foreground">
                      No KYC Required
                    </p>
                  </div>
                  <div className="text-center">
                    <Globe className="mx-auto size-8 text-primary" />
                    <p className="mt-2 font-medium">Global Access</p>
                    <p className="text-xs text-muted-foreground">
                      Emerging Markets Focused
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2 sm:px-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Quick Onboarding</p>
                    <p className="text-xs text-muted-foreground">
                      Start in Minutes
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Inclusive</p>
                    <p className="text-xs text-muted-foreground">
                      For Underbanked Users
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Seamless UX</p>
                    <p className="text-xs text-muted-foreground">
                      User-Friendly Flow
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Compliance</p>
                    <p className="text-xs text-muted-foreground">
                      Daily Limits
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative shadow-zinc-950/5 sm:col-span-5 sm:rounded-none sm:rounded-b-xl">
            <CardHeader className="p-4 md:p-8">
              <p className="font-medium">Multi-Chain & Merchant Tools</p>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                Comprehensive support for multiple blockchains and stablecoins
                with powerful merchant dashboard and features
              </p>
            </CardHeader>
            <CardContent className="relative h-fit px-4 pb-4 md:px-8 md:pb-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Wallet className="mx-auto size-8 text-primary" />
                    <p className="mt-2 text-sm font-medium">
                      Multi-Chain Support
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ETH, Tron, Solana, Polygon, Arbitrum
                    </p>
                  </div>
                  <div className="text-center">
                    <BarChart className="mx-auto size-8 text-primary" />
                    <p className="mt-2 text-sm font-medium">
                      Dashboard Analytics
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Real-time Transaction Tracking
                    </p>
                  </div>
                  <div className="text-center">
                    <Clock className="mx-auto size-8 text-primary" />
                    <p className="mt-2 text-sm font-medium">Auto Payouts</p>
                    <p className="text-xs text-muted-foreground">
                      Every 3 Days to Your Wallet
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Refund Engine</p>
                    <p className="text-xs text-muted-foreground">
                      Simple Management
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Stablecoin Support</p>
                    <p className="text-xs text-muted-foreground">
                      USDT, USDC & More
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Reconciliation</p>
                    <p className="text-xs text-muted-foreground">
                      Auto Fail-Safe System
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">API Integration</p>
                    <p className="text-xs text-muted-foreground">
                      For Businesses of All Sizes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
