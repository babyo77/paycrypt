import { redirect } from "next/navigation";

function page() {
  redirect(process.env.DOCS_ENDPOINT!);
}

export default page;
