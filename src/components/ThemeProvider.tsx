"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mode = process.env.NEXT_PUBLIC_MODE;
    if (mode === "testnet") {
      document.documentElement.setAttribute("data-mode", "testnet");
    } else {
      document.documentElement.removeAttribute("data-mode");
    }
  }, []);

  return <>{children}</>;
}
