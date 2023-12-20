import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="absolute bottom-2 right-2 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400"
      role="alert"
    >
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ">
        <Loader2 className="animate-spin" size={20} />
      </div>
      <div className="ml-3 text-sm font-normal">Loading.</div>
    </div>
  );
}
