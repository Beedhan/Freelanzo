"use client";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { FileUpIcon, MoreVertical, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import CreateForm from "~/components/invoice/CreateForm";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { HOST_URL } from "~/utils/lib";

function PageFallback() {
  return (<>Loading</>);
}

export default function DemoPage() {
  const { data } = useSession();
  const router = useRouter();
  if (!data?.user.isWorkspaceOwner) {
    return router.replace("/404");
  }
  return (
    <div className="container mx-auto py-10">
      <ClientTable />
    </div>
  );
}
function CreateDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTrigger>
        <Button className="flex gap-3">
          <Plus /> New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>
        <CreateForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}

function ClientTable() {
  const { data } = api.invoice.getAll.useQuery();
  const { data: summary } = api.invoice.getWorkspaceSummary.useQuery();

  const handleCopy = async (id: string) => {
    await navigator.clipboard.writeText(`${HOST_URL}/invoice/pay/${id}`);
    toast({ title: "Copied" });
  };
  return (
    <>
    <Suspense fallback={<PageFallback/>}>
      <div>
        <div className="flex justify-between">
          <h3 className="mb-5 mt-10 text-xl font-bold text-slate-700">
            Invoice Summary
          </h3>
          <CreateDialog />
        </div>
        <div className="m-auto my-11 flex w-2/3 items-center justify-between">
          <div className="border-r-2 px-8">
            <h4 className="text-slate-400">TOTAL 1</h4>
            <br />
            <h1 className="text-5xl font-bold text-slate-700">
              ${summary?.totalAmount}
              <span className="text-sm">USD</span>
            </h1>
          </div>
          <div className="border-r-2 px-8">
            <h4 className="text-slate-400">OPEN</h4>
            <br />
            <h1 className="text-5xl font-bold text-blue-600">
              ${summary?.totalUnpaid}
              <span className="text-sm">USD</span>
            </h1>
          </div>
          <div className="border-r-2 px-8">
            <h4 className="text-slate-400">OVERDUE</h4>
            <br />
            <h1 className="text-5xl font-bold text-red-500">
              ${summary?.totalOverdue}
              <span className="text-sm">USD</span>
            </h1>
          </div>
          <div>
            <h4 className="text-slate-400">PAID</h4>
            <br />
            <h1 className="text-5xl font-bold text-green-400">
              ${summary?.totalPaid}
              <span className="text-sm">USD</span>
            </h1>
          </div>
        </div>
        <div className="mb-5 h-[2px] bg-slate-200"></div>

        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader className="w-[100px] font-bold">
            <TableRow>
              <TableHead className="font-bold text-slate-900"> Title</TableHead>
              <TableHead className="font-bold text-slate-950">Amount</TableHead>
              <TableHead className="font-bold text-slate-950">Status</TableHead>
              <TableHead className="font-bold text-slate-950">Client</TableHead>
              <TableHead className="font-bold text-slate-950">Due</TableHead>
              <TableHead className="font-bold text-slate-950">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className=" flex items-center gap-2 font-medium">
                  <FileUpIcon /> {invoice.title}
                </TableCell>
                <TableCell>${invoice.amount}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      invoice.status === "PENDING"
                        ? "bg-slate-500 hover:bg-slate-600"
                        : "bg-green-400 hover:bg-green-600"
                    }
                  >
                    {" "}
                    {invoice.dueDate < new Date() &&
                    invoice.status === "PENDING"
                      ? "OVERDUE"
                      : invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>{invoice.Client.email}</TableCell>
                <TableCell>{format(invoice.dueDate, "yyyy-MM-dd")}</TableCell>
                <TableCell>{format(invoice.createdAt, "yyyy-MM-dd")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} className=" justify-between">
                        <MoreVertical className="ml-auto h-4 w-4 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuItem onClick={() => handleCopy(invoice.id)}>
                        <Copy className="mr-2" size={18} />
                        Copy Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Suspense>
    </>
  );
}
