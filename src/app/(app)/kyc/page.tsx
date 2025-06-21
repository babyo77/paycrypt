"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/app/provider/user-provider";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api, TESTNET } from "@/lib/utils";
import { CheckCircle2, LoaderCircle, InfoIcon } from "lucide-react";

// KYC API response type
type KycApiResponse = {
  code?: string;
  status?: "approved";
  email?: string;
  kyc_link?: string;
  message?: string;
  name?: string;
  tos_link?: string;
  type?: string;
  tos_status: "approved";
  kyc_status: "not_started" | "approved";
};

export default function KycPage() {
  const { userData, dispatch } = useUser();
  const [legalName, setLegalName] = useState(userData?.full_name || "");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tosDialogOpen, setTosDialogOpen] = useState(false);
  const [kycData, setKycData] = useState<KycApiResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTosAccepting, setIsTosAccepting] = useState(false);
  const [hasAcceptedTos, setHasAcceptedTos] = useState(false);
  const [isKycApproved, setIsKycApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const kycRes = await api.get<KycApiResponse>("/merchant/kyc");
        if (kycRes.success && kycRes.data) {
          setKycData(kycRes.data);
          if (
            kycRes.data.kyc_status === "approved" ||
            kycRes.data.status == "approved"
          ) {
            setIsKycApproved(true);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKycStatus();
  }, []);

  const handleProceed = () => {
    if (!legalName.trim()) {
      setError("Legal name is required");
      return;
    }
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    setIsSaving(true);
    try {
      const response = await api.patch("/merchant/", {
        full_name: legalName.trim(),
      });
      if (response.status === 200) {
        dispatch({
          type: "SET_USER",
          payload: {
            ...userData!,
            full_name: legalName.trim().toLocaleLowerCase(),
          },
        });
        setDialogOpen(false);
        // Fetch KYC data after saving name
        try {
          const kycRes = await api.get<KycApiResponse>("/merchant/kyc");
          if (kycRes.success && kycRes.data) {
            setKycData(kycRes.data);
            if (kycRes.data.tos_status === "approved") {
              // If TOS already approved, redirect to KYC link
              if (kycRes.data.kyc_link) {
                window.location.href = kycRes.data.kyc_link;
                return;
              }
            } else {
              setTosDialogOpen(true);
              await handleTosDialogOpenChange(true);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch KYC data when TOS dialog is opened
  const handleTosDialogOpenChange = async (open: boolean) => {
    if (!open && !hasAcceptedTos) {
      toast.error("You must accept the Terms of Service to proceed.");
    }
    setTosDialogOpen(open);
    if (open && !kycData) {
      try {
        const kycRes = await api.get<KycApiResponse>("/merchant/kyc");
        if (kycRes.success && kycRes.data) {
          setKycData(kycRes.data);
        }
      } catch (err) {
        toast.error("Failed to fetch KYC info");
      }
    }
  };

  const handleAcceptTos = async () => {
    setIsTosAccepting(true);
    setHasAcceptedTos(true);

    // Open TOS in new tab if not already approved
    if (kycData?.tos_link && kycData.tos_status !== "approved") {
      window.open(kycData.tos_link, "_blank");
    }

    // Poll until tos_status is "approved"
    const pollForTosApproval = async () => {
      try {
        const kycRes = await api.get<KycApiResponse>("/merchant/kyc");
        if (kycRes.success && kycRes.data?.tos_status === "approved") {
          setTosDialogOpen(false);
          if (kycRes.data.kyc_link) {
            window.location.href = kycRes.data.kyc_link;
          }
        } else {
          // Wait 2 seconds before polling again
          setTimeout(pollForTosApproval, 2000);
        }
      } catch (err) {
        toast.error("Failed to verify TOS acceptance. Retrying...");
        setTimeout(pollForTosApproval, 2000);
      }
    };

    pollForTosApproval();
  };

  if (TESTNET) {
    return (
      <div className="mx-auto w-full mt-16 bg-white p-8 rounded-lg flex flex-col items-center justify-center min-h-[calc(100vh-300px)]">
        <InfoIcon className="w-12 h-12 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-yellow-700">
          KYC Unavailable on Testnet
        </h1>
        <p className="text-yellow-700 font-semibold mb-2 text-center">
          KYC verification is disabled while using the testnet environment.
        </p>
        <p className="text-gray-600 text-center">
          Please switch to mainnet to complete your KYC verification and unlock
          all features.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full mt-16 bg-white p-8 rounded-lg ">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)]">
          <span className="text-gray-500">Checking KYC status...</span>
        </div>
      ) : isKycApproved ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)]">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
          <h1 className="text-2xl font-bold mb-2">KYC Complete</h1>
          <p className="text-green-700 font-semibold mb-1">
            Your KYC is done and approved!
          </p>
          <p className="text-gray-600">
            Thank you for verifying your identity. You can now use all features.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center">
            KYC Verification
          </h1>
          <p className="mb-6 text-gray-700 text-center">
            To complete your KYC, please confirm your legal name as it appears
            on your government-issued ID.
          </p>
          <div className="mb-4">
            <label htmlFor="legal-name" className="block font-medium mb-1">
              Legal Name
            </label>
            <Input
              id="legal-name"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="Enter your legal name"
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>
          <Button className="w-full mt-4" size="lg" onClick={handleProceed}>
            Proceed to KYC
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Name</DialogTitle>
                <DialogDescription>
                  Do you want to proceed with this name?
                </DialogDescription>
              </DialogHeader>
              <div className="my-4 text-center font-semibold">{legalName}</div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={isSaving}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={handleDialogConfirm} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Proceed"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* TOS Accept Dialog */}
          <Dialog open={tosDialogOpen} onOpenChange={handleTosDialogOpenChange}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Accept Terms of Service</DialogTitle>
                <DialogDescription>
                  You must accept the Terms of Service before proceeding to KYC.
                </DialogDescription>
              </DialogHeader>
              <div className="my-4 text-center">
                <Button
                  asChild
                  variant="link"
                  className="mb-2"
                  disabled={!kycData?.tos_link}
                >
                  <a
                    href={kycData?.tos_link || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Terms of Service
                  </a>
                </Button>
                {kycData?.message && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {kycData.message}
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleAcceptTos}
                  disabled={isTosAccepting || !kycData?.tos_link}
                >
                  {isTosAccepting ? "Redirecting..." : "I Accept & Continue"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
