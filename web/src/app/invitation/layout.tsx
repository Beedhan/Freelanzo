"use client"
import { SessionProvider } from "next-auth/react";

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
