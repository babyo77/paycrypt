"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserData } from "@/app/provider/user-provider";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");

    if (!email) {
      toast.error("Please enter email");
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email as string)) {
      toast.error("Please enter a valid email");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<UserData>("/auth/magic-link", {
        email: email.toString(),
        // password: password.toString(),
      });
      if (response.status === 200 && response.data) {
        toast.success("Magic link sent to email");
      }
    } catch (error) {
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full opacity-45 w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      <section className="flex min-h-screen px-4 py-16 md:py-32 dark:bg-transparent">
        <form
          onSubmit={handleSubmit}
          className=" m-auto h-fit w-full max-w-lg overflow-hidden rounded-[calc(var(--radius)+.125rem)]  shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className=" -m-px p-8 pb-6">
            <div className="text-center">
              <Link
                href="https://paycrypt.tech"
                aria-label="go home"
                className="mx-auto block w-fit"
              >
                <Logo className=" size-16" textClassName=" hidden" />
              </Link>

              <p className="text-lg mt-2">
                Welcome! Login to your Paycrypt account
              </p>
            </div>

            <div className="grid grid-cols-1 mt-4 gap-3">
              <Button
                onClick={() => {
                  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/`;
                }}
                className=" min-w-[320px] mx-auto"
                type="button"
                variant="outline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.98em"
                  height="1em"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285f4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34a853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#fbbc05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  ></path>
                  <path
                    fill="#eb4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
                <span>Continue with Google</span>
              </Button>
            </div>
          </div>

          <div className="p-3 fixed bottom-3 mx-auto left-0 right-0">
            <p className="text-muted-foreground text-center text-xs">
              By using Paycrypt you agree to our{" "}
              <Link
                href="https://paycrypt.tech/terms-of-service"
                target="_blank"
                className="text-primary hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://paycrypt.tech/privacy-policy"
                target="_blank"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>{" "}
            </p>
          </div>
        </form>
      </section>
    </>
  );
}
