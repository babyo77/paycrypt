import SettingsPage from "./settings";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Settings",
};
export default function Page() {
  return <SettingsPage />;
}
