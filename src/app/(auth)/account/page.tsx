import LoginPage from "@/components/login";
import { getSession } from "@/app/actions/getSession";
import { redirect } from "next/navigation";
async function page() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <LoginPage />;
}

export default page;
