/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  CreditCard,
  Folder,
  Inbox,
  LogOut,
  Plus,
  Receipt,
  Scroll,
  Settings,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";
import Logo from "~/components/Logo";
import { AppContext } from "~/context/AppContext";
import { api } from "~/utils/api";
import { Icons } from "../Icons";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
const variants = {
  hidden: {
    opacity: 0,
    height: 0,
    scaleY: 0,
    onanimationend: {
      scale: 0,
      display: "none",
    },
  },
  shown: {
    opacity: 1,
    scaleY: 1,
    height: "auto",
    display: "flex",
  },
};

const Sidebar = () => {
  const appContext = useContext(AppContext);
  const { data: user, status, update } = useSession();
  const { data, isLoading } = api.projects.getProjects.useQuery();
  const { data: joinedWorkspaces } = api.workspace.joined.useQuery();
  const router = useRouter();

  const handleWorkspaceSwitch = async (
    isOwn: boolean,
    workspaceId?: string
  ) => {
    await update({ workspaceId, isWorkspaceOwner: isOwn });
    window.location.href = "/dashboard";
  };
  return (
    <div className="fixed mb-4 overflow-y-auto min-w-[15%]">
      <div className="flex h-screen w-full flex-col border-r bg-white px-4 py-8 dark:border-gray-600 dark:bg-gray-800">
        <div className="mx-auto pb-4">
          <Logo width={100} />
        </div>
        {user?.user.isWorkspaceOwner && (
          <Link
            className={buttonVariants({
              variant: "primary",
              className: "mb-4 w-full justify-center",
            })}
            href={"/projects/create"}
          >
            <Plus className="mr-2" /> New Project
          </Link>
        )}
        <div className="w-full space-y-1 py-1">
        <Link
              className={buttonVariants({
                variant: "secondary",
                className: "w-full justify-start",
              })}
              href={"/inbox"}
            >
            <Inbox className="mr-2" /> Inbox
            </Link>
        </div>
        <div className="space-y-1 py-1">
          <Button
            className="z-50 w-full justify-start"
            variant={"secondary"}
            onClick={() => appContext?.handleSidebar("projects")}
          >
            <Folder className="mr-2" /> Projects
            {appContext?.activeSidebar === "projects" ? (
              <ChevronUp className="ml-auto" />
            ) : (
              <ChevronDown className="ml-auto" />
            )}
          </Button>

          <motion.div
            initial={"hidden"}
            animate={
              appContext?.activeSidebar === "projects" ? "shown" : "hidden"
            }
            transition={{ duration: 0.15 }}
            variants={variants}
            className={`ml-5 flex  flex-col border-l-2 pl-4`}
          >
            {isLoading && <Icons.spinner className="animate-spin" />}
            {data?.map((project) => (
              <Link
                key={project.id}
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "tree-btn relative w-full justify-start text-start",
                })}
                href={`/projects/${project.id}/conversation`}
              >
                {project.name}
              </Link>
            ))}
            {user?.user.isWorkspaceOwner && (
              <Link
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "tree-btn relative w-full justify-start text-start",
                })}
                href={"/projects/create"}
              >
                New Project
              </Link>
            )}
          </motion.div>
        </div>

        {user?.user.isWorkspaceOwner && (
          <div className="space-y-1 py-1">
            <Link
              className={buttonVariants({
                variant: "secondary",
                className: "w-full justify-start",
              })}
              href={"/clients"}
            >
              <User className="mr-2" />
              Clients
            </Link>
          </div>
        )}
        {user?.user.isWorkspaceOwner && <div className="space-y-1 py-1">
          <Link href={"/invoice/payments"}>
            <Button className="w-full justify-start" variant={"secondary"}>
              <Receipt className="mr-2" /> Invoices
            </Button>
          </Link>
        </div>}
        <div className="space-y-1 py-1">
          <Link
            className={buttonVariants({
              variant: "secondary",
              className: "w-full justify-start",
            })}
            href={"/services"}
          >
            <Scroll className="mr-2" />
            Services
          </Link>
        </div>
        <div className="mt-auto space-y-1 py-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="w-full justify-between">
                Workspace
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                disabled={user?.user?.isWorkspaceOwner}
                onClick={() => handleWorkspaceSwitch(true)}
              >
                Your Workspace
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              {joinedWorkspaces?.map((workspaces) => (
                <DropdownMenuItem
                  key={workspaces.workspace.id}
                  className="w-full"
                  disabled={workspaces.workspace.id === user?.user?.workSpaceId}
                  onClick={() =>
                    handleWorkspaceSwitch(false, workspaces.workspace.id)
                  }
                >
                  {workspaces.workspace.owner.name}
                  {"'s workspace"}{" "}
                  {workspaces.workspace.id === user?.user?.workSpaceId && "*"}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="w-full"
                onClick={() => router.push("/workspace")}
              >
                <Settings className="mr-2" size={18} /> Workspace Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="w-full"
                onClick={() => router.push("/checkout")}
              >
                <CreditCard className="mr-2" size={18} />
                Payment Providers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="mr-2" size={18} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
