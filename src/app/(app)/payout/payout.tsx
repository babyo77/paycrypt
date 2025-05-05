"use client";
import { useUser } from "@/app/provider/user-provider";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Wallet, Copy, ExternalLink, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define type for balance data
interface BalanceData {
  total_eth_balance: string | null;
  total_eth_usd: string | null;
  total_sol_balance: string | null;
  total_sol_usd: string | null;
  total_usdc_ethereum_balance: string | null;
  total_usdc_ethereum_usd: string | null;
  total_usdc_solana_balance: string | null;
  total_usdc_solana_usd: string | null;
}

// Define type for payout history based on the new data structure
interface PayoutHistory {
  id: string;
  merchant_id: string;
  sol_amount: number;
  eth_amount: number;
  processed_sol_amount: number;
  processed_eth_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Card component for displaying cryptocurrency amount
interface CryptoAmountProps {
  coinSymbol: string;
  amount: string | null;
  usdAmount: string | null;
  iconPath: string;
}

// Move formatting functions to outer scope so they can be used directly
const formatValue = (value: string | null): string => {
  if (value === null) return "0.000";
  return Number(value).toFixed(6);
};

// Format USD value
const formatUsd = (value: string | null): string => {
  if (value === null) return "0.000";
  return `$${Number(value).toFixed(2)}`;
};

const CryptoAmount: React.FC<CryptoAmountProps> = ({
  coinSymbol,
  amount,
  usdAmount,
  iconPath,
}) => {
  return (
    <div className="flex items-center p-1.5 bg-white rounded-md border border-gray-100">
      <div className="flex-shrink-0 mr-1.5">
        <img src={iconPath} alt={coinSymbol} width={16} height={16} />
      </div>
      <div className="flex-grow">
        <p className="text-xs font-medium">
          {formatValue(amount)}
          <span className="text-gray-500 text-xs ml-0.5">{coinSymbol}</span>
        </p>
      </div>
      <div className="text-green-600 font-medium text-xs">
        {formatUsd(usdAmount)}
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

// Get status badge style
const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "paid":
      return { color: "bg-green-100 text-green-700", icon: "✓ " };
    case "pending":
    case "processing":
      return { color: "bg-yellow-100 text-yellow-700", icon: "⧖ " };
    case "partially_completed":
      return { color: "bg-red-100 text-red-700", icon: "◑ " };
    case "failed":
    case "cancelled":
      return { color: "bg-red-100 text-red-700", icon: "✕ " };
    default:
      return { color: "bg-gray-100 text-gray-700", icon: "• " };
  }
};

// Format date helper
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "0.000";
  try {
    return format(new Date(dateString), "MMMM d, yyyy");
  } catch (e) {
    return "Invalid Date";
  }
};

// Format crypto amount
const formatCryptoAmount = (amount: number): string => {
  return amount.toFixed(6);
};

// Calculate total USD balance
const calculateTotalBalance = (balanceData: BalanceData | null): number => {
  if (!balanceData) return 0;

  const eth = Number(balanceData.total_eth_usd || 0);
  const sol = Number(balanceData.total_sol_usd || 0);
  const usdcEth = Number(balanceData.total_usdc_ethereum_usd || 0);
  const usdcSol = Number(balanceData.total_usdc_solana_usd || 0);

  return eth + sol + usdcEth + usdcSol;
};

