"use client";

import { api } from "@/lib/utils";
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
  webhook_url: string;
}

type UserAction =
  | { type: "SET_USER"; payload: UserData }
  | { type: "CLEAR_USER" };

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
    default:
      return state;
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const routesToPrefetch = [
  "/account",
  "/dashboard",
  "/transactions",
  "/playground",
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
