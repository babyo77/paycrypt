"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  SendHorizonal,
  Play,
  AlertCircle,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { HeroHeader } from "@/components/hero5-header";
import { AnimatedGroup } from "./ui/animated-group";
import Features from "./features-11";
import TeamSection from "./team";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FAQSection from "@/components/faq-section";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await fetch("/api/sx", {
        method: "POST",
        body: JSON.stringify({
          email: email,
        }),
      });
      setIsSuccess(true);
      setEmail(""); // Clear the input
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div
        className={`text-black bg-white/40 backdrop-blur-2xl py-3 px-4 flex items-center justify-center space-x-2 fixed top-0 left-0 right-0 z-50 ${
          isScrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        <AlertCircle className="size-4 flex-shrink-0" />
        <p className="text-sm font-medium">
          Layer 2 integration is underway — Arbitrum, Optimism & Base coming
          soon.
        </p>
      </div>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36 bg-[url('https://i.pinimg.com/736x/81/7d/e8/817de8054c35605fe424edd2b0420f8a.jpg')] bg-cover bg-bottom">
            <div className="absolute inset-0 -z-20">
              <Image
                src="https://res.cloudinary.com/dg4jhba5c/image/upload/v1741605538/night-background_ni3vqb.jpg"
                alt="background"
                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                width="3276"
                height="4095"
              />
            </div>
            <div className="absolute inset-0  -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-7xl px-4 md:px-6 ">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <Link
                  href="https://x.com/paycrypt_tech"
                  className="hover:bg-background dark:hover:border-t-border bg-muted/90 group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
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

                <p className="mt-8 text-balance text-6xl md:text-6xl lg:mt-16 xl:text-[5rem]">
                  Sell more with
                  Crypto
                </p>
                <p className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                  Accept crypto payments globally and expand your business
                  reach. Fast, secure, and borderless transactions for modern
                  commerce.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                  <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
                    {isSuccess ? (
                      <div className="text-center">
                        <p className="text-blue-500 font-medium">
                          Thanks for joining! We'll be in touch soon.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-background/90 mb-3 has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.5rem)] border pr-2 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                        <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" />

                        <input
                          value={email}
                          onChange={(e) => {
                            setError("");
                            setEmail(e.target.value);
                          }}
                          placeholder="Your mail address"
                          className={`h-12 w-full bg-transparent pl-12 focus:outline-none ${
                            error ? "border-red-500" : ""
                          }`}
                          type="email"
                          required
                        />
                        {error && (
                          <div className="absolute -bottom-6 left-0 text-sm text-red-500">
                            {error}
                          </div>
                        )}

                        <div className="md:pr-1.5 lg:pr-0">
                          <Button
                            aria-label="submit"
                            size="sm"
                        
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="size-5 animate-spin rounded-full border-2 border-background border-t-foreground" />
                            ) : (
                              <>
                                <span className="hidden md:block">
                                  Join Waitlist
                                </span>
                                <SendHorizonal
                                  className="relative mx-auto size-5 md:hidden"
                                  strokeWidth={2}
                                />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    <Link
                      href="/s/idkwhy"
                      className="text-sm hover:underline underline-offset-4 text-muted-foreground"
                    >
                      Sponsor us
                    </Link>
                  </form>
                </div>
              </div>
            </div>

            <div className="relative max-md:mr-0 -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
              <div
                aria-hidden
                className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                <div className="relative">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                    src="/sex.png"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                    src="/sex.png"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform z-20"
                  >
                    <div className="flex size-16 items-center justify-center rounded-full bg-black/30 shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/40">
                      <Play className="size-8 text-white" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Features />
        <TeamSection />
        <FAQSection />
        <section className="bg-background overflow-hidden py-16">
          <div className="flex items-center justify-center gap-4">
            <Link href="https://x.com/meyanksingh">
              <FaXTwitter className="size-4 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link href="https://discord.gg/wy5vsBs6">
              <FaDiscord className="size-5 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
        </section>
      </main>
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-[1000px] w-[95%] p-2 sm:p-6">
          <div className="aspect-video w-full">
            <video
              className="size-full rounded-lg"
              controls
              autoPlay
              loop
              poster="https://logo-images.b-cdn.net/graident.png"
              preload="metadata"
              src="https://logo-images.b-cdn.net/paycrypt-1743981455177.mp4"
            >
              <source
                src="https://logo-images.b-cdn.net/paycrypt-1743981455177.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
