"use client";
import { useUser } from "@/app/provider/user-provider";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/utils";
import React, { useEffect, useState } from "react";

// Define type for balance data
interface BalanceData {
  total_eth_balance: number | null;
  total_eth_usd: number | null;
  total_sol_balance: number | null;
  total_sol_usd: number | null;
  total_usdc_ethereum_balance: number | null;
  total_usdc_ethereum_usd: number | null;
  total_usdc_solana_balance: number | null;
  total_usdc_solana_usd: number | null;
  total_usdt_ethereum_balance: number | null;
  total_usdt_ethereum_usd: number | null;
  total_usdt_solana_balance: number | null;
  total_usdt_solana_usd: number | null;
}

// Card component for displaying cryptocurrency amount
interface CryptoAmountProps {
  coinSymbol: string;
  amount: number | null;
  iconPath: string;
}

const CryptoAmount: React.FC<CryptoAmountProps> = ({
  coinSymbol,
  amount,
  iconPath,
}) => {
  const formatValue = (value: number | null): string => {
    if (value === null) return "N/A";
    return value.toFixed(6);
  };

  return (
    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100">
      <div className="flex-shrink-0 mr-3">
        <img src={iconPath} alt={coinSymbol} width={24} height={24} />
      </div>
      <div className="flex-grow">
        <p className="font-medium">
          {formatValue(amount)}{" "}
          <span className="text-gray-500 text-sm">{coinSymbol}</span>
        </p>
      </div>
    </div>
  );
};

// Network group component
interface NetworkGroupProps {
  networkName: string;
  networkIcon: string;
  children: React.ReactNode;
}

const NetworkGroup: React.FC<NetworkGroupProps> = ({
  networkName,
  networkIcon,
  children,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center">
        <img
          src={networkIcon}
          alt={networkName}
          width={20}
          height={20}
          className="mr-2"
        />
        <h2 className="font-semibold text-gray-700">{networkName}</h2>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
};

// Loading skeleton component
const SkeletonGroup = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse w-full">
    <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center">
      <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
      <div className="h-5 bg-gray-200 rounded w-24"></div>
    </div>
    <div className="p-4 space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center p-3 bg-white rounded-lg border border-gray-100 w-full"
        >
          <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
          <div className="h-5 bg-gray-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  </div>
);

function PayoutPage() {
  const { userData } = useUser();
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // CDN base URL for cryptocurrency icons
  const iconBaseUrl =
    "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color";

  useEffect(() => {
    if (!userData) return;

    const fetchPayouts = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/payout/");
        // Type assertion to ensure the response data matches our expected format
        setBalanceData(res.data as BalanceData);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching payout data:", err);
        setError("Failed to load payout data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayouts();
  }, [userData]);

  const handleGetPayout = async () => {
    if (!userData) return;

    try {
      setIsPaying(true);
      const res = await api.post("/payout/request", {});
      alert("Payout request submitted successfully!");
      console.log(res.data);
      // Refetch the data to update balances
      const updatedData = await api.get("/payout/");
      setBalanceData(updatedData.data as BalanceData);
    } catch (err) {
      console.error("Error requesting payout:", err);
      alert("Failed to process payout request. Please try again later.");
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="space-y-6">
          <SkeletonGroup />
          <SkeletonGroup />
          <div className="h-10 bg-gray-200 rounded w-full max-w-xs mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          <p>{error}</p>
          <button
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!balanceData) {
    return (
      <div className="w-full p-6 text-center">
        <p className="text-gray-500">No balance data available</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 relative">
      <div className="space-y-6 w-full">
        <NetworkGroup
          networkName="Ethereum Network"
          networkIcon={`${iconBaseUrl}/eth.png`}
        >
          <CryptoAmount
            coinSymbol="ETH"
            amount={balanceData.total_eth_balance}
            iconPath={`${iconBaseUrl}/eth.png`}
          />

          <CryptoAmount
            coinSymbol="USDC"
            amount={balanceData.total_usdc_ethereum_balance}
            iconPath={`${iconBaseUrl}/usdc.png`}
          />

          <CryptoAmount
            coinSymbol="USDT"
            amount={balanceData.total_usdt_ethereum_balance}
            iconPath={`${iconBaseUrl}/usdt.png`}
          />
        </NetworkGroup>

        {/* Solana Network Group */}
        <NetworkGroup
          networkName="Solana Network"
          networkIcon={`${iconBaseUrl}/sol.png`}
        >
          <CryptoAmount
            coinSymbol="SOL"
            amount={balanceData.total_sol_balance}
            iconPath={`${iconBaseUrl}/sol.png`}
          />

          <CryptoAmount
            coinSymbol="USDC"
            amount={balanceData.total_usdc_solana_balance}
            iconPath={`${iconBaseUrl}/usdc.png`}
          />

          <CryptoAmount
            coinSymbol="USDT"
            amount={balanceData.total_usdt_solana_balance}
            iconPath={`${iconBaseUrl}/usdt.png`}
          />
        </NetworkGroup>

        {/* Get Payout Button */}
        <div className="flex justify-start w-full">
          <Button onClick={handleGetPayout} disabled>
            {isPaying ? "Processing..." : "Get Payout"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PayoutPage;
