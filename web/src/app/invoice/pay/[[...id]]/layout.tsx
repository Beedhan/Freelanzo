import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Invoice payment",
};
interface NewProjectLayoutProps {
  children: React.ReactNode;
}
export default function NewProjectLayout({ children }: NewProjectLayoutProps) {
  return (
    <div className=" flex h-screen w-full flex-col  overflow-hidden bg-gradient-to-l p-2">
      <div className="flex justify-between w-full shadow-md py-2">
        <Link
          href={"/dashboard"}
          className={buttonVariants({ variant: "ghost" })}
        >
          <ChevronLeft className={"h-6 w-6"} />
        </Link>
      </div>
      <main className={"item-center flex w-full justify-center py-10"}>
        {children}
      </main>
    </div>
  );
}
