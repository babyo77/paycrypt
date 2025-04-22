import { motion } from "motion/react";
import Link from "next/link";
export const NotFound = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8 relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm stroke-amber-500"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div className="absolute inset-0 bg-amber-50 rounded-full blur-2xl opacity-40 -z-10"></div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl font-medium text-amber-500 mb-4 text-center tracking-tight"
      >
        Sponsor Link Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xs md:text-sm text-amber-500 text-center max-w-xs mb-8 tracking-tight leading-relaxed"
      >
        The sponsor link you're looking for doesn't exist or may have expired.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Link href="/">
          <span className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium rounded-lg transition-all duration-300 inline-flex items-center gap-1.5 shadow-md tracking-tight">
            Return to Homepage
          </span>
          <div className="absolute inset-0 bg-amber-500 rounded-lg blur-md opacity-20 -z-10 translate-y-1 scale-90"></div>
        </Link>
      </motion.div>
    </div>
  );
};
