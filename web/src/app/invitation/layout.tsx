"use client"
import { SessionProvider } from "next-auth/react";
import { getSession } from "~/utils/session";

interface HomeLayoutProps {
  children: React.ReactNode;
}
export default  function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  );
}
