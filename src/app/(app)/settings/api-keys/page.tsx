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
import {
  PlusIcon,
  TrashIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
} from "lucide-react";
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

interface ApiKey {
  api_key: string;
  created: string;
  expires: string;
  is_active: boolean;
  name: string;
}

interface ApiKeysResponse {
  api_keys: ApiKey[];
  status: string;
}

// Add this interface for the response when creating a new API key
interface ApiKeyCreateResponse {
  api_key: string;
  status: string;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api-keys/");

      if (response.status === 200) {
        const data = response.data as ApiKeysResponse;
        if (data.status === "success") {
          setApiKeys(data.api_keys);
        } else {
          throw new Error("Failed to fetch API keys");
        }
      } else {
        throw new Error("Failed to fetch API keys");
      }
    } catch (error) {
      toast.error("Failed to fetch API keys");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    setIsCreatingKey(true);
    try {
      const response = await api.post("/api-keys/", {
        name: newKeyName.trim(),
      });

      if (response.status === 200) {
        toast.success("API key created successfully");

        // Save the newly created key to show to the user
        const data = response.data as ApiKeyCreateResponse;
        if (data && data.api_key) {
          setNewlyCreatedKey(data.api_key);
        }

        setNewKeyName("");
        fetchApiKeys(); // Refresh the list
      } else {
        throw new Error("Failed to create API key");
      }
    } catch (error) {
      toast.error("Failed to create API key");
      console.error(error);
    } finally {
      setIsCreatingKey(false);
    }
  };

  const deleteApiKey = async (apiKey: string) => {
    try {
      const response = await api.delete(`/api-keys/${apiKey}`);

      if (response.status === 200) {
        toast.success("API key deleted successfully");
        fetchApiKeys(); // Refresh the list
      } else {
        throw new Error("Failed to delete API key");
      }
    } catch (error) {
      toast.error("Failed to delete API key");
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success("API key copied to clipboard");

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const toggleKeyReveal = (keyId: string) => {
    if (revealedKey === keyId) {
      setRevealedKey(null);
    } else {
      setRevealedKey(keyId);
    }
  };

  const hideKey = (key: string) => {
    if (!key) return "";
    return "•".repeat(key.length);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-md">
      <div className="text-center max-w-md">
        <p className="mt-2 text-lg font-medium text-gray-900">
          No API keys added
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Add your first API key to interact with our API.
        </p>
        <div className="mt-6">
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="h-4 w-4" /> Generate API Key
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
                <h1 className="text-2xl font-semibold">API Keys</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage API keys to authenticate your applications with our
                  API.
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusIcon className="h-4 w-4" /> Generate API Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold leading-tight">
                      Generate API Key
                    </DialogTitle>
                  </DialogHeader>
                  <div>
                    {newlyCreatedKey ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                          <p className="text-sm text-yellow-800 font-medium mb-2">
                            Save your API key now. You won't be able to see it
                            again!
                          </p>
                          <div className="bg-white p-3 rounded border border-yellow-200">
                            <div
                              className="font-mono text-sm p-2 bg-gray-50 rounded break-all cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => copyToClipboard(newlyCreatedKey)}
                            >
                              {copiedKey === newlyCreatedKey ? (
                                <div className="flex items-center justify-center text-green-600 font-medium">
                                  <CheckIcon className="h-4 w-4 mr-2" />
                                  Copied to clipboard!
                                </div>
                              ) : (
                                newlyCreatedKey
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              Click to copy
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setNewlyCreatedKey(null);
                            setIsDialogOpen(false);
                          }}
                          className="w-full"
                        >
                          Done
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="api_key_name"
                            className="text-sm font-medium leading-tight"
                          >
                            Key name
                          </Label>
                          <Input
                            id="api_key_name"
                            name="api_key_name"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            placeholder="e.g. Production API Key"
                            className="w-full text-sm"
                          />
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
                            onClick={handleCreateApiKey}
                            disabled={isCreatingKey}
                            size="sm"
                          >
                            {isCreatingKey
                              ? "Generating..."
                              : "Generate API Key"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading API keys...</div>
            ) : apiKeys?.length === 0 || !apiKeys ? (
              <EmptyState />
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b">
                      <TableHead>Name</TableHead>
                      <TableHead className="py-3">API Key</TableHead>
                      <TableHead>Created on</TableHead>
                      <TableHead>Expires on</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys?.map((apiKey) => (
                      <TableRow key={apiKey.api_key}>
                        <TableCell>
                          <span className="text-sm">
                            {apiKey.name || "Unnamed key"}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium w-[400px] max-w-[400px]">
                          <div
                            className="text-sm font-mono cursor-pointer hover:bg-gray-50 px-3 py-2 rounded transition-colors"
                            onClick={() => copyToClipboard(apiKey.api_key)}
                            onMouseEnter={() => toggleKeyReveal(apiKey.api_key)}
                            onMouseLeave={() => setRevealedKey(null)}
                            style={{
                              wordBreak: "break-all",
                              overflowWrap: "break-word",
                            }}
                          >
                            {copiedKey === apiKey.api_key ? (
                              <div className="flex items-center text-green-600">
                                <CheckIcon className="h-4 w-4 mr-2" />
                                <span>Copied!</span>
                              </div>
                            ) : revealedKey === apiKey.api_key ? (
                              apiKey.api_key
                            ) : (
                              hideKey(apiKey.api_key)
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(apiKey.created)}</TableCell>
                        <TableCell>{formatDate(apiKey.expires)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              apiKey.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {apiKey.is_active ? "Active" : "Inactive"}
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
                                onClick={() => copyToClipboard(apiKey.api_key)}
                                className="text-sm py-1.5"
                              >
                                <CopyIcon className="h-3 w-3 mr-2" />
                                Copy
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteApiKey(apiKey.api_key)}
                                className="text-sm py-1.5 text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-3 w-3 mr-2 text-red-600" />
                                Delete
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
