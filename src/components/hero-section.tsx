import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { HeroHeader } from "@/components/hero5-header";
import Features from "./features-11";
import TeamSection from "./team";
import FAQSection from "@/components/faq-section";
import Footer from "./footer";
import PricingSection from "./pricing-section";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden bg-[#f6f7f9] leading-tight tracking-tight">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <div className="absolute inset-0  -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-7xl px-4 md:px-6 ">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <Link
                  href="https://docs.paycrypt.tech"
                  className="hover:bg-background dark:hover:border-t-border group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950 bg-background/90"
                >
                  <span className="text-foreground text-sm">
                    Introducing Paycrypt
                  </span>
                  <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                  <div className="bg-background/90 group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                    </div>
                  </div>
                </Link>

                <p className="text-balance max-md:mt-12 font-medium text-6xl md:text-6xl lg:mt-16 xl:text-[5rem]">
                  Sell more with crypto
                </p>
                <p className="mt-8 px-4 mx-auto max-w-2xl text-center tracking-normal text-sm md:text-lg max-md:text-center">
                  No-code crypto payments for emerging markets. Multi-chain
                  support where traditional systems fail.
                </p>

                <div className="mt-12 flex items-center justify-center gap-2">
                  <Link href="https://app.paycrypt.tech">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="https://docs.paycrypt.tech">
                    <Button variant={"outline"} size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative max-md:mr-0 md:pb-7 max-md:mt-16 -mr-56 overflow-hidden px-4 sm:mr-0 sm:mt-12 md:mt-20">
              <div
                aria-hidden
                className=" to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border shadow-lg shadow-zinc-950/5 ring-1">
                <div className="relative">
                  <video
                    className="z-2 border-border/25 relative rounded-2xl border dark:hidden"
                    autoPlay
                    muted
                    loop
                    poster="https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/gradii-1600x900.webp"
                    preload="metadata"
                    src="https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/paycrypt-demo-25-apr-1745519925395.mp4"
                  >
                    <source
                      src="https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/paycrypt-demo-25-apr-1745519925395.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Features />
        <PricingSection />
        <TeamSection />
        <FAQSection />
        <Footer />
      </main>
    </>
  );
}
