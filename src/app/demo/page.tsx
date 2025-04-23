import { redirect } from "next/navigation";

function page() {
  redirect(process.env.DEMO_ENDPOINT!);
}

export default page;
