import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ApiClient from "hmm-api";
import { toast } from "sonner";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const supportApi = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_SUPPORT_API_URL!,
  toast,
});

export const api = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  toast,
  credentials: "include",

  parseErrorResponse(response) {
    console.error("Error from API", response);
    return {
      message: response.message,
    };
  },
});
