"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type PageProps = {
  params: { link: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Transaction schema
const transactionSchema = z.object({
  id: z.string(),
  origin: z.string(),
  merchant_id: z.string(),
  currency: z.string(),
  amount: z.number(),
  amount_usd: z.number(),
  tx_hash: z.string().nullable(),
  address: z.string(),
  sender_address: z.string().optional(),
  sender_email: z.string().optional(),
  status: z.string(),
  network: z.string(),
  mode: z.string(),
  payment_link_id: z.string(),
  confirmed_at: z.string().nullable(),
  created_at: z.string(),
  expires_at: z.string(),
});

// Link schema to type the API response
const linkSchema = z.object({
  id: z.string(),
  merchant_id: z.string(),
  title: z.string(),
  amount: z.number(),
  description: z.string(),
  redirect_url: z.string().optional(),
  is_active: z.boolean(),
  link_type: z.string(),
  transactions: z.array(transactionSchema).nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// API response schema
const apiResponseSchema = z.object({
  payment_link: linkSchema,
  status: z.string(),
});

type LinkType = z.infer<typeof linkSchema>;
type TransactionType = z.infer<typeof transactionSchema>;

export default function LinkHistoryPage({ params }: PageProps) {
  const router = useRouter();
  const linkId = params.link;
  const [linkData, setLinkData] = useState<LinkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/links/${linkId}`);

        if (response.status === 200 && response.data) {
          // Parse the data using the schema to ensure type safety
          const parsedData = apiResponseSchema.safeParse(response.data);

          if (parsedData.success) {
            setLinkData(parsedData.data.payment_link);
          } else {
            console.error("Invalid data format:", parsedData.error);
            setError("Invalid data format received from server");
          }
        }
      } catch (err) {
        console.error("Failed to fetch link details:", err);
        setError("Failed to load link details");
      } finally {
        setLoading(false);
      }
    };

    fetchLinkDetails();
  }, [linkId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-xl font-medium mb-4">
            Loading link details...
          </div>
          <div className="animate-pulse h-2 bg-muted rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-xl font-medium mb-4 text-red-500">{error}</div>
          <p className="text-muted-foreground mb-6">
            There was a problem retrieving the link details.
          </p>
          <Button onClick={() => router.back()} className="min-w-[120px]">
            Go Back
          </Button>
        </div>
      </div>
    );

  if (!linkData)
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-xl font-medium mb-4">No link data found</div>
          <p className="text-muted-foreground mb-6">
            The link you're looking for doesn't exist or has been deleted.
          </p>
          <Button
            onClick={() => router.push("/links/history")}
            className="min-w-[120px]"
          >
            Back to Links
          </Button>
        </div>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{linkData.title}</h1>

      {/* Link Details on top, full width */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Link Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p>
              <span className="font-medium">Amount:</span> $
              {linkData.amount.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <Badge variant={linkData.is_active ? "default" : "outline"}>
                {linkData.is_active ? "Active" : "Inactive"}
              </Badge>
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">Type:</span>{" "}
              <Badge variant="secondary">{linkData.link_type}</Badge>
            </p>
            <p>
              <span className="font-medium">Created:</span>{" "}
              {format(parseISO(linkData.created_at || ""), "PPpp")}
            </p>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <p>
              <span className="font-medium">Description:</span>{" "}
              {linkData.description}
            </p>
            {linkData.redirect_url && (
              <p>
                <span className="font-medium">Redirect URL:</span>{" "}
                {linkData.redirect_url}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Transactions table below, full width */}
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-2">Transactions</h2>
        {linkData.transactions && linkData.transactions.length > 0 ? (
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">Amount</TableHead>
                  <TableHead className="w-[120px]">Network</TableHead>
                  <TableHead className="w-[150px]">Sender</TableHead>
                  <TableHead className="w-[180px]">Created</TableHead>
                  <TableHead className="w-[180px]">Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkData.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono">
                      {transaction.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "COMPLETED"
                            ? "default"
                            : transaction.status === "PENDING"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.amount} {transaction.currency}
                      <div className="text-xs text-muted-foreground">
                        ${transaction.amount_usd}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.network}
                      <div className="text-xs text-muted-foreground">
                        {transaction.mode}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.sender_email || "N/A"}</TableCell>
                    <TableCell>
                      {format(parseISO(transaction.created_at), "PPp")}
                    </TableCell>
                    <TableCell>
                      {format(parseISO(transaction.expires_at), "PPp")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-lg p-4 text-center text-muted-foreground">
            No transactions found for this link
          </div>
        )}
      </div>
    </div>
  );
}
