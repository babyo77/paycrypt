import OnboardPage from "./onboard";
import { getSession } from "@/app/actions/getSession";
import { UserProvider } from "@/app/provider/user-provider";
import { redirect } from "next/navigation";

export default async function Onboard() {
  const merchantData = await getSession();

  if (!merchantData) {
    redirect("/account");
  }

  if (merchantData.user.is_active) {
    redirect("/dashboard");
  }

  return (
    <UserProvider session={merchantData.user}>
      <OnboardPage merchantData={merchantData.user} />
    </UserProvider>
  );
}
