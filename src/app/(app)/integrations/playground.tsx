"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Playground() {
  const router = useRouter();

  const handleViewDemo = () => {
    router.push("/x/idkwhy");
  };

  const handleSponsor = () => {
    window.open("/s/idkwhy", "_blank");
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        <h2 className="text-2xl font-medium tracking-tight mb-4">
          Integrations Coming Soon
        </h2>

        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
          We're developing powerful integrations for our platform, including a
          complete SDK, robust API, and seamless eCommerce solutions. In the
          meantime, you can explore our interactive demo to see how these will
          work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Button onClick={handleViewDemo} size="lg">
            Payment Link Demo
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

          <Button onClick={handleSponsor} size="lg" variant={"secondary"}>
            Sponsor Us
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
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
