import OnboardPage from "./onboard";
import { getSession } from "@/app/actions/getSession";
import { UserProvider } from "@/app/provider/user-provider";
import { redirect } from "next/navigation";

export default async function Onboard() {
  const merchantData = await getSession();

  if (!merchantData) {
    redirect("/account");
  }

  return (
    <UserProvider session={merchantData.user}>
      <OnboardPage merchantData={merchantData.user} />
    </UserProvider>
  );
}
