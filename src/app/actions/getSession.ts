"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/utils";
import { UserData } from "../provider/user-provider";

export async function getSession() {
  const cookieStore = await cookies();

  const tesseraCookie = cookieStore.get("__did_ddy__dick__l_e__er");

  console.warn("sex cookie", tesseraCookie);
  if (!tesseraCookie) {
    return null;
  }

  try {
    const { data: session, error } = await api.get<UserData>(
      "/merchant/session",
      {
        headers: {
          Authorization: `Bearer ${tesseraCookie?.value}`,
        },
      }
    );

    if (error) {
      console.error("sex error", error);
      return null;
    }
    console.warn("sex success", session);
    if (!session) {
      return null;
    }

    return { user: { ...session, token: tesseraCookie.value } };
  } catch (error) {
    console.error("Error fetching sex:", error);
    return null;
  }
}
