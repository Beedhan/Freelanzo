import type{ ReactNode } from "react";

export const Container = ({ children,className="" }: { children: ReactNode,className?:string }) => (
  <div className={`my-5 rounded-lg border p-4 shadow-sm ${className}`}>{children}</div>
);