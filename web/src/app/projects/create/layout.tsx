import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type{ Metadata } from "next";

export const metadata: Metadata = {
  title: "New Project",
  description: "Create new project",
};
interface NewProjectLayoutProps {
  children: React.ReactNode;
}
export default function NewProjectLayout({ children }: NewProjectLayoutProps) {
  return (
    <div className=" flex h-screen w-full flex-row  overflow-hidden bg-gradient-to-l from-primary to-indigo-500 p-2">
      <Link
        href={"/dashboard"}
        className={buttonVariants({ variant: "ghost" })}
      >
        <ChevronLeft className={"h-6 w-6"} />
      </Link>
      <main className={"item-center flex w-full justify-center py-10"}>
        {children}
      </main>
    </div>
  );
}
