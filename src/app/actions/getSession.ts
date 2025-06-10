"use server";

import { cookies } from "next/headers";
import { api, TESTNET } from "@/lib/utils";
import { UserData } from "../provider/user-provider";

export async function getSession() {
  const cookieStore = await cookies();

  const tesseraCookie = cookieStore.get(
    !TESTNET ? "__did_ddy__dick__l_e__er__prod" : "__did_ddy__dick__l_e__er"
  );

  console.warn("sex cookie", tesseraCookie);
  if (!tesseraCookie) {
    return null;
  }

  try {
    const { data: session, error } = await api.get<UserData>("/merchant/", {
      headers: {
        Authorization: `Bearer ${tesseraCookie?.value}`,
      },
      cache: "no-cache",
    });

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
