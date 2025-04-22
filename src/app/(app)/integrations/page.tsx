import Playground from "./playground";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Integrations",
};

export default function Page() {
  return <Playground />;
}
