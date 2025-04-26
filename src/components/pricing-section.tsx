"use client";
import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-24 bg-[#f6f7f9] relative">
      {/* Background decorations similar to hero section */}
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
      >
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute right-0 top-0 w-60 rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-0">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-blue-500 lg:text-5xl font-medium mb-2 sm:mb-4">
            Simple, transparent pricing
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2 sm:px-0">
            Choose the plan that works best for your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-8 max-w-6xl mx-auto">
          {/* Startup Plan */}
          <div className="bg-background rounded-2xl border p-8 flex flex-col h-full relative overflow-hidden">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Startup</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Perfect for small businesses just getting started
              </p>
              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold">$99/mo</span>
                <span className="text-muted-foreground ml-2">or 1%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Whichever is higher
              </p>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">
                  Accept all major cryptocurrencies
                </span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">
                  Real-time payment notifications
                </span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">Basic analytics dashboard</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">Email support</span>
              </div>
            </div>

            <div className="mt-8">
              <Link href="https://app.paycrypt.tech/account">
                <Button className="w-full" variant="outline">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Standard Plan */}
          <div className="bg-background rounded-2xl border p-8 flex flex-col h-full relative overflow-hidden">
            <div className="absolute -right-12 -top-12 bg-primary/10 h-24 w-24 rounded-full"></div>
            <div className="absolute -right-6 -top-6 bg-primary/20 h-12 w-12 rounded-full"></div>

            <div className="mb-6 relative">
              <h3 className="text-xl font-semibold mb-2">Standard</h3>
              <p className="text-muted-foreground text-sm mb-6">
                For growing businesses with consistent revenue
              </p>
              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold">1%</span>
                <span className="text-muted-foreground ml-2">
                  per transaction
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Simple, straightforward pricing
              </p>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">
                  All features from Startup plan
                </span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">Advanced payment analytics</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">Custom payment pages</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">
                  Priority email & chat support
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/contact">
                <Button className="w-full">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-background rounded-2xl border p-8 flex flex-col h-full relative overflow-hidden">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Custom solutions for large businesses
              </p>
              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold">Contact us</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Custom pricing for your specific needs
              </p>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">
                  All features from Standard plan
                </span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">Volume discounts</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">Dedicated account manager</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">Custom integration support</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="ml-3 text-sm">
                  SLA with 24/7 premium support
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Link target="_blank" href="https://discord.gg/UCqEx8SuZf">
                <Button className="w-full" variant="outline">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
