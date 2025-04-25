"use client";
import { api } from "@/lib/utils";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
  IconDotsVertical,
  IconCopy,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Transaction {
  id: string;
  origin: string;
  merchant_id: string;
  currency: string;
  amount: number;
  amount_usd: number;
  tx_hash: string;
  address: string;
  sender_address: string;
  sender_email: string;
  status: string;
  network: string;
  mode: string;
  payment_link_id: string;
  confirmed_at: string | null;
  created_at: string;
  expires_at: string;
}

interface PaymentLink {
  id: string;
  merchant_id: string;
  title: string;
  amount: number;
  link_type: string;
  description: string;
  redirect_url: string;
  currency: string | null;
  collect_name: boolean | null;
  collect_email: boolean | null;
  collect_phone: boolean | null;
  collect_billing_details: boolean | null;
  collect_shipping_details: boolean | null;
  allow_custom_fields: boolean | null;
  allow_promotional_code: boolean | null;
  call_to_action_label: string | null;
  webhook: string | null;
  transactions: Transaction[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  api_key: string;
  payment_link: PaymentLink;
  status: string;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "N/A";
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "N/A";
    return format(date, "MMM d, yyyy h:mm:ss a");
  } catch (error) {
    return "N/A";
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return {
        color: "bg-green-100 text-green-800",
        icon: <IconCircleCheckFilled className="mr-1 h-4 w-4 fill-green-500" />,
      };
    case "PENDING":
      return {
        color: "bg-orange-100 text-orange-800",
        icon: <IconLoader className="mr-1 h-4 w-4 text-orange-500" />,
      };
    case "EXPIRED":
      return {
        color: "bg-red-100 text-red-800",
        icon: <IconCircleXFilled className="mr-1 h-4 w-4 fill-red-500" />,
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        icon: <IconLoader className="mr-1 h-4 w-4" />,
      };
  }
}

function PaymentLinkHistoryPage() {
  const params = useParams<{ link: string }>();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse>(
        `/payment-links/${params.link}`
      );
      if (response.status === 200 && response.data) {
        setData(response.data);
      }
    } catch (err) {
      setError("Failed to fetch payment link data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [params.link]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy");
      }
    );
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 leading-tight font-medium text-muted-foreground">
        Error: {error}
      </div>
    );
  if (!data)
    return (
      <div className="text-center py-8 leading-tight font-medium text-muted-foreground">
        No data available
      </div>
    );

  const { payment_link } = data;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
          >
            <TabsContent
              value="outline"
              className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
              <div>
                <h1 className="text-2xl font-bold">{payment_link.title}</h1>
                <p className="text-muted-foreground text-sm">
                  {payment_link.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="text-lg font-medium">
                    ${payment_link.amount.toFixed(2)}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Link Type</div>
                  <div className="text-lg font-medium">
                    {payment_link.link_type}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">
                    Created At
                  </div>
                  <div className="text-lg font-medium">
                    {formatDate(payment_link.created_at)}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Transactions</h2>

                {payment_link.transactions &&
                payment_link.transactions.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Currency</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Sender Email</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Expires At</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payment_link.transactions.map((transaction) => {
                          const statusStyle = getStatusBadgeVariant(
                            transaction.status
                          );
                          return (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">
                                {transaction.id.slice(0, 8)}...
                                {transaction.id.slice(-6)}
                              </TableCell>
                              <TableCell>
                                ${transaction.amount_usd.toFixed(2)} (
                                {parseFloat(transaction.amount.toFixed(4))}{" "}
                                {transaction.currency})
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="text-muted-foreground px-1.5"
                                >
                                  {transaction.currency}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`flex items-center px-2 py-1 ${statusStyle.color}`}
                                >
                                  {statusStyle.icon}
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {transaction.sender_email || "N/A"}
                              </TableCell>
                              <TableCell>
                                {formatDate(transaction.created_at)}
                              </TableCell>
                              <TableCell>
                                {formatDate(transaction.expires_at)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <IconDotsVertical className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        copyToClipboard(transaction.id)
                                      }
                                    >
                                      <IconCopy className="mr-2 h-4 w-4" />
                                      <span>Copy ID</span>
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
                ) : (
                  <div className="text-center p-6 border rounded-lg">
                    No transactions found for this payment link
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

export default PaymentLinkHistoryPage;