function PayoutPage() {
  const { userData } = useUser();
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ethAddress, setEthAddress] = useState("");
  const [solAddress, setSolAddress] = useState("");

  // CDN base URL for cryptocurrency icons
  const iconBaseUrl =
    "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color";

  // Handle dialog open state changes
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  useEffect(() => {
    if (!userData) return;

    const fetchPayouts = async () => {
      try {
        if (userData?.payout_eth_address && userData?.payout_sol_address) {
          setEthAddress(userData.payout_eth_address);
          setSolAddress(userData.payout_sol_address);
        }
        setIsLoading(true);
        const res = await api.get("/payout/");

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

  useEffect(() => {
    if (!userData) return;

    const fetchPayoutHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const res = await api.get("/payout/pending");

        // Check if response has the expected format
        if (
          res.data &&
          typeof res.data === "object" &&
          "payout" in res.data &&
          Array.isArray(res.data.payout)
        ) {
          setPayoutHistory(res.data.payout as PayoutHistory[]);
        } else if (res.data && Array.isArray(res.data)) {
          setPayoutHistory(res.data as PayoutHistory[]);
        } else {
          setPayoutHistory([]);
        }
      } catch (err) {
        setPayoutHistory([]);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchPayoutHistory();
  }, [userData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Replace alert with toast notification
    toast.success("Copied to clipboard");
  };

  const handleGetPayout = async () => {
    if (!userData) return;

    // Validate addresses - require at least one address
    if (!ethAddress.trim() && !solAddress.trim()) {
      toast.error(
        "At least one wallet address (Ethereum or Solana) is required"
      );
      return;
    }

    try {
      setIsPaying(true);
      const res = await api.post("/payout/", {
        ethereum_address: ethAddress.trim() || undefined,
        solana_address: solAddress.trim() || undefined,
      });

      // Close dialog
      setIsDialogOpen(false);

      // Refetch the data to update balances
      const updatedData = await api.get("/payout/");
      setBalanceData(updatedData.data as BalanceData);

      // Refresh history data
      const historyData = await api.get("/payout/pending");
      if (
        historyData.data &&
        typeof historyData.data === "object" &&
        "payout" in historyData.data &&
        Array.isArray(historyData.data.payout)
      ) {
        setPayoutHistory(historyData.data.payout as PayoutHistory[]);
      } else if (historyData.data && Array.isArray(historyData.data)) {
        setPayoutHistory(historyData.data as PayoutHistory[]);
      } else {
        setPayoutHistory([]);
      }
    } catch (err) {
      console.error("Error requesting payout:", err);
    } finally {
      setIsPaying(false);
    }
  };

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">
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

  // Calculate total balance
  const totalBalance = calculateTotalBalance(balanceData);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-1.5">
        <div className="flex flex-col gap-3 py-3 md:gap-4 md:py-4">
          <Tabs
            defaultValue="payout"
            className="w-full flex-col justify-start gap-4"
          >
            <div className="flex items-center justify-between px-4 lg:px-6">
              <div className="text-xl font-semibold">Your Payouts</div>
            </div>

            <TabsContent
              value="payout"
              className="relative flex flex-col gap-3 overflow-auto px-4 lg:px-6"
            >
              {/* Combined balance and networks card */}
              <div className="mb-3">
                <div className="bg-white rounded-md border border-gray-200 overflow-hidden w-full">
                  <div className="bg-gray-50 p-2 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex flex-col">
                      <h2 className=" font-medium text-gray-600">
                        Available Balance
                      </h2>
                      <div className="text-xl font-semibold mt-0.5">
                        ${totalBalance.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDialogOpenChange(true)}
                      disabled={isPaying}
                      variant="default"
                    >
                      <Wallet className="mr-1 h-3 w-3" />
                      {isPaying ? "Processing..." : "Withdraw"}
                    </Button>
                  </div>
                  <div className="p-2 space-y-1.5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      <div className="flex items-center p-1.5 bg-white rounded-md border border-gray-100">
                        <div className="flex-shrink-0 mr-1.5">
                          <img
                            src={`${iconBaseUrl}/eth.png`}
                            alt="ETH"
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className="flex-grow">
                          <p className=" font-medium">
                            {formatValue(
                              balanceData?.total_eth_balance || null
                            )}
                            <span className="text-gray-500  ml-0.5">ETH</span>
                          </p>
                        </div>
                        <div className="text-green-600 font-medium ">
                          {formatUsd(balanceData?.total_eth_usd || null)}
                        </div>
                      </div>

                      <div className="flex items-center p-1.5 bg-white rounded-md border border-gray-100">
                        <div className="flex-shrink-0 mr-1.5">
                          <img
                            src={`${iconBaseUrl}/sol.png`}
                            alt="SOL"
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">
                            {formatValue(
                              balanceData?.total_sol_balance || null
                            )}
                            <span className="text-gray-500 ml-0.5">SOL</span>
                          </p>
                        </div>
                        <div className="text-green-600 font-medium">
                          {formatUsd(balanceData?.total_sol_usd || null)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      <div className="flex items-center p-1.5 bg-white rounded-md border border-gray-100">
                        <div className="flex-shrink-0 mr-1.5">
                          <img
                            src={`${iconBaseUrl}/usdc.png`}
                            alt="USDC"
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">
                            {formatValue(
                              balanceData?.total_usdc_ethereum_balance || null
                            )}
                            <span className="text-gray-500 ml-0.5">
                              USDC (ETH)
                            </span>
                          </p>
                        </div>
                        <div className="text-green-600 font-medium">
                          {formatUsd(
                            balanceData?.total_usdc_ethereum_usd || null
                          )}
                        </div>
                      </div>

                      <div className="flex items-center p-1.5 bg-white rounded-md border border-gray-100">
                        <div className="flex-shrink-0 mr-1.5">
                          <img
                            src={`${iconBaseUrl}/usdc.png`}
                            alt="USDC"
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">
                            {formatValue(
                              balanceData?.total_usdc_solana_balance || null
                            )}
                            <span className=" text-gray-500 ml-0.5">
                              USDC (SOL)
                            </span>
                          </p>
                        </div>
                        <div className="text-green-600 font-medium">
                          {formatUsd(
                            balanceData?.total_usdc_solana_usd || null
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Withdrawal Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Withdraw Earnings</DialogTitle>
                    <DialogDescription>
                      Enter your wallet addresses to receive your funds.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 items-start">
                    <div className="flex items-center gap-2 w-full">
                      <label
                        htmlFor="eth-address"
                        className="text-right font-medium whitespace-nowrap"
                      >
                        ETH Address
                      </label>
                      <div className="w-full">
                        <Input
                          id="eth-address"
                          value={ethAddress}
                          onChange={(e) => setEthAddress(e.target.value)}
                          placeholder="Enter Ethereum Address"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <label
                        htmlFor="sol-address"
                        className="text-right font-medium whitespace-nowrap"
                      >
                        SOL Address
                      </label>
                      <div className="w-full">
                        <Input
                          id="sol-address"
                          value={solAddress}
                          onChange={(e) => setSolAddress(e.target.value)}
                          placeholder="Enter Solana Address"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleGetPayout}
                      disabled={isPaying}
                    >
                      {isPaying ? "Processing..." : "Withdraw"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Payout History */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-medium">Payout History</h2>
                </div>

                {isHistoryLoading ? (
                  <div className="w-full flex justify-center p-6">
                    <div className="h-6 w-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : payoutHistory.length === 0 ? (
                  <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
                    <div className="flex flex-col items-center gap-2">
                      <Wallet className="size-10 text-gray-200" />
                      <h3 className="font-medium">No payout history</h3>
                      <p className="text-gray-500 text-sm">
                        Your completed payouts will appear here
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border ">
                    <Table>
                      <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="w-1/5 text-xs">
                            Transaction ID
                          </TableHead>
                          <TableHead className="text-xs">ETH Amount</TableHead>
                          <TableHead className="text-xs">SOL Amount</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="w-8"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payoutHistory.map((payout) => {
                          const statusStyle = getStatusBadgeVariant(
                            payout.status
                          );
                          return (
                            <TableRow
                              key={payout.id}
                              className="hover:bg-muted/50 group transition-colors"
                            >
                              <TableCell className=" text-sm">
                                {payout.id.substring(0, 23)}...
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <div className="flex items-center text-sm">
                                    <img
                                      src={`${iconBaseUrl}/eth.png`}
                                      alt="ETH"
                                      className="w-4 h-4 mr-1"
                                    />
                                    <span className="font-medium">
                                      {formatCryptoAmount(payout.eth_amount)}
                                    </span>
                                    <span className="text-gray-500 ml-1">
                                      ETH
                                    </span>
                                  </div>
                                  <div className="flex items-center mt-0.5 ml-5 text-xs">
                                    <span
                                      className={
                                        payout.processed_eth_amount > 0
                                          ? "text-green-600"
                                          : "text-gray-400"
                                      }
                                    >
                                      Processed:{" "}
                                      {formatCryptoAmount(
                                        payout.processed_eth_amount
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <div className="flex items-center text-sm">
                                    <img
                                      src={`${iconBaseUrl}/sol.png`}
                                      alt="SOL"
                                      className="w-4 h-4 mr-1"
                                    />
                                    <span className="font-medium">
                                      {formatCryptoAmount(payout.sol_amount)}
                                    </span>
                                    <span className="text-gray-500 ml-1">
                                      SOL
                                    </span>
                                  </div>
                                  <div className="flex items-center mt-0.5 ml-5 text-xs">
                                    <span
                                      className={
                                        payout.processed_sol_amount > 0
                                          ? "text-green-600"
                                          : "text-gray-400"
                                      }
                                    >
                                      Processed:{" "}
                                      {formatCryptoAmount(
                                        payout.processed_sol_amount
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    payout.status.toLowerCase() ===
                                      "completed" ||
                                    payout.status.toLowerCase() === "paid"
                                      ? "default"
                                      : payout.status.toLowerCase() ===
                                          "pending" ||
                                        payout.status.toLowerCase() ===
                                          "processing"
                                      ? "secondary"
                                      : payout.status.toLowerCase() ===
                                        "partially_completed"
                                      ? "destructive"
                                      : "destructive"
                                  }
                                  className={`text-xs whitespace-nowrap ${
                                    payout.status.toLowerCase() ===
                                      "completed" ||
                                    payout.status.toLowerCase() === "paid"
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : payout.status.toLowerCase() ===
                                          "pending" ||
                                        payout.status.toLowerCase() ===
                                          "processing"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                      : payout.status.toLowerCase() ===
                                        "partially_completed"
                                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                                      : ""
                                  }`}
                                >
                                  {payout.status
                                    .replace(/_/g, " ")
                                    .toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                <div className="flex flex-col">
                                  <span className="text-sm">
                                    {format(
                                      new Date(payout.created_at),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {format(
                                      new Date(payout.created_at),
                                      "h:mm a"
                                    )}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="data-[state=open]:bg-muted text-muted-foreground flex size-8 transition-opacity"
                                      size="icon"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => copyToClipboard(payout.id)}
                                    >
                                      <Copy className="mr-2 h-4 w-4" />
                                      <span>Copy Transaction ID</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default PayoutPage;
