import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};
const page = () => {
  return redirect("/inbox");
};

export default page;
