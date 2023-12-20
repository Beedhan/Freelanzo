/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { useSession } from "next-auth/react";
import * as React from "react";
import { ChevronsUpDown, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { api } from "~/utils/api";
import { useParams } from "next/navigation";
import { toast } from "../ui/use-toast";
import { User } from "@prisma/client";
import {format, formatDistance} from 'date-fns'
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
const Sidebar = () => {
  const { data: user } = useSession();
  const [open, setOpen] = React.useState(false);

  const searchParams = useParams();
  const projectIdParam = searchParams?.id
    ? typeof searchParams.id === "string"
      ? searchParams.id
      : searchParams.id[0]
    : null;
  const projectId = projectIdParam?.split("/")[0];
  const { data, refetch: refetchInProject } =
    api.projects.getClientsInProject.useQuery({
      projectId: projectId || "",
    });
    const { data:projectDetail } = api.projects.getProject.useQuery({
      projectId: projectId as string,
    });
  const { data: userNotInProject, refetch: refetchNotInProject } =
    api.projects.getClientsNotInProject.useQuery({
      projectId: projectId || "",
    });

  const addToProject = api.projects.addClientToProject.useMutation({
    onError: (error) => {
      toast({ title: error.message });
    },
  });

  const removeFromProject = api.projects.removeClientFromProject.useMutation({
    onError: (error) => {
      toast({ title: error.message });
    },
  });

  const handleAddClient = async (clientId: string) => {
    await addToProject.mutateAsync({
      projectId: projectId || "",
      clientId,
    });
    setOpen(false);
    void refetchInProject();
    void refetchNotInProject();
  };

  const handleRemove = async (clientId: string) => {
    if (!clientId) return;
    await removeFromProject.mutateAsync({
      projectId: projectId || "",
      clientId,
    });
    setOpen(false);
    void refetchInProject();
    void refetchNotInProject();
  };

  return (
    <div className="w-[20%]  overflow-hidden border-l-2 ">
      <div className="flex h-screen  flex-col border-r bg-white px-4 py-8 dark:border-gray-600 dark:bg-gray-800">
        <div className="mx-auto pb-4">
          <h2 className="scroll-m-20 text-xl font-extrabold tracking-tight  lg:text-2xl">
            Details
          </h2>
        </div>
        <section className="mb-3">
          <h3 className="text-dim scroll-m-20 text-xl font-extrabold tracking-tight  lg:text-xl">
            Clients
          </h3>
          {user?.user.isWorkspaceOwner && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  Select to add client
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[100%] p-0">
                <Command>
                  <CommandInput placeholder="Search client" />
                  <CommandEmpty>No client found.</CommandEmpty>
                  <CommandGroup>
                    {userNotInProject?.map((client) => (
                      <CommandItem
                        disabled={addToProject.isLoading}
                        key={client.user?.id}
                        className="flex items-center justify-between"
                        onSelect={() => handleAddClient(client.user?.id)}
                      >
                        <span>{client.user?.email}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          <div className="mt-4">
            {data?.UsersOnProjects?.map((client) => (
              <div
                key={client.user?.id}
                className="flex items-center justify-between"
              >
               <div className="flex items-center gap-2">
               <Image src={client.user?.image as string} width={30} height={30} className="rounded-full" alt="profile"/>
                <span>{client.user?.name}</span>
               </div>
                {user?.user.isWorkspaceOwner&&<Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center justify-center p-2"
                  onClick={() => handleRemove(client.user?.id as string)}
                >
                  <Trash size={14} />
                </Button>}
              </div>
            ))}
          </div>
        </section>
        <hr/>
        {projectDetail?.deadLine&&(
        <section>
          <b>Est. Deadline:</b>  {format(projectDetail?.deadLine,"yyyy/MM/dd")}
          <p className="text-sm text-slate-400">({formatDistance(projectDetail.deadLine,new Date(),{
            addSuffix:true
          })})</p>
        </section>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
