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
} from "lucide-react";

export default function Features() {
  return (
    <section id="solutions" className="dark:bg-muted/25 py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-14">
        <div className="mx-auto grid gap-2 sm:grid-cols-5">
          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
            <CardHeader>
              <div className="p-4 md:p-6">
                <p className="font-medium">E-commerce Integration</p>
                <p className="text-muted-foreground mt-3 max-w-sm text-sm">
                  Register, create wallets, and start accepting crypto payments
                  in your e-commerce platform within minutes. Full API
                  integration with shopping carts.
                </p>
              </div>
            </CardHeader>

            <div className="relative h-fit pl-4 md:pl-12">
              <div className="bg-background overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2 dark:bg-zinc-950">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                  <div className="flex items-center space-x-4">
                    <Store className="text-primary size-8" />
                    <div>
                      <p className="font-medium">Shopping Cart</p>
                      <p className="text-sm text-muted-foreground">
                        Easy Checkout Flow
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <QrCode className="text-primary size-8" />
                    <div>
                      <p className="font-medium">Payment QR</p>
                      <p className="text-sm text-muted-foreground">
                        Instant Generation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
            <CardHeader className="p-4 md:p-6">
              <p className="mx-auto mb-4 text-balance text-center text-lg font-semibold sm:text-2xl">
                Digital Subscriptions
              </p>
              <p className="text-muted-foreground text-sm text-center mb-6">
                Automated subscription management for SaaS, content platforms,
                and digital services
              </p>
            </CardHeader>

            <CardContent className="mt-auto h-fit p-4 md:p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <div className="text-center">
                    <RefreshCcw className="mx-auto size-8 text-primary" />
                    <p className="mt-2 font-medium">Recurring Billing</p>
                    <p className="text-xs text-muted-foreground">
                      Automated Monthly Payments
                    </p>
                  </div>
                  <div className="text-center">
                    <Globe className="mx-auto size-8 text-primary" />
                    <p className="mt-2 font-medium">Global Access</p>
                    <p className="text-xs text-muted-foreground">
                      Multi-Currency Support
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2 sm:px-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Initial Setup</p>
                    <p className="text-xs text-muted-foreground">
                      API Integration
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Auto Renewal</p>
                    <p className="text-xs text-muted-foreground">
                      Access Control
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Payment Status</p>
                    <p className="text-xs text-muted-foreground">
                      Real-time Updates
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Blockchain</p>
                    <p className="text-xs text-muted-foreground">
                      Fast Confirmation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative shadow-zinc-950/5 sm:col-span-5 sm:rounded-none sm:rounded-b-xl">
            <CardHeader className="p-4 md:p-8">
              <p className="font-medium">Security & Support</p>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                Bank-grade wallet security with 24/7 technical support and
                comprehensive testing environment
              </p>
            </CardHeader>
            <CardContent className="relative h-fit px-4 pb-4 md:px-8 md:pb-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Shield className="mx-auto size-8 text-primary" />
                    <p className="mt-2 text-sm font-medium">Secure Storage</p>
                    <p className="text-xs text-muted-foreground">
                      Encrypted Keys
                    </p>
                  </div>
                  <div className="text-center">
                    <Wallet className="mx-auto size-8 text-primary" />
                    <p className="mt-2 text-sm font-medium">HD Wallets</p>
                    <p className="text-xs text-muted-foreground">
                      BIP-39 Standard
                    </p>
                  </div>
                  <div className="text-center">
                    <FileCheck className="mx-auto size-8 text-primary" />
                    <p className="mt-2 text-sm font-medium">Test Environment</p>
                    <p className="text-xs text-muted-foreground">
                      Developer Tools
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">Payment Links</p>
                    <p className="text-xs text-muted-foreground">
                      Shareable URLs
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">QR Codes</p>
                    <p className="text-xs text-muted-foreground">
                      Dynamic Generation
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">REST API</p>
                    <p className="text-xs text-muted-foreground">
                      Full Integration
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">SDK Support</p>
                    <p className="text-xs text-muted-foreground">
                      Multiple Languages
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
