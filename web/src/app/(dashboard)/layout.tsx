"use client"
import { SessionProvider } from "next-auth/react";
import Sidebar from "~/components/dashboard/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default  function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <SessionProvider>
    <div className=" flex w-full flex-row  py-2">
      <Sidebar />
      <div className="pl-[16%] w-full">{children}</div>
    </div>
    </SessionProvider>
  );
}
