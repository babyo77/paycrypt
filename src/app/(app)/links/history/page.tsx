import { PaymentLinksDataTable } from "./payment-links-table";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Payment Links",
};
function page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PaymentLinksDataTable data={[]} />
        </div>
      </div>
    </div>
  );
}

export default page;
