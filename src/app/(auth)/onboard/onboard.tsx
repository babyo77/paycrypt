"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Copy,
  Check,
  ChevronRight,
  Wallet,
  Key,
  User,
  Shield,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useRouter } from "next/navigation";
import { api } from "@/lib/utils";
function OnboardPage({ merchantData }: { merchantData: any }) {
  const [copied, setCopied] = useState({
    merchantId: false,
    apiKey: false,
    solAddress: false,
    ethAddress: false,
  });
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Merchant data

  const handleContinue = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      await api.patch("/merchant/update", {
        is_active: true,
      });
      router.push("/dashboard");
    }
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied({ ...copied, [key]: true });

    setTimeout(() => {
      setCopied({ ...copied, [key]: false });
    }, 2000);
  };

  // Function to truncate long strings
  const truncate = (str: string, length = 40) => {
    if (str.length <= length) return str;
    return `${str.substring(0, length)}...`;
  };

  // Define step icons
  const stepIcons = [
    <User key="user" className="w-5 h-5 text-primary" />,
    <Key key="key" className="w-5 h-5 text-primary" />,
    <Wallet key="wallet" className="w-5 h-5 text-primary" />,
  ];

  // Define step titles
  const stepTitles = ["Account Created", "API Access", "Wallet Addresses"];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center font-semibold tracking-tight justify-center relative overflow-hidden p-6"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-secondary/10 to-transparent z-0"></div>

      {/* Decorative shapes */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl z-0"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-secondary/5 blur-3xl z-0"></div>

      <div className="w-full max-w-lg mx-auto z-10">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 bg-background rounded-md items-center justify-center mb-5 border border-border ">
            <Logo />
          </div>

          {/* Step indicators using the icons instead of numbers */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {stepIcons.map((icon, idx) => (
              <div key={idx} className="relative">
                <motion.div
                  animate={{
                    opacity: idx + 1 === step ? 1 : idx + 1 < step ? 0.9 : 0.4,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border  ${
                    idx + 1 <= step
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  {idx + 1 < step ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    React.cloneElement(stepIcons[idx], {
                      className: "w-4 h-4",
                    })
                  )}
                </motion.div>
                {idx < 2 && (
                  <motion.div
                    animate={{
                      opacity: idx + 1 < step ? 0.9 : 0.3,
                    }}
                    transition={{ duration: 0.4 }}
                    className={`absolute top-1/2 -right-6 w-5 h-0.5 ${
                      idx + 1 < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <motion.div
          layout
          transition={{
            layout: { duration: 0.4, ease: "easeOut" },
            opacity: { duration: 0.3 },
          }}
          className="bg-card/90 backdrop-blur-sm rounded-lg p-6 mb-6 border border-border"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="tracking-tight"
            >
              <div className="flex items-center gap-3 mb-3">
                {stepIcons[step - 1]}
                <h2 className="font-semibold text-lg leading-tight tracking-tight">
                  {stepTitles[step - 1]}
                </h2>
              </div>

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <p className="text-sm text-muted-foreground mb-4 leading-tight tracking-tight font-medium">
                    Welcome, {merchantData.full_name}! Your crypto payment
                    account is ready.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 leading-tight tracking-tight font-medium">
                        Email
                      </div>
                      <div className="text-sm font-medium leading-tight tracking-tight">
                        {merchantData.email}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1 leading-tight tracking-tight font-medium">
                        Merchant ID
                      </div>
                      <div className="flex items-center justify-between gap-3 p-3 bg-background/50 rounded-md text-sm font-mono tracking-tighter border border-border">
                        <span className="truncate leading-tight">
                          {merchantData.merchant_id}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy("merchantId", merchantData.merchant_id)
                          }
                          className="p-1 hover:bg-muted rounded-md"
                        >
                          {copied.merchantId ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <p className="text-sm text-muted-foreground mb-4 leading-tight tracking-tight font-medium">
                    Use this API key to integrate payments with your systems
                  </p>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 leading-tight tracking-tight font-medium">
                        API Key
                      </div>
                      <div className="flex items-center justify-between gap-3 p-3 bg-background/50 rounded-md text-sm font-mono tracking-tighter border border-border">
                        <span className="truncate leading-tight">
                          {merchantData.api_key}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy("apiKey", merchantData.api_key)
                          }
                          className="p-1 hover:bg-muted rounded-md"
                        >
                          {copied.apiKey ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="text-sm text-muted-foreground p-3 bg-yellow-50/80 rounded-md leading-tight tracking-tight font-medium border border-yellow-200"
                    >
                      Keep this key secure and never share it publicly
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <p className="text-sm text-muted-foreground mb-4 leading-tight tracking-tight font-medium">
                    Your crypto payment addresses
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        symbol: "ETH",
                        address: merchantData.eth_address,
                        key: "ethAddress",
                      },
                      {
                        symbol: "SOL",
                        address: merchantData.sol_address,
                        key: "solAddress",
                      },
                    ].map((coin, index) => (
                      <motion.div
                        key={coin.symbol}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground tracking-tight leading-tight mb-1 font-medium">
                            {coin.symbol}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 p-3 bg-background/50 rounded-md text-sm font-mono tracking-tighter border border-border">
                          <span className="truncate leading-tight">
                            {truncate(coin.address)}
                          </span>
                          <button
                            onClick={() => handleCopy(coin.key, coin.address)}
                            className="p-1 hover:bg-muted rounded-md"
                          >
                            {copied[coin.key as keyof typeof copied] ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation button */}
        <div>
          <motion.button
            onClick={handleContinue}
            className="w-full py-3 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors flex items-center justify-center gap-2 tracking-tight leading-tight border border-primary"
          >
            {step < 3 ? "Next" : "Go to Dashboard"}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.main>
  );
}

export default OnboardPage;
