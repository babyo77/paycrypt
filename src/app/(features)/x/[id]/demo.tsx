"use client";
import React, { useState, use, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { IconInnerShadowTop } from "@tabler/icons-react";
import QRCode from "react-qr-code";
import dynamic from "next/dynamic";

const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

// Add this type near the top of the file
type CryptoType = "ethereum" | "solana" | "bitcoin";

// 1. At the top with other constants (outside the component)
const PAYMENT_TIMEOUT = 900; // 15 minutes

// Add API base URL constant at the top of the file
const API_BASE_URL = "https://api.paycrypt.tech";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjE3NDQ0OTExOTQsIm1lcmNoYW50X2lkIjoiNGU1YTM0YWYtZDVlOS00ZWNiLWJiYWMtOWQxOGJjN2RlMTk1In0.xQ9KNgigz4boRZk_LBpYIpznp-uxgjM0SsxdpGVsgJU";
// Update the type definition

const key = "sova-1cfcf610-d8da-4003-a5b7-780389b66471";
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Add new types for API responses
type CreateOrderResponse = {
  address: string;
  amount: number;
  currency: string;
  expiry: string;
  label: string;
  mode: string;
  network: string;
  payment_id: string;
  qr_data: string;
};

type PaymentStatusResponse = {
  created_at: string;
  expired_at: string;
  message: string;
  payment_id: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "EXPIRED";
  tx_hash?: string;
};

// Add this type and constant for ETH price (you might want to fetch this from an API in production)
const ETH_PRICE = 3500; // Current ETH price in USD
const BTC_PRICE = 67000; // Current BTC price in USD

// Helper function to format crypto amounts
const formatCryptoAmount = (usdAmount: number, cryptoPrice: number) => {
  return (usdAmount / cryptoPrice).toFixed(6);
};

// Add at the top with other constants
const REDIRECT_URL = "https://paycrypt.tech";

function Page({ params }: PageProps) {
  // Always treat params as a Promise and use the `use` hook
  const { id } = use(params);

  const [metadata] = useState({
    user: {
      name:
        id === "meyank"
          ? "Meyank Singh"
          : id === "tanmay"
          ? "Tanmay"
          : id === "zara550e8400-e29b-41d4"
          ? "Zara"
          : id === "idkwhy"
          ? "idkwhy"
          : "John Doe",
      title:
        id === "meyank"
          ? "Dm's are open at @meyank.ssh"
          : id === "tanmay"
          ? "Dm's are open at @babyo7_"
          : id === "zara550e8400-e29b-41d4"
          ? "I make derivatives flow"
          : id === "idkwhy"
          ? "Idk why I'm here"
          : "I make derivatives flow",
      avatar:
        id === "meyank"
          ? "https://avatars.githubusercontent.com/u/111943685?v=4"
          : id === "tanmay"
          ? "https://avatars.githubusercontent.com/u/144552425?v=4"
          : id === "zara550e8400-e29b-41d4"
          ? "https://avatars.githubusercontent.com/u/zara"
          : id === "idkwhy"
          ? "https://logo-images.b-cdn.net/Screenshot%202025-04-07%20at%201.40.34%E2%80%AFAM.png"
          : "https://avatars.githubusercontent.com/u/111943685?v=4",
      amount: 10,
      company: "Paycrypt",
    },
  });

  const [paymentMethod, setPaymentMethod] = useState("crypto");
  const [showCryptoList, setShowCryptoList] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType | "">("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "waiting" | "success" | "error"
  >("waiting");
  const [isProcessing, setIsProcessing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [expirationTimer, setExpirationTimer] = useState(PAYMENT_TIMEOUT);
  const [copyStatus, setCopyStatus] = useState(false);
  const [paymentId, setPaymentId] = useState<string>("");
  const [qrData, setQrData] = useState<string>("");
  const [paymentAddress, setPaymentAddress] = useState("");

  // Add new state for transaction details
  const [transactionDetails, setTransactionDetails] =
    useState<PaymentStatusResponse | null>(null);

  // Add this with other useState declarations
  const [isTestMode, setIsTestMode] = useState(true);

  // Update the useEffect for payment simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timerInterval: NodeJS.Timeout;

    if (showQRCode && paymentStatus === "waiting" && paymentId) {
      // Separate interval for timer updates (every 1 second)
      timerInterval = setInterval(() => {
        setExpirationTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            clearInterval(interval);
            setPaymentStatus("error");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Separate interval for status checks (every 3 seconds)
      interval = setInterval(async () => {
        const status = await checkPaymentStatus(paymentAddress);
        if (status === "COMPLETED") {
          clearInterval(interval);
          clearInterval(timerInterval);
          setPaymentStatus("success");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
        } else if (status === "FAILED" || status === "EXPIRED") {
          clearInterval(interval);
          clearInterval(timerInterval);
          setPaymentStatus("error");
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timerInterval) clearInterval(timerInterval);
      if (!showQRCode) {
        setShowConfetti(false);
      }
    };
  }, [showQRCode, paymentStatus, paymentId]);

  // Add this useEffect to handle window size and confetti timing
  useEffect(() => {
    // Set window size
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Update the cryptoCoins array
  const cryptoCoins = [
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      icon: (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
        >
          <path
            d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
            fill="#627EEA"
            fillOpacity="0.1"
          />
          <path
            d="M16.498 4V12.87L23.995 16.22L16.498 4Z"
            fill="#343434"
            fillOpacity="0.8"
          />
          <path
            d="M16.498 4L9 16.22L16.498 12.87V4Z"
            fill="#8C8C8C"
            fillOpacity="0.8"
          />
          <path
            d="M16.498 21.968V27.995L24 17.616L16.498 21.968Z"
            fill="#343434"
            fillOpacity="0.8"
          />
          <path
            d="M16.498 27.995V21.967L9 17.616L16.498 27.995Z"
            fill="#8C8C8C"
            fillOpacity="0.8"
          />
          <path
            d="M16.498 20.573L23.995 16.22L16.498 12.872V20.573Z"
            fill="#343434"
            fillOpacity="0.8"
          />
          <path
            d="M9 16.22L16.498 20.573V12.872L9 16.22Z"
            fill="#8C8C8C"
            fillOpacity="0.8"
          />
        </svg>
      ),
      value: `≈ ${formatCryptoAmount(metadata.user.amount, ETH_PRICE)} ETH`,
      disabled: false,
    },
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      icon: (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
        >
          <path
            d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
            fill="#F7931A"
            fillOpacity="0.1"
          />
          <path
            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.745-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
            fill="#F7931A"
            fillOpacity="0.8"
          />
        </svg>
      ),
      value: `≈ ${formatCryptoAmount(metadata.user.amount, BTC_PRICE)} BTC`,
      disabled: true,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      icon: (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
        >
          <path
            d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
            fill="#9945FF"
            fillOpacity="0.1"
          />
          <path
            d="M8.24 19.3L10.62 21.68C10.76 21.82 10.96 21.9 11.16 21.9H23.5C23.84 21.9 24.01 21.5 23.76 21.26L21.38 18.88C21.24 18.74 21.04 18.66 20.84 18.66H8.5C8.16 18.66 7.99 19.06 8.24 19.3Z"
            fill="#9945FF"
            fillOpacity="0.8"
          />
          <path
            d="M8.24 13.06L10.62 15.44C10.76 15.58 10.96 15.66 11.16 15.66H23.5C23.84 15.66 24.01 15.26 23.76 15.02L21.38 12.64C21.24 12.5 21.04 12.42 20.84 12.42H8.5C8.16 12.42 7.99 12.82 8.24 13.06Z"
            fill="#9945FF"
            fillOpacity="0.8"
          />
          <path
            d="M8.24 6.82L10.62 9.2C10.76 9.34 10.96 9.42 11.16 9.42H23.5C23.84 9.42 24.01 9.02 23.76 8.78L21.38 6.4C21.24 6.26 21.04 6.18 20.84 6.18H8.5C8.16 6.18 7.99 6.58 8.24 6.82Z"
            fill="#9945FF"
            fillOpacity="0.8"
          />
        </svg>
      ),
      value: "≈ 0.011 SOL",
      disabled: true,
    },
  ];

  const handleMakePayment = () => {
    if (paymentMethod === "crypto") {
      setShowCryptoList(true);
    }
  };

  const handleProceedPayment = async () => {
    if (selectedCrypto) {
      setIsProcessing(true);
      setQrData(""); // Reset QR data while processing
      setPaymentAddress(""); // Reset address while processing

      try {
        const orderData = await createPaymentOrder(selectedCrypto);

        if (
          orderData &&
          orderData.payment_id &&
          orderData.qr_data &&
          orderData.address
        ) {
          setPaymentId(orderData.payment_id);
          setQrData(orderData.qr_data);
          setPaymentAddress(orderData.address);
          setIsProcessing(false);
          setShowQRCode(true);
          setExpirationTimer(PAYMENT_TIMEOUT);
        } else {
          throw new Error("Invalid order data received");
        }
      } catch (error) {
        console.error("Payment creation failed:", error);
        setIsProcessing(false);
        setPaymentStatus("error");
        setShowQRCode(false);
        // Reset states
        setPaymentId("");
        setQrData("");
        setPaymentAddress("");
      }
    }
  };

  const handleBack = () => {
    if (showQRCode) {
      setShowQRCode(false);
      setPaymentStatus("waiting");
    } else if (showCryptoList) {
      setShowCryptoList(false);
    }
  };

  // Update the formatTime function to properly format minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Update the createPaymentOrder function to properly handle errors
  const createPaymentOrder = async (crypto: CryptoType) => {
    try {
      const cryptoAmount =
        crypto === "ethereum"
          ? formatCryptoAmount(metadata.user.amount, ETH_PRICE)
          : crypto === "bitcoin"
          ? formatCryptoAmount(metadata.user.amount, BTC_PRICE)
          : metadata.user.amount;

      const response = await fetch(`${API_BASE_URL}/payment/create`, {
        method: "POST",
        headers: {
          "X-API-Key": key,
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(cryptoAmount),
          currency:
            crypto === "ethereum"
              ? "eth"
              : crypto === "bitcoin"
              ? "btc"
              : "usdc",
          network:
            crypto === "ethereum"
              ? "Mainnet"
              : crypto === "bitcoin"
              ? "Bitcoin"
              : "solana",
          MODE: isTestMode ? "TEST" : "MAINNET",
          amount_usd: metadata.user.amount,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateOrderResponse = await response.json();

      // Validate the required fields exist
      if (!data.payment_id || !data.qr_data || !data.address) {
        throw new Error("Invalid response data");
      }

      return data;
    } catch (error) {
      console.error("Error creating payment:", error);
      return null;
    }
  };

  // Update the checkPaymentStatus function
  const checkPaymentStatus = async (paymentI: string) => {
    try {
      const cryptoAmount =
        selectedCrypto === "ethereum"
          ? formatCryptoAmount(metadata.user.amount, ETH_PRICE)
          : selectedCrypto === "bitcoin"
          ? formatCryptoAmount(metadata.user.amount, BTC_PRICE)
          : metadata.user.amount;

      const response = await fetch(`/api/webhook`, {
        method: "POST",
        body: JSON.stringify({
          xs: paymentI,
          sex: Number(cryptoAmount),
          mode: isTestMode ? "TEST" : "MAINNET",
        }),
      });
      const data: PaymentStatusResponse = await response.json();
      setTransactionDetails({
        ...data,
        payment_id: paymentId,
      }); // Store the full response
      return data.status;
    } catch (error) {
      console.error("Error checking payment status:", error);
      return "FAILED";
    }
  };

  // Update the handleSuccessRedirect function to remove auto-redirect
  const handleSuccessRedirect = async () => {
    if (userEmail) {
      try {
        await fetch("/api/sx", {
          method: "POST",
          body: JSON.stringify({
            email: userEmail,
          }),
        });
        window.location.href = REDIRECT_URL;
      } catch (error) {
        console.error("Error sending email:", error);
        window.location.href = REDIRECT_URL;
      }
    } else {
      window.location.href = REDIRECT_URL;
    }
  };

  if (
    id !== "zara550e8400-e29b-41d4" &&
    id !== "meyank" &&
    id !== "tanmay" &&
    id !== "idkwhy"
  ) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
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
            stroke="#111111"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div className="absolute inset-0 bg-gray-50 rounded-full blur-2xl opacity-40 -z-10"></div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-2xl font-medium text-gray-900 mb-4 text-center tracking-tight"
        >
          Payment Link Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xs md:text-sm text-gray-500 text-center max-w-xs mb-8 tracking-tight leading-relaxed"
        >
          The payment link you're looking for doesn't exist or may have expired.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Link href="/">
            <span className="px-5 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs font-medium rounded-lg transition-all duration-300 inline-flex items-center gap-1.5 shadow-md tracking-tight">
              Return to Homepage
            </span>
            <div className="absolute inset-0 bg-gray-900 rounded-lg blur-md opacity-20 -z-10 translate-y-1 scale-90"></div>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Glitter background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(219,234,254,0.7)_0%,rgba(255,255,255,0)_60%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(219,234,254,0.6)_0%,rgba(255,255,255,0)_60%)]"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>

      {/* Add confetti here, before the card */}
      {showConfetti && (
        <>
          {/* Top Left Corner */}
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={100}
            gravity={0.3}
            colors={["#22c55e", "#16a34a", "#4ade80", "#86efac"]}
            confettiSource={{
              x: 0,
              y: 0,
              w: 10,
              h: 10,
            }}
            initialVelocityX={15}
            initialVelocityY={20}
            tweenDuration={3000}
            wind={0.05}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />

          {/* Top Right Corner */}
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={100}
            gravity={0.3}
            colors={["#22c55e", "#16a34a", "#4ade80", "#86efac"]}
            confettiSource={{
              x: windowSize.width,
              y: 0,
              w: 10,
              h: 10,
            }}
            initialVelocityX={-15}
            initialVelocityY={20}
            tweenDuration={3000}
            wind={-0.05}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />

          {/* Bottom Left Corner */}
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={100}
            gravity={0.2}
            colors={["#22c55e", "#16a34a", "#4ade80", "#86efac"]}
            confettiSource={{
              x: 0,
              y: windowSize.height,
              w: 10,
              h: 10,
            }}
            initialVelocityX={15}
            initialVelocityY={-20}
            tweenDuration={3000}
            wind={0.05}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />

          {/* Bottom Right Corner */}
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={100}
            gravity={0.2}
            colors={["#22c55e", "#16a34a", "#4ade80", "#86efac"]}
            confettiSource={{
              x: windowSize.width,
              y: windowSize.height,
              w: 10,
              h: 10,
            }}
            initialVelocityX={-15}
            initialVelocityY={-20}
            tweenDuration={3000}
            wind={-0.05}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl max-w-md w-full border relative overflow-hidden"
        layout
        layoutId="container"
      >
        {/* Blue gradient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-white/10 to-blue-50/30 pointer-events-none"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-200/20 to-white/50 rounded-3xl blur-md opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50/30 to-transparent"></div>

        {/* Reflective border effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/30 pointer-events-none"></div>

        {/* Card inner glow */}
        <div className="absolute -inset-px bg-gradient-to-r from-blue-100/30 via-white/80 to-blue-100/30 rounded-3xl blur-md opacity-70"></div>

        {/* Glitter sparkles with blue tint */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-50 rounded-full shadow-lg shadow-blue-100/50 opacity-90"></div>
        <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-blue-100/50 opacity-80"></div>
        <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-blue-50 rounded-full shadow-lg shadow-blue-100/50 opacity-70"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-white rounded-full shadow-lg shadow-blue-100/50 opacity-90"></div>

        {/* Subtle blue orb animations */}
        <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative z-10 overflow-hidden p-6 md:p-8">
          <motion.div className="w-full" layout layoutId="content">
            <AnimatePresence mode="wait" initial={false}>
              {showQRCode && paymentStatus === "waiting" ? (
                <motion.div
                  key="qr-code-view"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                  layout
                >
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={handleBack}
                      className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 12H5"></path>
                        <path d="M12 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <h2 className="text-lg font-medium text-gray-900">
                      Pay with{" "}
                      {selectedCrypto === "ethereum"
                        ? "Ethereum"
                        : selectedCrypto === "bitcoin"
                        ? "Bitcoin"
                        : "Solana"}
                    </h2>
                    <div className="w-8"></div>
                  </div>

                  <div className="flex flex-col items-center justify-center mb-6">
                    {qrData ? (
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3">
                        <QRCode
                          value={qrData}
                          size={200}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                          viewBox={`0 0 256 256`}
                          level="H"
                          className="rounded-lg"
                        />
                      </div>
                    ) : (
                      <div
                        className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm mb-3 flex items-center justify-center"
                        style={{ width: 180, height: 180 }}
                      >
                        <div className="text-gray-400 text-sm text-center">
                          Generating QR code...
                        </div>
                      </div>
                    )}
                    {/* <p className="text-sm text-gray-500 mb-1">
                      Scan with your crypto wallet app
                    </p> */}
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

                  <div className="flex flex-col items-center justify-center mb-6">
                    <div className="text-sm text-gray-500 mb-1">
                      Waiting for payment...
                    </div>
                    <div className="text-xl font-medium text-gray-900">
                      {formatTime(expirationTimer)}
                    </div>
                  </div>
                </motion.div>
              ) : paymentStatus === "success" ? (
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                  layout
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                      Payment Successful!
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-6">
                      Your transaction has been confirmed.
                    </p>

                    {transactionDetails && (
                      <div className="w-full max-w-sm bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Transaction Hash
                            </div>
                            <div className="text-sm font-mono break-all text-gray-700">
                              {transactionDetails.tx_hash}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Payment ID
                            </div>
                            <div className="text-sm font-mono text-gray-700">
                              {transactionDetails.payment_id}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Completed At
                            </div>
                            <div className="text-sm text-gray-700">
                              {new Date(
                                transactionDetails.created_at
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex justify-center"
                    >
                      <button
                        onClick={handleSuccessRedirect}
                        className="px-5 py-2 bg-black hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md transform hover:-translate-y-0.5"
                      >
                        Continue
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
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : paymentStatus === "error" ? (
                <motion.div
                  key="error-view"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                  layout
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                      Payment Failed
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-6">
                      Something went wrong with your transaction. Please try
                      again.
                    </p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex justify-center"
                    >
                      <button
                        onClick={() => {
                          setPaymentStatus("waiting");
                          setShowQRCode(false);
                          setShowCryptoList(false);
                          setSelectedCrypto("");
                          setExpirationTimer(PAYMENT_TIMEOUT); // Reset to 10 seconds
                        }}
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Try Again
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : !showCryptoList ? (
                <motion.div
                  key="payment-view"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                  layout
                >
                  <div className="flex flex-col items-center mb-7">
                    <div className="size-20 rounded-full overflow-hidden mb-3 border bg-white">
                      <Image
                        src={metadata.user.avatar}
                        alt={metadata.user.name}
                        width={500}
                        height={500}
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mb-0.5">
                      {metadata.user.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {metadata.user.title}
                    </p>
                  </div>

                  <div className="mb-8 ">
                    <div className="text-sm  text-gray-500 mb-1">Pay</div>
                    <div className="text-3xl font-semibold text-gray-900 flex items-center">
                      ${metadata.user.amount}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      to {metadata.user.name}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2 flex justify-between items-center">
                      <span>Payment method</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <motion.button
                        disabled
                        onClick={() => setPaymentMethod("card")}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center disabled:opacity-50 gap-2 transition-all ${
                          paymentMethod === "card"
                            ? "bg-gray-900 text-white shadow-md"
                            : "bg-white/80 text-gray-700 hover:bg-gray-100 border border-gray-100"
                        }`}
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
                          <rect
                            x="1"
                            y="4"
                            width="22"
                            height="16"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        Card
                      </motion.button>

                      <motion.button
                        onClick={() => setPaymentMethod("crypto")}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === "crypto"
                            ? "bg-gray-900 text-white shadow-md"
                            : "bg-white/80 text-gray-700 hover:bg-gray-100 border border-gray-100"
                        }`}
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
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M9.5 9.5h4.5a2 2 0 0 1 0 4h-4.5"></path>
                          <path d="M9.5 14.5h4.5a2 2 0 0 1 0 4h-4.5"></path>
                          <line x1="9.5" y1="8" x2="9.5" y2="16"></line>
                        </svg>
                        Crypto
                      </motion.button>
                    </div>

                    {paymentMethod === "card" ? (
                      <div className="relative">
                        <select className="w-full text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all shadow-sm">
                          <option>Select card</option>
                          <option>Visa ending in 4242</option>
                          <option>Mastercard ending in 5678</option>
                          <option>Add new card</option>
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/80 border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                        <div className="rounded-lg bg-white p-2 border border-gray-100 shadow-sm">
                          <IconInnerShadowTop />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Paycrypt
                          </div>
                          <div className="text-xs text-gray-500">
                            Pay with cryptocurrency
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <motion.button
                      onClick={handleMakePayment}
                      className="w-full bg-black hover:bg-gray-900 text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Make payment
                    </motion.button>

                    <p className="text-center text-xs text-gray-400 mt-5">
                      Once transaction is confirmed, you will receive a link to
                      premium content shared by {metadata.user.name}
                    </p>

                    <div className="flex items-center justify-center mt-6 text-xs text-gray-500">
                      <div className="flex items-center justify-center bg-gray-900 rounded-full p-0.5 mr-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Secured by{" "}
                      <span className="ml-1 font-medium text-gray-900">
                        {metadata.user.company}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="crypto-selection"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                  layout
                >
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={handleBack}
                      className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 12H5"></path>
                        <path d="M12 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <h2 className="text-lg font-medium text-gray-900">
                      Choose Cryptocurrency
                    </h2>

                    <div className="w-8"></div>
                  </div>

                  {/* Add the test mode toggle */}
                  {/* <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Test Mode</div>
                    <button
                      onClick={() => setIsTestMode(!isTestMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isTestMode ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isTestMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div> */}

                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Amount</div>
                    <div className="flex flex-col">
                      <div className="text-xl font-semibold text-gray-900">
                        ${metadata.user.amount}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 mb-6 space-y-3 flex flex-col justify-center">
                    {cryptoCoins.map((coin) => (
                      <motion.button
                        key={coin.id}
                        onClick={() =>
                          !coin.disabled &&
                          setSelectedCrypto(coin.id as CryptoType)
                        }
                        disabled={coin.disabled}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                          selectedCrypto === coin.id
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-100 bg-white"
                        } ${
                          coin.disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center min-w-10 h-10 rounded-full bg-white">
                            {coin.icon}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-gray-900">
                              {coin.name}
                              {coin.disabled && (
                                <span className="ml-2 text-gray-400">
                                  (Coming soon)
                                </span>
                              )}
                              {coin.id === "ethereum" && (
                                <span className="ml-2 text-xs text-gray-400">
                                  (Sepolia testnet)
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {coin.value}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            selectedCrypto === coin.id
                              ? "bg-gray-900"
                              : "border border-gray-200"
                          }`}
                        >
                          {selectedCrypto === coin.id && (
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
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <motion.button
                      disabled={!selectedCrypto || isProcessing}
                      onClick={handleProceedPayment}
                      className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
                        selectedCrypto && !isProcessing
                          ? "bg-black hover:bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className="animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 10l5 5-5 5"></path>
                            <path d="M4 4v7a4 4 0 0 1 4 4h12"></path>
                          </svg>
                          Proceed with{" "}
                          {selectedCrypto
                            ? selectedCrypto === "ethereum"
                              ? "Ethereum"
                              : selectedCrypto === "bitcoin"
                              ? "Bitcoin"
                              : "Solana"
                            : "Payment"}
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-xs text-gray-400 mt-5">
                      You'll be redirected to complete the cryptocurrency
                      transaction.
                    </p>

                    <div className="flex items-center justify-center mt-6 text-xs text-gray-500">
                      <div className="flex items-center justify-center bg-gray-900 rounded-full p-0.5 mr-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      Secured by{" "}
                      <span className="ml-1 font-medium text-gray-900">
                        {metadata.user.company}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Page;
