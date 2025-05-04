"use client";

import { useState } from "react";
import { useUser } from "@/app/provider/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/utils";
import { toast } from "sonner";

export default function AccountPage() {
  const { userData, dispatch } = useUser();

  const [formData, setFormData] = useState({
    first_name: userData?.full_name?.split(" ")[0] || "",
    last_name: userData?.full_name?.split(" ").slice(1).join(" ") || "",
  });

  const [isLoading, setIsLoading] = useState(false);

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
      });

      if (response.status === 200) {
        dispatch({
          type: "SET_USER",
          payload: {
            ...userData!,
            full_name: fullName,
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold">Account details</h1>
              <Button
                type="submit"
                form="account-form"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>

            <div className="bg-white p-6 border border-border/60 rounded-lg">
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
                  <div className="text-gray-700 py-2 px-3 border border-gray-200 rounded-md bg-gray-50">
                    {userData?.email}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
