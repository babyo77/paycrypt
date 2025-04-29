import { Metadata } from "next";
import PayoutPage from "./payout";
export const metadata: Metadata = {
  title: "Payout",
};

export default function Page() {
  return <PayoutPage />;
}
