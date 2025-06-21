import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
import { Button } from "@/components/ui/button";
import { api, supportApi } from "@/lib/utils";
import { getSession } from "@/app/actions/getSession";
import { useUser } from "@/app/provider/user-provider";

interface BankAccountFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  edit?: boolean;
}

export function BankAccountFormDialog({
  open,
  onOpenChange,
  trigger,
  edit = false,
}: BankAccountFormDialogProps) {
  const [form, setForm] = useState({
    bank_name: "",
    account_number: "",
    routing_number: "",
    account_name: "",
    account_owner_name: "",
    active: true,
    address: {
      street_line_1: "",
      street_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "USA",
    },
  });
  const [loading, setLoading] = useState(false);
  const { dispatch } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("address.")) {
      const key = name.replace("address.", "");
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    if (field === "country" || field === "state") {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (edit) {
        await api.patch("/merchant/external-account", form);
      } else {
        await api.post("/merchant/external-account", form);
      }

      const session = await getSession();
      if (session) {
        dispatch({ type: "SET_USER", payload: session.user });
        api.setAuthToken(`Bearer ${session.user.token}`);
        supportApi.setAuthToken(`Bearer ${session.user.token}`);
      }
      if (onOpenChange) onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {edit ? "Change Bank Account Details" : "Add Bank Account Details"}
          </DialogTitle>
        </DialogHeader>
        <form
          className="space-y-6"
          id="bank-account-form"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                name="bank_name"
                value={form.bank_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                name="account_number"
                value={form.account_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routing_number">Routing Number</Label>
              <Input
                id="routing_number"
                name="routing_number"
                value={form.routing_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_name">Account Name</Label>
              <Input
                id="account_name"
                name="account_name"
                value={form.account_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_owner_name">Account Owner Name</Label>
              <Input
                id="account_owner_name"
                name="account_owner_name"
                value={form.account_owner_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address.street_line_1">Street Line 1</Label>
              <Input
                id="address.street_line_1"
                name="address.street_line_1"
                value={form.address.street_line_1}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.street_line_2">Street Line 2</Label>
              <Input
                id="address.street_line_2"
                name="address.street_line_2"
                value={form.address.street_line_2}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.state">State</Label>
              <Input
                id="address.state"
                name="address.state"
                value={form.address.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.postal_code">Postal Code</Label>
              <Input
                id="address.postal_code"
                name="address.postal_code"
                value={form.address.postal_code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.country">Country</Label>
              <Select
                value={form.address.country}
                onValueChange={(v) => handleSelectChange("country", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">USA</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} form="bank-account-form">
              {loading
                ? edit
                  ? "Saving..."
                  : "Adding..."
                : edit
                ? "Save Changes"
                : "Add Bank Details"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
