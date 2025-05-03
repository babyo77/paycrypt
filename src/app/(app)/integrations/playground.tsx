"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Playground() {
  const router = useRouter();

  const handleViewDemo = () => {
    router.push("/demo");
  };

  const handleGetNotified = () => {};

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

          <Button onClick={handleGetNotified} size="lg" variant={"secondary"}>
            Get Notified
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
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
