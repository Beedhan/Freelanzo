/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";
import { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Tasks from "~/components/dashboard/Tasks";
import Conversation from "~/components/dashboard/Conversation";
import Files from "~/components/dashboard/Files";
import Deliverables from "~/components/dashboard/Deliverables";
import Invoices from "~/components/dashboard/Invoices";
import InternalNotes from "~/components/dashboard/InternalNotes";
import { api } from "~/utils/api";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const page = ({ params }: { params: { id: string[] } }) => {
  const { data: user } = useSession();

  const router = useRouter();
  const projectId = params?.id[0] as string;
  const { data } = api.projects.getProject.useQuery({
    projectId: params?.id[0] as string,
  });
  const [activeTab, setActiveTab] = useState(params?.id[1]);
  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
    router.push(`/projects/${params?.id[0] as string}/${tab}`);
  };
  return (
    <div className="w-full p-5 pl-10">
      <Head>
        <title>{data?.name}</title>
      </Head>
      <div className="flex gap-4">
        <div>
          <h1 className="text-2xl font-bold">{data?.name}</h1>
          {data?.description&&<div className="flex gap-1">
            <Briefcase size={20} />
            <h4>{data?.description}</h4>
          </div>}
        </div>
      </div>
      <Tabs defaultValue={activeTab} className="mt-2 w-full">
        <TabsList className="grid w-full grid-cols-5 bg-blue-100 ">
          <TabsTrigger
            value="conversation"
            onClick={() => handleActiveTab("conversation")}
          >
            Conversation
          </TabsTrigger>
          <TabsTrigger value="tasks" onClick={() => handleActiveTab("tasks")}>
            Tasks
          </TabsTrigger>
          <TabsTrigger value="files" onClick={() => handleActiveTab("files")}>
            Files
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            onClick={() => handleActiveTab("invoices")}
          >
            Invoices
          </TabsTrigger>

          {user?.user.isWorkspaceOwner && <TabsTrigger value="notes" onClick={() => handleActiveTab("notes")}>
            Internal Notes
          </TabsTrigger>}
        </TabsList>
        <TabsContent value="conversation">
          <Conversation projectId={projectId} />
        </TabsContent>
        <TabsContent value="tasks">
          <Tasks projectId={params?.id[0] as string} />
        </TabsContent>
        <TabsContent value="files">
          <Files projectId={params?.id[0] as string} />
        </TabsContent>
        <TabsContent value="invoices">
          <Invoices projectId={projectId} />
        </TabsContent>
        {user?.user.isWorkspaceOwner && <TabsContent value="notes">
          <InternalNotes projectId={projectId} />
        </TabsContent>}
      </Tabs>
    </div>
  );
};

export default page;
