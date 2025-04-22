"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WalletPlayground() {
  const router = useRouter();

  return (
    <div className="flex flex-1 items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center max-w-xl text-center p-10">
        <div className="mb-6 border border-primary/10 bg-primary/5 rounded-full p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
            <path d="M2 8h20" />
            <path d="M6 12h4" />
          </svg>
        </div>

        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Wallet Coming Soon
        </h2>

        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
          Our wallet feature is coming soon! You'll be able to manage your
          crypto assets, track transaction history, and make secure transfers
          all in one place. Stay tuned for this upcoming addition.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Button onClick={() => router.push("/links/create")} size="lg">
            Create payment link
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
