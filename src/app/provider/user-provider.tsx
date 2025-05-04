"use client";

import { api, supportApi } from "@/lib/utils";
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
export interface UserData {
  token: string;
  user: string;
  email: string;
  api_key: string;
  is_active: boolean;
  api_key_expiry: string;
  sol_address: string;
  eth_address: string;
  full_name: string;
  message: string;
  payout_eth_address: string;
  payout_sol_address: string;
  webhook_url: string;
  is_waitlist: boolean;
  timeframe: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  networkMode: "MAINNET" | "TESTNET";
  avatar: string;
}

type UserAction =
  | { type: "SET_USER"; payload: UserData }
  | { type: "CLEAR_USER" }
  | {
      type: "SET_TIMEFRAME";
      payload: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    }
  | { type: "SET_NETWORK_MODE"; payload: "MAINNET" | "TESTNET" };

interface UserContextType {
  userData: UserData | null;
  dispatch: React.Dispatch<UserAction>;
}

const userReducer = (
  state: UserData | null,
  action: UserAction
): UserData | null => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "CLEAR_USER":
      return null;
    case "SET_TIMEFRAME":
      if (!state) return null;
      return { ...state, timeframe: action.payload };
    case "SET_NETWORK_MODE":
      if (!state) return null;
      return { ...state, networkMode: action.payload };
    default:
      return state;
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const routesToPrefetch = [
  "/account",
  "/dashboard",
  "/transactions",
  "/settings",
];

export function PrefetchAllRoutes() {
  const router = useRouter();
  useEffect(() => {
    routesToPrefetch.forEach((route) => router.prefetch(route));
  }, [router]);

  return null;
}

export function UserProvider({
  session,
  children,
}: {
  session?: UserData | null;
  children: ReactNode;
}) {
  const [userData, dispatch] = useReducer(userReducer, null);

  useEffect(() => {
    if (session) {
      dispatch({ type: "SET_USER", payload: session });
      api.setAuthToken(`Bearer ${session.token}`);
      supportApi.setAuthToken(`Bearer ${session.token}`);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ userData, dispatch }}>
      {userData ? children : null}
      <PrefetchAllRoutes />
    </UserContext.Provider>
  );
}

// Create a custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
