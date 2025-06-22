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
  IconEdit,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { uploadFile } from "@/lib/utils";
import Image from "next/image";

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
  product_images?: string[];
}

interface ApiResponse {
  api_key: string;
  payment_link: PaymentLink;
  status: string;
}

// CDN base URL for cryptocurrency icons
const iconBaseUrl =
  "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color";

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
  const [updating, setUpdating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<PaymentLink> | null>(
    null
  );
  const [customerInfoOpen, setCustomerInfoOpen] = useState(false);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [productImages, setProductImages] = useState<
    {
      file: File | null;
      url: string | null;
      uploading: boolean;
    }[]
  >([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse>(
        `/payment-links/${params.link}`
      );
      if (response.status === 200 && response.data) {
        setData(response.data);
        const imgs = response.data.payment_link.product_images || [];
        setProductImages(
          imgs.map((url: string) => ({ file: null, url, uploading: false }))
        );
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

  const openEditModal = () => {
    if (!data) return;

    setEditFormData({
      title: data.payment_link.title,
      description: data.payment_link.description,
      amount: data.payment_link.amount,
      redirect_url: data.payment_link.redirect_url,
      link_type: data.payment_link.link_type,
      currency: data.payment_link.currency,
      collect_name: data.payment_link.collect_name,
      collect_email: data.payment_link.collect_email,
      collect_phone: data.payment_link.collect_phone,
      collect_billing_details: data.payment_link.collect_billing_details,
      collect_shipping_details: data.payment_link.collect_shipping_details,
      allow_custom_fields: data.payment_link.allow_custom_fields,
      allow_promotional_code: data.payment_link.allow_promotional_code,
      call_to_action_label: data.payment_link.call_to_action_label,
      webhook: data.payment_link.webhook,
    });

    const imgs = data.payment_link.product_images || [];
    setProductImages(
      imgs.map((url: string) => ({ file: null, url, uploading: false }))
    );
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert amount to a number if the field is "amount"
    if (name === "amount") {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleUploadFile = async (file: File, idx: number) => {
    setProductImages((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], uploading: true };
      return copy;
    });
    let url = null;
    let attempts = 0;
    while (attempts < 3 && !url) {
      url = await uploadFile(file);
      if (!url) {
        attempts++;
        if (attempts < 3) await new Promise((res) => setTimeout(res, 1000));
      }
    }
    if (url) {
      setProductImages((prev) => {
        const copy = [...prev];
        copy[idx] = { file, url, uploading: false };
        return copy;
      });
    } else {
      setProductImages((prev) => prev.filter((_, i) => i !== idx));
      toast.error("Image upload failed. Please try again.");
    }
  };

  const addImages = (files: File[]) => {
    const availableSlots = 3 - productImages.length;
    const newFiles = files.slice(0, availableSlots);
    const newImageObjs = newFiles.map((file) => ({
      file,
      url: null,
      uploading: true,
    }));
    const startIdx = productImages.length;
    setProductImages((prev) => [...prev, ...newImageObjs].slice(0, 3));
    newFiles.forEach((file, i) => {
      handleUploadFile(file, startIdx + i);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );
    addImages(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      addImages(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (idx: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEditPaymentLink = async () => {
    if (!data || !editFormData) return;

    if (productImages.some((img) => img.uploading)) {
      toast.error("Please wait for all images to finish uploading.");
      return;
    }

    try {
      setUpdating(true);

      const payload = { ...editFormData } as any;
      payload.product_images = productImages
        .map((img) => img.url)
        .filter(Boolean);

      const response = await api.patch(
        `/payment-links/${params.link}`,
        payload
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Payment link updated successfully");
        setIsEditModalOpen(false);
        fetchHistory();
      } else {
        toast.error("Failed to update payment link");
      }
    } catch (err) {
      console.error("Error updating payment link:", err);
      toast.error("Failed to update payment link");
    } finally {
      setUpdating(false);
    }
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
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">{payment_link.title}</h1>
                  <p className="text-muted-foreground text-sm">
                    {payment_link.description}
                  </p>
                </div>
                <Button
                  onClick={openEditModal}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Edit
                </Button>
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
                                <div className="flex items-center">
                                  <img
                                    src={`${iconBaseUrl}/${transaction.currency.toLowerCase()}.png`}
                                    alt={transaction.currency}
                                    className="w-4 h-4 mr-2"
                                    onError={(e) => {
                                      // Hide icon if it fails to load
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                  ${transaction.amount_usd.toFixed(2)} (
                                  {parseFloat(transaction.amount.toFixed(4))}{" "}
                                  {transaction.currency})
                                </div>
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payment Link</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Premium Subscription"
                value={editFormData?.title || ""}
                onChange={handleInputChange}
                className="focus-visible:ring-primary/30"
              />
              <p className="text-xs text-muted-foreground">
                Give your payment link a descriptive name
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-lg bg-muted/40 border border-border/60 flex flex-col space-y-3">
                <h3 className="text-sm font-medium text-foreground">
                  Amount Settings
                </h3>
                <p className="text-xs text-muted-foreground">
                  Set the currency and payment amount for this link
                </p>

                <div className="flex items-center gap-2">
                  <Select
                    value={editFormData?.currency || "USD"}
                    onValueChange={(value) =>
                      handleSelectChange("currency", value)
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="0.00"
                    value={editFormData?.amount || 0}
                    onChange={handleInputChange}
                    className="focus-visible:ring-primary/30"
                  />
                </div>
              </div>

              <div className="p-5 rounded-lg bg-muted/40 border border-border/60 flex flex-col space-y-3">
                <h3 className="text-sm font-medium text-foreground">
                  Link Settings
                </h3>
                <p className="text-xs text-muted-foreground">
                  Configure how long this payment link remains active
                </p>

                <div className="flex flex-col space-y-1.5">
                  <Label
                    htmlFor="expiryDays"
                    className="text-xs text-muted-foreground"
                  >
                    Expiration
                  </Label>
                  <Select
                    value={editFormData?.link_type || "PERMANENT"}
                    onValueChange={(value) =>
                      handleSelectChange("link_type", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERMANENT">PERMANENT</SelectItem>
                      <SelectItem value="ONE_TIME">ONE_TIME</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">
                  Description{" "}
                  <span className="bg-muted px-2 py-1 text-xs rounded">
                    Optional
                  </span>
                </Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Enter payment description"
                  value={editFormData?.description || ""}
                  onChange={handleInputChange}
                  className="focus-visible:ring-primary/30"
                />
                <p className="text-xs text-muted-foreground">
                  This description will be visible to your customers
                </p>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="redirect_url">
                  Redirect URL{" "}
                  <span className="bg-muted px-2 py-1 text-xs rounded">
                    Optional
                  </span>
                </Label>
                <Input
                  id="redirect_url"
                  name="redirect_url"
                  placeholder="e.g. https://example.com"
                  value={editFormData?.redirect_url || ""}
                  onChange={handleInputChange}
                  type="url"
                  className="focus-visible:ring-primary/30"
                />
                <p className="text-xs text-muted-foreground">
                  URL where customers will be redirected after payment
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="product_images" className="font-medium">
                Product Images{" "}
                <span className="bg-muted px-2 py-1 text-xs rounded">
                  Max 3
                </span>
              </Label>
            </div>
            <div
              className={`rounded-lg border  bg-muted/30 p-4 transition-colors ${
                dragActive ? " border-black " : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={openFileDialog}
              style={{
                cursor: productImages.length < 3 ? "pointer" : "not-allowed",
              }}
            >
              <input
                ref={fileInputRef}
                id="product_images"
                name="product_images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={productImages.length >= 3}
                className="hidden"
              />
              <div className="flex flex-row items-start gap-3 w-full">
                {productImages.map((img, idx) => {
                  const url =
                    img.url || (img.file ? URL.createObjectURL(img.file) : "");
                  return (
                    <div
                      key={idx}
                      className="relative group"
                      style={{ width: 96, height: 96 }}
                    >
                      <Image
                        src={url}
                        alt={`Product Image ${idx + 1}`}
                        width={96}
                        height={96}
                        className="rounded-md border object-cover w-24 h-24 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(url);
                          setDialogOpen(true);
                        }}
                      />
                      {img.uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/50 z-20 rounded-md">
                          <svg
                            className="animate-spin h-6 w-6 text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            ></path>
                          </svg>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full cursor-pointer w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 z-30 shadow"
                        aria-label="Remove image"
                        style={{ lineHeight: 1 }}
                        disabled={img.uploading}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                {productImages.length < 3 && (
                  <div className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border/60 rounded-md bg-background/50 text-muted-foreground text-xs cursor-pointer hover:bg-muted/40 transition">
                    <span className="text-2xl">+</span>
                    <span>Add</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground text-center">
                Drag & drop or click to upload images (JPG, PNG, GIF, WEBP)
              </span>
            </div>
            <Collapsible
              className="rounded-lg border border-border/60 overflow-hidden"
              open={customerInfoOpen}
              onOpenChange={setCustomerInfoOpen}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition">
                <div className="flex flex-col items-start">
                  <span className="text-base font-medium">
                    Collect customer info
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Choose what information to collect from your customers
                  </span>
                </div>
                {customerInfoOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/30">
                    <Checkbox
                      id="collect_name"
                      checked={editFormData?.collect_name || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("collect_name", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="collect_name"
                      className="font-medium cursor-pointer flex-1"
                    >
                      <div>
                        <span>Collect name</span>
                        <p className="text-xs text-muted-foreground">
                          Request customer's full name
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/30">
                    <Checkbox
                      id="collect_email"
                      checked={editFormData?.collect_email || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "collect_email",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="collect_email"
                      className="font-medium cursor-pointer flex-1"
                    >
                      <div>
                        <span>Collect email</span>
                        <p className="text-xs text-muted-foreground">
                          Request customer's email address
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/30">
                    <Checkbox
                      id="collect_phone"
                      checked={editFormData?.collect_phone || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "collect_phone",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="collect_phone"
                      className="font-medium cursor-pointer flex-1"
                    >
                      <div>
                        <span>Collect phone number</span>
                        <p className="text-xs text-muted-foreground">
                          Request customer's contact number
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/30">
                    <Checkbox
                      id="collect_billing_details"
                      checked={editFormData?.collect_billing_details || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "collect_billing_details",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="collect_billing_details"
                      className="font-medium cursor-pointer flex-1"
                    >
                      <div>
                        <span>Collect billing details</span>
                        <p className="text-xs text-muted-foreground">
                          Request billing address and info
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/30">
                    <Checkbox
                      id="collect_shipping_details"
                      checked={editFormData?.collect_shipping_details || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "collect_shipping_details",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="collect_shipping_details"
                      className="font-medium cursor-pointer flex-1"
                    >
                      <div>
                        <span>Collect shipping details</span>
                        <p className="text-xs text-muted-foreground">
                          Request shipping address for physical products
                        </p>
                      </div>
                    </Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="flex flex-col items-center justify-center w-fit p-1.5">
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Large Product Preview"
                    width={400}
                    height={400}
                    className="rounded-lg object-contain max-h-[70vh] w-auto h-auto"
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditPaymentLink}
              disabled={updating}
              className="ml-2"
            >
              {updating ? (
                <>
                  <IconLoader className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PaymentLinkHistoryPage;
