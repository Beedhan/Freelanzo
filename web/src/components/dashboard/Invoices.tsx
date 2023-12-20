"use client";
import { format } from "date-fns";
import { Download, FileUpIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/utils/api";
import { HOST_URL } from "~/utils/lib";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Invoices = ({ projectId }: { projectId: string }) => {
  return (
    <div className="w-full p-5 pl-10">
      <Head>
        <title>Invoices</title>
      </Head>
      <ClientTable projectId={projectId} />
    </div>
  );
};

function ClientTable({ projectId }: { projectId: string }) {
  const { data } = api.invoice.getProject.useQuery({
    projectId,
  });
  const { data:summary } = api.invoice.getSummary.useQuery({
    projectId,
  });
  const { data: user } = useSession();
  const generatePDF = ({
    invoiceNumber,
    invoiceDate,
    invoiceDueDate,
    clientName,
    clientEmail,
    itemName,
    price,
    username,
  }: {
    invoiceNumber: string;
    invoiceDate: string;
    invoiceDueDate: string;
    clientName: string;
    clientEmail: string;
    itemName: string;
    price: number;
    username: string;
  }) => {
    const doc = new jsPDF();
    // Set document font size and style
    doc.setFontSize(25);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 10, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    doc.text(invoiceNumber, 10, 25);
    doc.setFont("helvetica", "bold");
    doc.text(username, 150, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    // Add Bill To and Bill From in a single row
    doc.text("Bill To:", 10, 45);

    // Bill From Information
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text(clientName, 10, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(clientEmail, 10, 65);

    // Bill To Information
    doc.text(`Issue: ${invoiceDate}`, 150, 55);
    doc.text(`Due: ${invoiceDueDate}`, 150, 65);

    // Add table with invoice data
    doc.autoTable({
      startY: 90,
      head: [["Description", "Quantity", "Price", "Total"]],
      body: [[itemName, 1, price, price]],
    });

    // Calculate and add total amount
    doc.text("Total Amount: $" + price.toFixed(2), 150, 120);

    // Save the PDF
    doc.save("invoice.pdf");
  };
  return (
    <div>
      <h3 className="mb-5 mt-10 text-xl font-bold text-slate-700">Summary</h3>
      <div className="m-auto my-11 flex w-full items-center justify-between">
        <div className="border-r-2 px-8">
          <h4 className="text-slate-400">TOTAL</h4>
          <br />
          <h1 className="text-5xl font-bold text-slate-700">
            ${summary?.totalAmount}<span className="text-sm">USD</span>
          </h1>
      </div>
        <div className="border-r-2 px-4">
          <h4 className="text-slate-400">OPEN</h4>
          <br />
          <h1 className="text-5xl font-bold text-blue-600">
            ${summary?.totalUnpaid}<span className="text-sm">USD</span>
          </h1>
        </div>
        <div className="border-r-2 px-8">
          <h4 className="text-slate-400">OVERDUE</h4>
          <br />
          <h1 className="text-5xl font-bold text-red-500">
            ${summary?.totalOverdue}<span className="text-sm">USD</span>
          </h1>
        </div>
        <div>
          <h4 className="text-slate-400">PAID</h4>
          <br />
          <h1 className="text-5xl font-bold text-green-400">
            ${summary?.totalPaid}<span className="text-sm">USD</span>
          </h1>
        </div>
      </div>
      <div className="mb-5 h-[2px] bg-slate-200"></div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="w-[100px] font-bold">
          <TableRow>
            <TableHead className="font-bold text-slate-900"> Number</TableHead>
            <TableHead className="font-bold text-slate-950">Amount</TableHead>
            <TableHead className="font-bold text-slate-950">Status</TableHead>
            <TableHead className="font-bold text-slate-950">Client</TableHead>
            <TableHead className="font-bold text-slate-950">Created</TableHead>
            <TableHead className="font-bold text-slate-950">Due</TableHead>
            <TableHead className="font-bold text-slate-950">Download</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className=" flex items-center gap-2 font-medium">
                <FileUpIcon />{" "}
                {user?.user.isWorkspaceOwner ? (
                  <p>{invoice.title}</p>
                ) : (
                  <a
                    className="text-blue-700"
                    target="_blank"
                    href={`${HOST_URL}/invoice/pay/${invoice.id}`}
                  >
                    {invoice.title}
                  </a>
                )}
              </TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell>
                <Badge
                  className={
                    invoice.status === "PENDING"
                      ? "bg-slate-500 hover:bg-slate-600"
                      : "bg-green-400 hover:bg-green-600"
                  }
                >
                  {" "}
                  {invoice.dueDate < new Date() && invoice.status === "PENDING"
                    ? "OVERDUE"
                    : invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.Client.email}</TableCell>
              <TableCell>{format(invoice.createdAt, "yyyy-MM-dd")}</TableCell>
              <TableCell>{format(invoice.dueDate, "yyyy-MM-dd")}</TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    generatePDF({
                      invoiceNumber: invoice.title,
                      invoiceDate: format(invoice.createdAt, "yyyy-MM-dd"),
                      invoiceDueDate: format(invoice.dueDate, "yyyy-MM-dd"),
                      clientName: invoice.Client.name!,
                      clientEmail: invoice.Client.email!,
                      itemName: invoice.service.name,
                      price: invoice.amount,
                      username: user.user.name!,
                    })
                  }
                >
                  <Download size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Invoices;
