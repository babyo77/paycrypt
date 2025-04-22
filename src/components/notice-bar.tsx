"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBell, FaTimes } from "react-icons/fa";

export default function NoticeBar() {
  const [showNotice, setShowNotice] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;

      // Only change visibility state when scroll difference is significant
      if (scrollDifference > 10) {
        setIsVisible(false);
        setLastScrollY(currentScrollY);
      } else if (scrollDifference < -10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
      }
    };

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!showNotice) return null;

  return (
    <div
      className={`bg-blue-50 border border-blue-200/50 py-3 px-4  sticky z-50 rounded-lg transition-transform duration-300 ${
        isVisible ? "translate-y-0 mb-2 top-2" : "-translate-y-full top-0"
      }`}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 rounded-full p-1.5">
            <FaBell className="text-blue-600 size-4" />
          </div>
          <p className="text-sm font-medium">
            Paycrypt is coming soon!
            <Link
              href="https://discord.gg/7A87VRZn6U"
              target="_blank"
              className="underline ml-1 text-blue-700 hover:text-blue-900"
            >
              Join waitlist
            </Link>
          </p>
        </div>
        <button
          onClick={() => setShowNotice(false)}
          className="text-blue-700 hover:text-blue-900 rounded-full hover:bg-blue-100 p-1.5 transition-colors"
          aria-label="Close notice"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  );
}
