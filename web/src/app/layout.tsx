import { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { Toaster } from "~/components/ui/toaster";
import { AppProvider } from "~/context/AppContext";
import { NextAuthProvider } from "~/context/NextAuthProvider";
import TRPCProvider from "~/context/trpc-provider";

import "~/styles/globals.css";
import { cn } from "~/utils/lib";


export const metadata:Metadata = {
  title:"Freelanzo"
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <TRPCProvider>
      <NextAuthProvider>
      <AppProvider>
        <html
          lang="en"
          className={cn("scroll-smooth text-slate-50 antialiased")}
          style={{ fontFamily: "Inter" }}
        >
          <head />
          <body className="min-h-screen">
            <Toaster />
            {children}
            <TailwindIndicator/>
          </body>
        </html>
      </AppProvider>
      </NextAuthProvider>
    </TRPCProvider>
  );
}
