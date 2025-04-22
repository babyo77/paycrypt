"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, TrashIcon, CopyIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { format } from "date-fns";

interface Webhook {
  id: string;
  link: string;
  description?: string;
  created_at: string;
  is_active: boolean;
}

interface WebhooksResponse {
  webhooks: Webhook[];
  status: string;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookDescription, setNewWebhookDescription] = useState("");
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch webhooks on component mount
  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/webhooks/");

      if (response.status === 200) {
        const data = response.data as WebhooksResponse;
        if (data.status === "success") {
          setWebhooks(data.webhooks);
        } else {
          throw new Error("Failed to fetch webhooks");
        }
      } else {
        throw new Error("Failed to fetch webhooks");
      }
    } catch (error) {
      toast.error("Failed to fetch webhooks");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) {
      toast.error("Please enter a URL for the webhook");
      return;
    }

    setIsCreatingWebhook(true);
    try {
      const response = await api.post("/webhooks/", {
        link: newWebhookUrl.trim(),
        description: newWebhookDescription.trim(),
      });

      if (response.status === 200) {
        toast.success("Webhook created successfully");
        setNewWebhookUrl("");
        setNewWebhookDescription("");
        fetchWebhooks(); // Refresh the list
        setIsDialogOpen(false);
      } else {
        throw new Error("Failed to create webhook");
      }
    } catch (error) {
      toast.error("Failed to create webhook");
      console.error(error);
    } finally {
      setIsCreatingWebhook(false);
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    try {
      const response = await api.delete(`/webhooks/${webhookId}`);

      if (response.status === 200) {
        toast.success("Webhook deleted successfully");
        fetchWebhooks(); // Refresh the list
      } else {
        throw new Error("Failed to delete webhook");
      }
    } catch (error) {
      toast.error("Failed to delete webhook");
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy");
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-md">
      <div className="text-center max-w-md">
        <p className="mt-2 text-lg font-medium text-gray-900">
          No endpoints added
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Add your first webhook endpoint.
        </p>
        <div className="mt-6">
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="h-4 w-4" /> Add Endpoint
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Webhooks</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Webhooks allow you to receive HTTP requests on certain
                  asynchronous events.
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusIcon className="h-4 w-4" /> Add Endpoint
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold leading-tight">
                      Add endpoint
                    </DialogTitle>
                  </DialogHeader>
                  <div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="webhook_url"
                          className="text-sm font-medium leading-tight"
                        >
                          Endpoint url
                        </Label>
                        <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                          <Input
                            id="webhook_url"
                            name="webhook_url"
                            type="url"
                            value={newWebhookUrl}
                            onChange={(e) => setNewWebhookUrl(e.target.value)}
                            placeholder="https://example.com/webhook"
                            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="webhook_description"
                          className="text-sm font-medium leading-tight"
                        >
                          Description
                        </Label>
                        <Input
                          id="webhook_description"
                          name="webhook_description"
                          value={newWebhookDescription}
                          onChange={(e) =>
                            setNewWebhookDescription(e.target.value)
                          }
                          placeholder="Webhook description"
                          className="w-full text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-sm font-medium h-9"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCreateWebhook}
                      disabled={isCreatingWebhook}
                      size="sm"
                    >
                      {isCreatingWebhook ? "Adding..." : "Add endpoint"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading webhooks...</div>
            ) : webhooks?.length === 0 || !webhooks ? (
              <EmptyState />
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b">
                      <TableHead className="py-3">URL</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created on</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks?.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell className="font-medium w-[400px] max-w-[400px]">
                          <div
                            className="text-sm"
                            style={{
                              wordBreak: "break-all",
                              overflowWrap: "break-word",
                            }}
                          >
                            {webhook.link}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {webhook.description || "No description"}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(webhook.created_at)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              webhook.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {webhook.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <span>•••</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigator.clipboard.writeText(webhook.link)
                                }
                                className="text-sm py-1.5"
                              >
                                <CopyIcon className="h-3 w-3" />
                                Copy
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteWebhook(webhook.id)}
                                className="text-sm py-1.5 text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-3 w-3 text-red-600" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
