"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/provider/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BankAccountFormDialog } from "@/components/bank-account-form-dialog";
import { Landmark } from "lucide-react";

export default function AccountPage() {
  const { userData, dispatch } = useUser();

  const [formData, setFormData] = useState({
    first_name: userData?.full_name?.split(" ")[0] || "",
    last_name: userData?.full_name?.split(" ").slice(1).join(" ") || "",
    payout_eth_address: userData?.payout_eth_address || "",
    payout_sol_address: userData?.payout_sol_address || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();

      const response = await api.patch("/merchant/", {
        full_name: fullName,
        payout_eth_address: formData.payout_eth_address,
        payout_sol_address: formData.payout_sol_address,
      });

      if (response.status === 200) {
        dispatch({
          type: "SET_USER",
          payload: {
            ...userData!,
            full_name: fullName,
            payout_eth_address: formData.payout_eth_address,
            payout_sol_address: formData.payout_sol_address,
          },
        });

        toast.success("Account details updated successfully");
      } else {
        throw new Error("Failed to update account details");
      }
    } catch (error) {
      toast.error("Failed to update account details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 md:px-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold">Account details</h1>
              <Button
                type="submit"
                form="account-form"
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>

            <div className="bg-card p-6 border border-border/60 rounded-lg">
              <form
                id="account-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-sm font-medium">
                      First name
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      disabled={userData?.is_kyc_active}
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-sm font-medium">
                      Last name
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      disabled={userData?.is_kyc_active}
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Id
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    disabled={true}
                    value={userData?.email}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="payout_eth_address"
                    className="text-sm font-medium"
                  >
                    Ethereum Payout Address
                  </Label>
                  <Input
                    id="payout_eth_address"
                    name="payout_eth_address"
                    value={formData.payout_eth_address}
                    onChange={handleChange}
                    placeholder="Enter Ethereum Address"
                    className="w-full text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Enter your Ethereum wallet address for receiving payments
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="payout_sol_address"
                    className="text-sm font-medium"
                  >
                    Solana Payout Address
                  </Label>
                  <Input
                    id="payout_sol_address"
                    name="payout_sol_address"
                    value={formData.payout_sol_address}
                    onChange={handleChange}
                    placeholder="Enter Solana Address"
                    className="w-full text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Enter your Solana wallet address for receiving payments
                  </p>
                </div>
              </form>
            </div>

            {userData?.is_kyc_active && (
              <>
                <div className="flex flex-col gap-4 py-8 pb-5">
                  <h2 className="text-lg font-semibold">
                    Bank Account Details
                  </h2>
                  {userData.bank_name ? (
                    <div className="w-full">
                      <div className="flex items-center bg-card border border-border rounded-xl p-4 mb-4 transition-colors w-full">
                        <div className="flex-shrink-0 bg-gray-100 bg-opacity-5 dark:bg-white dark:bg-opacity-10 rounded-full p-3 flex items-center justify-center mr-4">
                          <Landmark className="h-7 w-7 text-muted-foreground dark:text-white" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="text-black dark:text-white text-lg font-bold tracking-wide mb-0.5">
                            {userData.bank_name || "N/A"}
                          </div>
                          <div className="text-black dark:text-white text-sm font-mono opacity-80">
                            **** **** **** {userData.last_4 || "N/A"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <BankAccountFormDialog
                            edit
                            trigger={
                              <Button type="button" size="sm" variant="outline">
                                Change Bank Details
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : userData.is_kyc_active ? (
                    <BankAccountFormDialog
                      trigger={
                        <Button type="button" className=" w-fit" size="sm">
                          Add Bank Account
                        </Button>
                      }
                    />
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => (window.location.href = "/kyc")}
                    >
                      Do KYC
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
