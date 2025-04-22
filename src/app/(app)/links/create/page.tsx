"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function LinksPage() {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
    minAmount: "",
    maxAmount: "",
    expiryDays: "30",
    redirectUrl: "",
    currency: "USD",
    payment_type: "",
    collectName: false,
    collectEmail: false,
    collectPhone: false,
    collectBillingDetails: false,
    collectShippingDetails: false,
    allowCustomFields: false,
    allowPromotionalCode: false,
    callToActionLabel: "Donate",
    // tags: "",
    // showConfirmationPage: true,
    // successMessage: "",
  });

  const [linkCreated, setLinkCreated] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [allowCustomAmount, setAllowCustomAmount] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format data for API request

      // Make API call to create payment link
      const response = await api.post("/links/create", formData);

      // Handle successful response
      if (response.success) {
        // Add type assertion for the response data
        const linkData = response.data as { url?: string; ID?: string };
        const linkUrl =
          linkData.url || `${window.location.origin}/pay/${linkData.ID}`;

        setPaymentLink(linkUrl);
        setLinkCreated(true);
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      // You could add error handling with a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopying(true);
    setTimeout(() => {
      setCopying(false);
    }, 1500);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
          >
            <div className="flex items-center justify-between px-4 lg:px-6">
              <div className="text-xl font-semibold">Create Payment Link</div>
            </div>
            <TabsContent
              value="outline"
              className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
              <div className="flex-1 flex flex-col">
                {!linkCreated ? (
                  <form
                    onSubmit={handleCreateLink}
                    className="flex flex-col space-y-5 w-full"
                  >
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g. Premium Subscription"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
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
                            value={formData.currency}
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
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
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
                            value={formData.payment_type}
                            onValueChange={(value) =>
                              handleSelectChange("payment_type", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select expiration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PERMANENT">
                                PERMANENT
                              </SelectItem>
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
                          value={formData.description}
                          onChange={handleInputChange}
                          className="focus-visible:ring-primary/30"
                        />
                        <p className="text-xs text-muted-foreground">
                          This description will be visible to your customers
                        </p>
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="redirectUrl">
                          Redirect URL{" "}
                          <span className="bg-muted px-2 py-1 text-xs rounded">
                            Optional
                          </span>
                        </Label>
                        <Input
                          id="redirectUrl"
                          name="redirectUrl"
                          placeholder="e.g. https://example.com"
                          value={formData.redirectUrl}
                          onChange={handleInputChange}
                          type="url"
                          className="focus-visible:ring-primary/30"
                        />
                        <p className="text-xs text-muted-foreground">
                          URL where customers will be redirected after payment
                        </p>
                      </div>
                    </div>

                    {/* Customer Information Collection */}
                    <Collapsible className="rounded-lg border border-border/60 overflow-hidden">
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition">
                        <div className="flex flex-col items-start">
                          <span className="text-base font-medium">
                            Collect customer info
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Choose what information to collect from your
                            customers
                          </span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/30">
                            <Checkbox
                              id="collectName"
                              checked={formData.collectName}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "collectName",
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor="collectName"
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
                              id="collectEmail"
                              checked={formData.collectEmail}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "collectEmail",
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor="collectEmail"
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
                              id="collectPhone"
                              checked={formData.collectPhone}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "collectPhone",
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor="collectPhone"
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
                              id="collectBillingDetails"
                              checked={formData.collectBillingDetails}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "collectBillingDetails",
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor="collectBillingDetails"
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
                              id="collectShippingDetails"
                              checked={formData.collectShippingDetails}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "collectShippingDetails",
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor="collectShippingDetails"
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

                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/30">
                            <Checkbox
                              id="allowCustomFields"
                              checked={formData.allowCustomFields}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "allowCustomFields",
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor="allowCustomFields"
                              className="font-medium cursor-pointer flex-1"
                            >
                              <div>
                                <span>Add custom fields</span>
                                <p className="text-xs text-muted-foreground">
                                  Create additional custom fields
                                </p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Advanced Options */}
                    <Collapsible className="rounded-lg border border-border/60 overflow-hidden">
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition">
                        <div className="flex flex-col items-start">
                          <span className="text-base font-medium">
                            Advanced options
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Additional settings for your payment link
                          </span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="flex flex-col space-y-3">
                            {/* <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="tags">Tags</Label>
                              <div className="flex items-center">
                                <Input
                                  id="tags"
                                  name="tags"
                                  placeholder="Add tags"
                                  value={formData.tags}
                                  onChange={handleInputChange}
                                  className="w-full"
                                />
                                <span className="ml-2 bg-muted px-2 py-2 text-xs rounded">
                                  Optional
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Organize payment links with tags
                              </p>
                            </div> */}

                            <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted/30 mt-2">
                              <Checkbox
                                id="allowPromotionalCode"
                                checked={formData.allowPromotionalCode}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(
                                    "allowPromotionalCode",
                                    checked as boolean
                                  )
                                }
                              />
                              <Label
                                htmlFor="allowPromotionalCode"
                                className="font-medium cursor-pointer flex-1"
                              >
                                <div>
                                  <span>Allow promotional code</span>
                                  <p className="text-xs text-muted-foreground">
                                    Let customers use promo codes for discounts
                                  </p>
                                </div>
                              </Label>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-3">
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="callToActionLabel">
                                Label for call to action
                              </Label>
                              <Select
                                value={formData.callToActionLabel}
                                onValueChange={(value) =>
                                  handleSelectChange("callToActionLabel", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select label" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Donate">Donate</SelectItem>
                                  <SelectItem value="Pay">Pay</SelectItem>
                                  <SelectItem value="Buy">Buy</SelectItem>
                                  <SelectItem value="Subscribe">
                                    Subscribe
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground">
                                Button text displayed on the payment page
                              </p>
                            </div>
                          </div>

                          {/* <div className="md:col-span-2 mt-2">
                            <Label className="text-base font-medium">
                              Confirmation page
                            </Label>
                            <div className="mt-3 space-y-3">
                              <div className="flex items-start space-x-2 p-3 rounded-md hover:bg-muted/30">
                                <Checkbox
                                  id="showConfirmation"
                                  checked={formData.showConfirmationPage}
                                  onCheckedChange={() =>
                                    handleCheckboxChange(
                                      "showConfirmationPage",
                                      true
                                    )
                                  }
                                />
                                <Label
                                  htmlFor="showConfirmation"
                                  className="font-medium cursor-pointer flex-1"
                                >
                                  <div>
                                    <span>Show confirmation page</span>
                                    <p className="text-xs text-muted-foreground mb-2">
                                      Display a thank you page after successful
                                      payment
                                    </p>

                                    {formData.showConfirmationPage && (
                                      <div className="mt-3">
                                        <Label
                                          htmlFor="successMessage"
                                          className="text-sm"
                                        >
                                          Success message
                                        </Label>
                                        <div className="flex w-full items-center mt-1">
                                          <Input
                                            id="successMessage"
                                            name="successMessage"
                                            placeholder="Custom message that will be shown to customers after payment"
                                            value={formData.successMessage}
                                            onChange={handleInputChange}
                                            className="w-full"
                                          />
                                          <span className="ml-2 bg-muted px-2 py-2 text-xs rounded">
                                            Optional
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Label>
                              </div>

                              <div className="flex items-start space-x-2 p-3 rounded-md hover:bg-muted/30">
                                <Checkbox
                                  id="hideConfirmation"
                                  checked={!formData.showConfirmationPage}
                                  onCheckedChange={() =>
                                    handleCheckboxChange(
                                      "showConfirmationPage",
                                      false
                                    )
                                  }
                                />
                                <Label
                                  htmlFor="hideConfirmation"
                                  className="font-medium cursor-pointer flex-1"
                                >
                                  <div>
                                    <span>Don't show confirmation page</span>
                                    <p className="text-xs text-muted-foreground">
                                      Redirect customers to your website
                                      immediately after payment
                                    </p>
                                  </div>
                                </Label>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Button
                      type="submit"
                      className="w-full mt-6"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Payment Link"}
                    </Button>
                  </form>
                ) : (
                  <div className="flex flex-col space-y-5 w-full">
                    <div className="rounded-lg bg-muted/30 p-5 border border-border/60 flex flex-col space-y-3">
                      <Label className="text-sm font-medium">
                        Payment Link Created
                      </Label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={paymentLink}
                          readOnly
                          className="flex-1 bg-background rounded-l-md border border-border py-2 px-3 text-sm"
                        />
                        <Button
                          onClick={copyToClipboard}
                          variant="secondary"
                          className={`rounded-l-none relative overflow-hidden ${
                            copying
                              ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/40"
                              : ""
                          }`}
                        >
                          <span
                            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                              copying ? "opacity-100" : "opacity-0"
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
                              className="text-green-600 dark:text-green-400"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </span>

                          <span
                            className={`transition-opacity duration-200 ${
                              copying ? "opacity-0" : "opacity-100"
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
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Share this link with your customers to receive payments
                      </p>
                    </div>

                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">
                            Your payment link is ready
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Customers can now make payments using
                            cryptocurrencies
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setLinkCreated(false)}
                      >
                        Create Another
                      </Button>
                    </div>
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
