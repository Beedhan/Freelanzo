"use client";
import { Pen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import AddDialog from "~/components/services/AddDialog";
import { Container } from "~/components/shared/Container";
import { Button } from "~/components/ui/button";
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
import { AddDialogProps } from "~/utils/types";

export default function Services() {
  const { data } = api.services.services.useQuery();
  const { data: user } = useSession();
  const [editing, setEditing] = useState<{
    id: string;
    open: boolean;
    price: number;
    name: string;
  }>({ id: "", open: false, price: 0, name: "" });
  return (
    <div className=" px-24 pt-10">
      <div className="flex justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-custom lg:text-2xl">
          Services
        </h1>
        {user?.user.isWorkspaceOwner && (
          <AddDialog editing={editing} setEditing={setEditing} />
        )}
      </div>
      <Container className="border-0 shadow-none">
        <Table>
          <TableCaption>A list of your services.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((services) => (
                <TableRow key={services.id}>
                  <TableCell className="w-full font-medium">
                    {services.name}
                  </TableCell>
                  <TableCell className="text-right ">
                    {services.price}
                  </TableCell>
                  {user?.user.isWorkspaceOwner && (
                    <TableCell className="text-right">
                      <Button
                        variant={"ghost"}
                        onClick={() => setEditing({ open: true, ...services })}
                      >
                        <Pen className="text-gray-400" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Container>
    </div>
  );
}
