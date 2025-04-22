"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import QRCode from "react-qr-code";
import { PaymentLinkResponse } from "../[id]/page";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { api } from "@/lib/utils";

type PaymentData = {
  address: string;
  amount: number;
  currency: string;
  email: string;
  expiry: string;
  label: string;
  mode: string;
  network: string;
  payment_id: string;
  qr_data: string;
  status: string;
};
export default function PaymentPage({
  paymentDetails,
}: {
  paymentDetails: PaymentLinkResponse["payment_link"];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [qrData, setQrData] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);
  const [expirationTimer, setExpirationTimer] = useState(600);
  const [coinPrices, setCoinPrices] = useState<Record<string, number>>({});
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "error" | null
  >(null);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [testMode, setTestMode] = useState(true);

  const getCryptoCoins = () => {
    return [
      {
        id: "eth",
        name: testMode ? "Ethereum (Sepolia testnet)" : "Ethereum",
        symbol: "ETH",
        network: "ethereum",
        icon: (
          <Image
            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png"
            alt="Ethereum"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        ),
        disabled: false,
      },
      {
        id: "sol",
        name: testMode ? "Solana (devnet)" : "Solana",
        symbol: "SOL",
        network: "solana",
        icon: (
          <Image
            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/sol.png"
            alt="Solana"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        ),
        disabled: false,
      },
      {
        id: "btc",
        name: "Bitcoin",
        symbol: "BTC",
        network: "bitcoin",
        icon: (
          <Image
            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png"
            alt="Bitcoin"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        ),
        disabled: testMode,
      },
      {
        id: "usdt-erc20",
        name: "USDT (ERC-20)",
        symbol: "USDT",
        network: "ethereum",
        icon: (
          <Image
            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/usdt.png"
            alt="USDT (ERC-20)"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        ),
        disabled: testMode,
      },
      {
        id: "usdc-erc20",
        name: "USDC (ERC-20)",
        symbol: "USDC",
        network: "ethereum",
        icon: (
          <Image
            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/usdc.png"
            alt="USDC (ERC-20)"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        ),
        disabled: testMode,
      },
      {
        id: "usdc-solana",
        name: "USDC (Solana)",
        symbol: "USDC",
        network: "solana",
        icon: (
          <Image
            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/usdc.png"
            alt="USDC (Solana)"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        ),
        disabled: testMode,
      },
      {
        id: "usdt-solana",
        name: "USDT (Solana)",
        symbol: "USDT",
        network: "solana",
        icon: (
          <Image
            src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/usdt.png"
            alt="Solana"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        ),
        disabled: testMode,
      },
    ];
  };

  // Replace the static cryptoCoins array with the dynamic function
  const cryptoCoins = getCryptoCoins();

  // Format time for countdown timer
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (showQRCode && expirationTimer > 0) {
      timer = setInterval(() => {
        setExpirationTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showQRCode, expirationTimer]);

  const [coinPricesLoading, setCoinPricesLoading] = useState(false);
  useEffect(() => {
    const fetchCoinPrices = async () => {
      try {
        setCoinPricesLoading(true);
        const coins = ["eth", "btc", "sol"];
        const prices: Record<string, number> = {};

        for (const coin of coins) {
          const response = await fetch(`/api/coin/${coin}`);
          if (response.ok) {
            console.log(coin);

            const data = await response.json();
            prices[coin] = data.price;
          }
        }

        setCoinPrices(prices);
      } catch (error) {
        console.error("Error fetching coin prices:", error);
      } finally {
        setCoinPricesLoading(false);
      }
    };

    fetchCoinPrices();
  }, []);

  const calculateCoinAmount = (coin: string) => {
    if (!paymentDetails?.amount || !coinPrices[coin]) return "0";

    if (coin === "usdt" || coin === "usdc") {
      return paymentDetails.amount.toFixed(2);
    }

    const amountInCoin = paymentDetails.amount / coinPrices[coin];

    if (coin === "btc") {
      return amountInCoin.toFixed(6);
    } else if (coin === "eth") {
      return amountInCoin.toFixed(6);
    } else {
      return amountInCoin.toFixed(4);
    }
  };

  // Email validation schema using Zod
  const emailSchema = z.string().email("Please enter a valid email address");

  const validateEmail = (value: string): boolean => {
    try {
      emailSchema.parse(value);
      setEmailError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0]?.message || "Invalid email");
      }
      return false;
    }
  };

  const [confirmDetails, setConfirmDetails] = useState<{
    tx_hash: string;
  }>({
    tx_hash: "",
  });

  const [order, setOrder] = useState<PaymentData>();
  // Update the checkPaymentStatus function
  const checkPaymentStatus = async (paymentI: string) => {
    try {
      const response = await api.get<{
        data: {
          confirmed_at: string | null;
          status: string;
          tx_hash: string;
        };
      }>(`/payment/${paymentI}`, {
        showErrorToast: false,
      });
      console.log(response.data);
      if (response.data) {
        if (response.data.data.status === "COMPLETED") {
          setPaymentStatus("success");
          setConfirmDetails(response.data.data);
        } else if (response.data.data.status === "FAILED") {
          setPaymentStatus("error");
        }
      }
    } catch (error) {
      setPaymentStatus(null);
      console.error("Error checking payment status:", error);
      return "FAILED";
    }
  };

  const handlePayment = async () => {
    if (!selectedCrypto) return;

    if (!validateEmail(email)) return setEmailError("Invalid email");

    setIsLoading(true);

    try {
      const response = await api.get(`/payment/create`, {
        method: "POST",
        headers: {
          "X-API-Key": paymentDetails.api_key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: "links",
          email: email,
          amount: paymentDetails.amount / coinPrices[selectedCrypto],
          currency: selectedCrypto,
          network: cryptoCoins.find((coin) => coin.id === selectedCrypto)
            ?.network,
          mode: testMode ? "TESTNET" : "MAINNET",
          amount_usd: paymentDetails.amount,
          payment_link_id: paymentDetails.id,
        }),
      });

      if (response.status !== 200) {
        throw new Error("Failed to create payment");
      }

      const paymentData = response.data as PaymentData;

      setPaymentAddress(paymentData.address);
      setOrder(paymentData);
      if (paymentData.expiry) {
        const expiryDate = new Date(paymentData.expiry);
        const currentTime = new Date();
        const timeRemaining = Math.floor(
          (expiryDate.getTime() - currentTime.getTime()) / 1000
        );
        setExpirationTimer(timeRemaining > 0 ? timeRemaining : 600);
      }

      setQrData(paymentData.qr_data);
      setShowQRCode(true);
      setPaymentStatus("pending");
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowQRCode(false);
    setPaymentStatus("pending");
  };

  useEffect(() => {
    if (paymentStatus === "pending" && order?.payment_id) {
      const interval = setInterval(() => {
        checkPaymentStatus(order.payment_id);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentStatus, order?.payment_id]);

  useEffect(() => {
    if (
      paymentStatus === "success" &&
      paymentDetails.redirect_url &&
      paymentDetails.redirect_url !== ""
    ) {
      let timer = redirectCountdown;
      const countdown = setInterval(() => {
        timer -= 1;
        setRedirectCountdown(timer);

        if (timer <= 0) {
          clearInterval(countdown);
          window.location.href = paymentDetails.redirect_url;
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [paymentStatus, paymentDetails.redirect_url]);
  return (
    <div className="min-h-screen relative flex bg-zinc-50/10 items-start justify-center overflow-hidden">
      {/* Test Mode Toggle */}
      <div className="absolute top-5 right-5 z-50">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-1 shadow-sm">
          <button
            onClick={() => setTestMode(true)}
            className={`px-3 py-1 text-xs rounded-full transition-all ${
              testMode
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Test
          </button>
          <button
            onClick={() => setTestMode(false)}
            className={`px-3 py-1 text-xs rounded-full transition-all ${
              !testMode
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Live
          </button>
        </div>
      </div>

      {/* Glitter background gradient effect */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(219,234,254,0.7)_0%,rgba(255,255,255,0)_60%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(219,234,254,0.6)_0%,rgba(255,255,255,0)_60%)]"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div> */}

      {/* <motion.div
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7 }}
        className="bg-white/80 isolate backdrop-blur-md rounded-3xl max-w-5xl w-full border relative overflow-visible rounded-t-none"
        layout
      > */}
      {/* <div className="absolute -top-7 w-full left-1/2 -translate-x-1/2 z-50">
        <Button
          variant="link"
          size="sm"
          className="bg-blue-500/90 w-full text-white backdrop-blur-md shadow-sm text-sm  px-3 py-1 h-auto rounded-t-xl rounded-b-none border-b-0 border border-blue-400"
        >
          Test Mode
        </Button>
      </div> */}
      {/* Card inner glow */}
      {/* <div className="absolute -inset-px bg-gradient-to-r from-blue-100/30 via-white/80 to-blue-100/30 rounded-3xl blur-md opacity-70"></div> */}

      <div className="relative z-10 flex w-full flex-col lg:flex-row">
        {/* Left side - Product Information */}
        <div className="w-full lg:w-1/2 space-y-4 p-6 md:p-8 lg:p-12 xl:pl-52 lg:pl-32">
          <div className="flex font-semibold items-center gap-2">
            <Avatar className="rounded-md size-11">
              <AvatarImage src={paymentDetails?.image} />
              <AvatarFallback>
                {paymentDetails?.title.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <p className="text-base font-medium">{paymentDetails?.title}</p>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-gray-700 mb-3">
              US${paymentDetails?.amount?.toFixed(2)}
            </div>
            <p className="text-gray-600 outline-none cursor-default text-sm resize-none w-full overflow-hidden">
              {paymentDetails?.description || ""}
            </p>
          </div>
        </div>

        {/* Right side - Crypto Payment Form */}
        <div className="w-full lg:w-1/2 min-h-[calc(100vh-4rem)] lg:min-h-screen shadow-lg shadow-gray-300/50 bg-white p-6 md:p-8 xl:pl-24 lg:p-12 lg:pr-32 lg:pl-20 xl:pr-44">
          <AnimatePresence mode="wait" initial={false}>
            {!showQRCode ? (
              <motion.div
                key="payment-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value) validateEmail(e.target.value);
                        else setEmailError(null);
                      }}
                      disabled={isLoading}
                      required
                      className={`h-11 ${emailError ? "border-red-500" : ""}`}
                    />
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-2">
                      Payment method
                    </div>
                    <div className="overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                      {cryptoCoins.map((coin) => {
                        // Get the API coin ID for this coin
                        let apiCoinId = "";
                        let isStablecoin = false;

                        if (coin.id === "eth") apiCoinId = "eth";
                        else if (coin.id === "btc") apiCoinId = "btc";
                        else if (coin.id === "sol") apiCoinId = "sol";
                        else if (coin.id.includes("usdt")) {
                          apiCoinId = "usdt";
                          isStablecoin = true;
                        } else if (coin.id.includes("usdc")) {
                          apiCoinId = "usdc";
                          isStablecoin = true;
                        }

                        const coinAmount = isStablecoin
                          ? paymentDetails?.amount?.toFixed(2)
                          : apiCoinId
                          ? calculateCoinAmount(apiCoinId)
                          : "";

                        return (
                          <button
                            key={coin?.id}
                            disabled={
                              coinPricesLoading ||
                              isLoading ||
                              coin.disabled ||
                              coinAmount === "0"
                            }
                            onClick={() => setSelectedCrypto(coin?.id)}
                            className={`w-full disabled:opacity-50 flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                              selectedCrypto === coin?.id
                                ? "border-gray-900 bg-gray-50"
                                : "border-gray-200/80 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200/80 shadow-sm">
                                {coin?.icon}
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-medium text-gray-900">
                                  {coin?.name}
                                </div>
                                {((apiCoinId && coinPrices[apiCoinId]) ||
                                  isStablecoin) && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-xs text-gray-500 mt-0.5"
                                  >
                                    ≈ {coinAmount} {coin.symbol}
                                  </motion.div>
                                )}
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                selectedCrypto === coin?.id
                                  ? "bg-gray-900"
                                  : "border border-gray-300"
                              }`}
                            >
                              {selectedCrypto === coin?.id && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className=" sticky bottom-0 bg-white">
                    <Button
                      className=" w-full"
                      size={"lg"}
                      onClick={handlePayment}
                      disabled={
                        isLoading ||
                        !selectedCrypto ||
                        coinPricesLoading ||
                        !email
                      }
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          Processing...
                        </div>
                      ) : (
                        <p>Pay</p>
                      )}
                    </Button>

                    <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                      Powered by{" "}
                      <span className="ml-1 font-semibold text-gray-700">
                        Paycrypt
                      </span>
                      <p className="text-xs ml-2 text-gray-500">
                        <span className=" hover:text-gray-900 cursor-pointer">
                          Terms{" "}
                        </span>{" "}
                        |
                        <span className=" hover:text-gray-900 cursor-pointer">
                          {" "}
                          Privacy
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : paymentStatus === "success" ? (
              <motion.div
                key="payment-success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex items-center justify-center flex-col p-4 md:p-6"
              >
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Payment Successful
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    Your payment of ${paymentDetails?.amount?.toFixed(2)} has
                    been received
                  </p>
                  {paymentDetails.redirect_url && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Redirecting in {redirectCountdown} seconds...
                    </p>
                  )}
                </div>

                <div className="mt-2 w-full mb-3">
                  <div className="text-xs text-gray-500 mb-1">
                    Transaction Details
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between py-1">
                      <span className="text-xs text-gray-500">Amount</span>
                      <span className="text-xs font-medium">
                        ${paymentDetails?.amount?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-xs text-gray-500">
                        Payment method
                      </span>
                      <span className="text-xs font-medium">
                        {
                          cryptoCoins.find((coin) => coin.id === selectedCrypto)
                            ?.name
                        }
                      </span>
                    </div>
                    {order?.payment_id && (
                      <div className="flex justify-between py-1">
                        <span className="text-xs text-gray-500">
                          Payment ID
                        </span>
                        <span className="text-xs font-mono">
                          {order?.payment_id}
                        </span>
                      </div>
                    )}
                  </div>

                  {confirmDetails.tx_hash && (
                    <div className="flex flex-col justify-between py-1">
                      <span className="text-xs mb-1 text-gray-500">
                        Transaction Hash
                      </span>
                      <span className="text-xs break-all font-mono">
                        {confirmDetails.tx_hash}
                      </span>
                    </div>
                  )}
                </div>

                {paymentDetails.redirect_url && (
                  <div className="flex flex-col items-center justify-center mt-4 w-full">
                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 px-4 rounded-lg shadow-md transition-all duration-200 h-11"
                      onClick={() =>
                        (window.location.href = paymentDetails.redirect_url)
                      }
                    >
                      Continue
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                  Powered by{" "}
                  <span className="ml-1 font-semibold text-gray-700">
                    Paycrypt
                  </span>
                  <p className="text-xs ml-2 text-gray-500">
                    <span className=" hover:text-gray-900 cursor-pointer">
                      Terms{" "}
                    </span>{" "}
                    |
                    <span className=" hover:text-gray-900 cursor-pointer">
                      {" "}
                      Privacy
                    </span>
                  </p>
                </div>
              </motion.div>
            ) : paymentStatus === "error" ? (
              <motion.div
                key="payment-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex items-center justify-center flex-col p-4 md:p-6"
              >
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-500"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Payment Failed
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    There was an issue processing your payment
                  </p>
                </div>

                <div className="mt-4 w-full mb-4">
                  <div className="text-xs text-gray-500 mb-1">
                    Error Details
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="flex items-start">
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
                        className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span className="text-xs text-red-700">
                        Transaction couldn't be verified on the blockchain.
                        Please check your wallet and try again.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full mt-4">
                  <Button
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3.5 px-4 rounded-lg shadow-sm transition-all duration-200 h-11"
                    onClick={handleBack}
                  >
                    Go Back
                  </Button>
                  <Button
                    className="flex-1 bg-black hover:bg-gray-900 text-white py-3.5 px-4 rounded-lg shadow-md transition-all duration-200 h-11"
                    onClick={() => {
                      setPaymentStatus("pending");
                      setExpirationTimer(600);
                    }}
                  >
                    Try Again
                  </Button>
                </div>

                <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                  Powered by{" "}
                  <span className="ml-1 font-semibold text-gray-700">
                    Paycrypt
                  </span>
                  <p className="text-xs ml-2 text-gray-500">
                    <span className=" hover:text-gray-900 cursor-pointer">
                      Terms{" "}
                    </span>{" "}
                    |
                    <span className=" hover:text-gray-900 cursor-pointer">
                      {" "}
                      Privacy
                    </span>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="qr-code-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full p-4 pt-0 md:p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Pay with{" "}
                    {
                      cryptoCoins.find((coin) => coin.id === selectedCrypto)
                        ?.name
                    }
                  </h2>
                </div>

                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="flex flex-col items-center justify-center mb-2 mt-4">
                    <div className="text-sm text-gray-500 mb-1">
                      Waiting for payment...
                    </div>
                    <div className="text-xl font-medium text-gray-900">
                      {formatTime(expirationTimer)}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm mb-3 maxw-[280px] mx-auto">
                    <QRCode
                      value={qrData}
                      size={256}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      viewBox={`0 0 256 256`}
                      level="H"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    Scan with your crypto wallet app
                  </p>

                  {selectedCrypto && (
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium">
                        {(() => {
                          let apiCoinId = "";
                          let symbol = "";
                          let isStablecoin = false;

                          if (selectedCrypto === "eth") {
                            apiCoinId = "eth";
                            symbol = "ETH";
                          } else if (selectedCrypto === "btc") {
                            apiCoinId = "btc";
                            symbol = "BTC";
                          } else if (selectedCrypto === "sol") {
                            apiCoinId = "sol";
                            symbol = "SOL";
                          } else if (selectedCrypto.includes("usdt")) {
                            symbol = "USDT";
                            isStablecoin = true;
                          } else if (selectedCrypto.includes("usdc")) {
                            symbol = "USDC";
                            isStablecoin = true;
                          }

                          if (isStablecoin) {
                            return `${paymentDetails?.amount?.toFixed(
                              2
                            )} ${symbol}`;
                          } else {
                            return apiCoinId
                              ? `${calculateCoinAmount(apiCoinId)} ${symbol}`
                              : `${paymentDetails?.amount?.toFixed(2)} USD`;
                          }
                        })()}
                      </div>
                      <div className="text-xs text-gray-500">
                        ${paymentDetails?.amount?.toFixed(2)} USD
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 w-full">
                  <div className="text-xs text-gray-500 mb-1">
                    Wallet Address
                  </div>
                  <div className="relative mb-2">
                    <div className="p-3 bg-gray-50 rounded-lg break-all text-xs text-gray-600 font-mono">
                      {paymentAddress}
                    </div>
                    <button
                      onClick={() => {
                        if (paymentAddress) {
                          navigator.clipboard.writeText(paymentAddress);
                          setCopyStatus(true);
                          setTimeout(() => setCopyStatus(false), 2000);
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {copyStatus ? (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-green-600"
                        >
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
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </motion.div>
                      ) : (
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
                          className="text-gray-400"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                  Powered by{" "}
                  <span className="ml-1 font-semibold text-gray-700">
                    Paycrypt
                  </span>
                  <p className="text-xs ml-2 text-gray-500">
                    <span className=" hover:text-gray-900 cursor-pointer">
                      Terms{" "}
                    </span>{" "}
                    |
                    <span className=" hover:text-gray-900 cursor-pointer">
                      {" "}
                      Privacy
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* </motion.div> */}
    </div>
  );
}
