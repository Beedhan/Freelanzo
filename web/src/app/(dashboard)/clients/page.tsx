"use client";
import { Accordion } from "@radix-ui/react-accordion";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "~/components/shared/Container";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { buttonVariants } from "~/components/ui/button";
import { api } from "~/utils/api";

const Client = () => {
  const { data } = useSession();
  const router = useRouter();
  if (!data?.user.isWorkspaceOwner) {
    return router.replace("/404");
  }
  return (
    <div className="w-full p-5 pl-10">
      <ClientTable />
    </div>
  );
};

function ClientTable() {
  const { data } = api.workspace.clients.useQuery();
  return (
    <div>
      <div className="flex items-center justify-between gap-5 pt-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-custom lg:text-2xl">
          Clients
        </h1>
        <Link
          className={buttonVariants({
            variant: "primary",
            className: "mb-4 justify-center",
          })}
          href={"/workspace"}
        >
          <Plus /> New Client
        </Link>
      </div>
      <Container className="border-0 shadow-none">
        {data?.UsersOnWorkspaces.map((client) => (
          <Accordion type="single" collapsible key={client.userId}>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Image
                    src={client.user?.image as string}
                    width={30}
                    height={30}
                    className="rounded-full"
                    alt="profile"
                  />
                  <span>{client.user?.name}</span>
                  <p>{client.user?.email}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <h3 className="mb-2 scroll-m-20 text-4xl font-medium tracking-tight lg:text-xl">
                    Projects
                  </h3>
                  <div className="flex flex-col gap-2">
                    {client.user.UsersOnProjects.map((project) => (
                      <main
                        className="w-full border px-1 py-2 shadow-sm"
                        key={project.projectId}
                      >
                        <p className="text-md">{project.project.name}</p>
                        <p className="text-md">
                          {format(project.project.deadLine, "yyyy/MM/dd")}
                        </p>
                      </main>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 scroll-m-20 text-4xl font-medium tracking-tight lg:text-xl">
                    Invoices
                  </h3>
                  <div className="my-2 flex flex-col gap-2">
                    {client.user.Invoice.map((invoice) => (
                      <main
                        className="text-md flex w-full justify-between border px-1 py-2 shadow-sm"
                        key={invoice.id}
                      >
                        <p className="text-md">{invoice.title}</p>
                        <p className="text-md text-center">{invoice.status}</p>
                        <p className="text-md">
                          {format(invoice.dueDate, "yyyy/MM/dd")}
                        </p>
                      </main>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </Container>
    </div>
  );
}

export default Client;
