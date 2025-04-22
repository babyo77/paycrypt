"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();

  const handleContactUs = () => {
    router.push("https://discord.gg/wy5vsBs6");
  };

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
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </div>

        <h2 className="text-2xl font-medium tracking-tight mb-4">
          We're On It!
        </h2>

        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
          Our support center is currently under development. Until then, you can
          join our Discord community for immediate support, feature updates, and
          to connect with other users.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Button onClick={handleContactUs} size="lg">
            Join Our Discord
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
