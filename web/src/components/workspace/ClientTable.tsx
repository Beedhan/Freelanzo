import { useRouter } from "next/navigation";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "~/components/ui/table";
import { toast } from "~/components/ui/use-toast";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/utils/api";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Container } from "../shared/Container";

type ClientType =
  | {
      email: string;
      invited: boolean;
      id: string;
    }
  | {
      user: User;
      createdAt: Date;
    };

const ClientTable = () => {
  const router = useRouter();
  const { data: user } = useSession();

  const { data, refetch } = api.workspace.getClients.useQuery();
  const {mutate} = api.payment.upgrade.useMutation({
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url);
      }
    },
    onError:(error)=>{
        toast({title:error.message})
    }
  });
  const removenIvitationMutation = api.workspace.removeInvitation.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (error) => {
      toast({ title: error.message });
    },
  });
  const removenUserMutation = api.workspace.removeUser.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (error) => {
      toast({ title: error.message });
    },
  });
  const handleRemoveInvitation = (userEmail: string) => {
    removenIvitationMutation.mutate({ userEmail });
  };
  const handleRemoveUser = (userId: string) => {
    removenUserMutation.mutate({ userId });
  };
  return (
    <Container>
      <div className="flex justify-between">
        <h2 className="mt-4 scroll-m-20 text-4xl font-extrabold tracking-tight text-custom lg:text-2xl">
          Members
        </h2>
        <Button variant={"default"} onClick={()=>mutate()}>Upgrade</Button>
      </div>

      <Table>
        <TableCaption>A list of Clients.</TableCaption>

        <TableBody>
          {data &&
            data?.length > 0 &&
            data.map((client: ClientType) => (
              <>
                {"user" in client ? (
                  <TableRow className="text-slate-500" key={client?.user?.id}>
                    <TableCell className=" flex items-center gap-2 font-medium">
                      <Avatar>
                        <AvatarImage
                          src={client.user.image}
                          alt="@shadcn"
                        />
                        <AvatarFallback>{client?.user?.name}</AvatarFallback>
                      </Avatar>
                      {client?.user?.name}
                    </TableCell>
                    <TableCell>{client?.user?.email}</TableCell>
                    <TableCell>
                      {"Joined on " +
                        format(new Date(client?.createdAt), "MMMM dd,yyyy")}
                    </TableCell>
                    {user?.user.isWorkspaceOwner && (
                      <TableCell>
                        <Button
                          disabled={removenUserMutation.isLoading}
                          variant={"destructive"}
                          onClick={() => handleRemoveUser(client?.user?.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ) : (
                  <TableRow className="text-slate-500" key={client?.id}>
                    <TableCell className=" flex items-center gap-2 font-medium">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>{client?.email}</AvatarFallback>
                      </Avatar>
                      {client?.email}
                    </TableCell>
                    <TableCell>Invited</TableCell>
                    {user?.user.isWorkspaceOwner && (
                      <TableCell>
                        <Button
                          disabled={removenIvitationMutation.isLoading}
                          variant={"destructive"}
                          onClick={() => handleRemoveInvitation(client.email)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </>
            ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default ClientTable;
