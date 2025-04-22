"use client";
import React, { useState, use } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { NotFound } from "./components/sponsor-comp";

type sponsor = {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  amount: number;
  upiId: string;
};
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

function Page({ params }: PageProps) {
  const { id } = use(params);

  const [metadata] = useState<sponsor>({
    name: "IdkWhy",
    title: "Founder",
    bio: "I don't know why I'm here",
    avatar:
      "https://logo-images.b-cdn.net/Screenshot%202025-04-07%20at%201.40.34%E2%80%AFAM.png",
    amount: 100,
    upiId: "meyank24-2@oksbi",
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [customAmount, setCustomAmount] = useState(metadata.amount);

  const upiId = metadata.upiId;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(
    upiId
  )}%26am%3D${customAmount}.00%26cu%3DINR%26tn%3D${encodeURIComponent(
    metadata?.name
  )}`;

  const [qrLoading, setQrLoading] = useState(true);

  const handleMakePayment = () => {
    setShowQRCode(true);
  };

  const handleBack = () => {
    setShowQRCode(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = parseInt(value) || 0;

    if (numValue <= 999999999999) {
      setCustomAmount(numValue);
    }
  };

  const handleQrLoaded = () => {
    setQrLoading(false);
  };

  if (id !== "idkwhy") {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Glitter background gradient effect - changed to yellow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/50">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(254,243,199,0.7)_0%,rgba(255,255,255,0)_60%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(254,243,199,0.6)_0%,rgba(255,255,255,0)_60%)]"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl max-w-md w-full border relative overflow-hidden"
        layout
        layoutId="container"
      >
        {/* Yellow gradient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/20 via-white/10 to-amber-50/30 pointer-events-none"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-200/20 to-white/50 rounded-3xl blur-md opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-50/30 to-transparent"></div>

        {/* Reflective border effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/30 pointer-events-none"></div>

        {/* Card inner glow */}
        <div className="absolute -inset-px bg-gradient-to-r from-amber-100/30 via-white/80 to-amber-100/30 rounded-3xl blur-md opacity-70"></div>

        {/* Glitter sparkles with yellow tint */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-amber-50 rounded-full shadow-lg shadow-amber-100/50 opacity-90"></div>
        <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-amber-100/50 opacity-80"></div>
        <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-amber-50 rounded-full shadow-lg shadow-amber-100/50 opacity-70"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-white rounded-full shadow-lg shadow-amber-100/50 opacity-90"></div>

        {/* Subtle yellow orb animations */}
        <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-amber-50 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative z-10 overflow-hidden p-6 md:p-8">
          <motion.div className="w-full" layout layoutId="content">
            <AnimatePresence mode="wait" initial={false}>
              {!showQRCode ? (
                <motion.div
                  key="payment-view"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                  layout
                >
                  <div className="flex flex-col items-center mb-5">
                    <div className="size-20 rounded-full overflow-hidden mb-3 border bg-white">
                      <Image
                        src={metadata?.avatar}
                        alt={metadata?.name}
                        width={500}
                        height={500}
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mb-0.5">
                      {metadata?.name}
                    </h2>
                    <p className="text-sm text-gray-500">{metadata?.title}</p>
                  </div>

                  {/* Bio section - changed to yellow */}
                  <div className="mb-6 border border-amber-200/50 bg-amber-50/50 p-4 rounded-xl">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {metadata?.bio}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-1">Pay</div>
                    <div className="relative">
                      <div className="absolute -ml-2  inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500 text-2xl">₹</span>
                      </div>
                      <input
                        type="text"
                        value={customAmount}
                        onChange={handleAmountChange}
                        className="block w-full pl-6 pr-4 py-1 text-3xl font-semibold text-gray-900 bg-transparent border-gray-200 focus:outline-none focus:border-amber-400"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[100, 200, 500, 1000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setCustomAmount(amount)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-sm font-medium transition-colors ${
                            customAmount === amount
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
                          }`}
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-3">
                      to {metadata?.name}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2 flex justify-between items-center">
                      <span>Payment method</span>
                    </div>

                    <div className="bg-white/80 border border-amber-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                      <div className="rounded-lg bg-white p-2.5 border border-gray-100 shadow-sm">
                        {/* Updated UPI icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="20"
                          viewBox="0 0 120 60"
                          fillRule="evenodd"
                        >
                          <path
                            d="M95.678 42.9L110 29.835l-6.784-13.516z"
                            fill="#097939"
                          />
                          <path
                            d="M90.854 42.9l14.322-13.065-6.784-13.516z"
                            fill="#ed752e"
                          />
                          <path
                            d="M22.41 16.47l-6.03 21.475 21.407.15 5.88-21.625h5.427l-7.05 25.14c-.27.96-1.298 1.74-2.295 1.74H12.31c-1.664 0-2.65-1.3-2.2-2.9l6.724-23.98zm66.182-.15h5.427l-7.538 27.03h-5.58zM49.698 27.582l27.136-.15 1.81-5.707H51.054l1.658-5.256 29.4-.27c1.83-.017 2.92 1.4 2.438 3.167L81.78 29.49c-.483 1.766-2.36 3.197-4.19 3.197H53.316L50.454 43.8h-5.28z"
                            fill="#747474"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          UPI Payment
                        </div>
                        <div className="text-xs text-gray-500">
                          Pay with any UPI app
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <motion.button
                      onClick={handleMakePayment}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                    >
                      {/* New sponsor icon - heart/donation icon */}
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
                        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                      </svg>
                      Sponsor me
                    </motion.button>

                    {/* <p className="text-center text-xs text-gray-400 mt-5">
                      Sponsor {metadata.user.name}.
                    </p> */}

                    {/* <div className="flex items-center justify-center mt-6 text-xs text-gray-500">
                      <div className="flex items-center justify-center bg-amber-500 rounded-full p-0.5 mr-1.5">
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
                    </div> */}
                  </div>
                </motion.div>
              ) : (
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
                      Pay with UPI
                    </h2>
                    <div className="w-8"></div>
                  </div>

                  <div className="flex flex-col items-center justify-center mb-6">
                    <div
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 relative"
                      style={{ width: 300, height: 300 }}
                    >
                      {qrLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg">
                          <div className="relative w-12 h-12">
                            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-amber-100"></div>
                            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                          </div>
                        </div>
                      )}
                      <Image
                        src={qrCodeUrl}
                        alt="UPI QR Code"
                        width={400}
                        height={400}
                        className={`rounded-lg transition-opacity ${
                          qrLoading ? "opacity-0" : "opacity-100"
                        }`}
                        onLoad={handleQrLoaded}
                        priority
                      />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      Scan with any UPI app
                    </p>
                  </div>

                  <div className="mt-4 w-full">
                    {/* <div className="text-xs text-gray-500 mb-1">UPI ID</div>
                    <div className="relative mb-2">
                      <div className="p-3 bg-gray-50 rounded-lg break-all text-xs text-gray-600 font-mono">
                        {metadata.user.upiId}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(metadata.user.upiId);
                          setCopyStatus(true);
                          setTimeout(() => setCopyStatus(false), 2000);
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
                    </div> */}

                    {/* Simple thank you text */}
                    <p className="text-center text-xs text-gray-400 font-medium mt-6">
                      Thank you for sponsoring
                      <span className="text-amber-600"> {metadata?.name}</span>
                    </p>
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
