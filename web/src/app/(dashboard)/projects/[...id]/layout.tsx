"use client";
import Sidebar from "~/components/projects/Sidebar";

interface ProjectLayoutProps {
  children: React.ReactNode;
}
export default function ProjectLayout({ children }: ProjectLayoutProps) {
  return (
    <div className="flex w-full flex-row overflow-hidden">
      <div className="w-[80%]">{children}</div>
      <Sidebar />
    </div>
  );
}
