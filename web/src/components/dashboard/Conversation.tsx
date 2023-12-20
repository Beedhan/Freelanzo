"use client";
import React from "react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Toggle } from "../ui/toggle";
import { MoreVertical, Star } from "lucide-react";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { api } from "~/utils/api";
import { toast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import LinkParser from "react-link-parser";
import { formatDistance } from "date-fns";

const FormSchema = z.object({
  projectId: z.string(),
  message: z.string().nonempty({ message: "Message is required" }),
});

const watchers = [
  {
    watchFor: "link",
    render: (url: string) => (
      <a href={url} target="_blank" rel="noreferrer noopener">
        {url}
      </a>
    ),
  },
  {
    watchFor: "email",
    render: (url: string) => (
      <a href={"mailto:" + url} target="_blank" rel="noreferrer noopener">
        {url.replace("@", "[at]")}
      </a>
    ),
  },
];

const Conversation = ({ projectId }: { projectId: string }) => {
  const { mutate, isLoading } = api.conversation.sendMessage.useMutation();
  const { data: user } = useSession();
  const { data } = api.conversation.getMessages.useQuery(
    {
      projectId,
    },
    {
      // onSuccess:()=>{
      //   document?.querySelector(".messageContainer")?.scrollTo(0, 100000000000);
      // },
      refetchInterval: 1000,
    }
  );
  const utils = api.useContext();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { projectId },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    mutate(data, {
      onSuccess() {
        form.setValue("message", "");
        document?.querySelector(".messageContainer")?.scrollTo(0, 100000000000);
        void utils.conversation.invalidate();
      },
      onError(error) {
        toast({ title: error.message });
      },
    });
  }
  return (
    <div className="messageContainer relative mt-auto flex h-[75vh] w-full flex-col overflow-y-auto overflow-x-hidden">
      <div className="pb-10">
        <h1 className="mt-5 text-center text-4xl font-semibold text-slate-500">
          This is the very beginning of this project
        </h1>
        {data?.map((message) => (
          <>
            {user?.user.id === message.userId ? (
              <div key={message.id} className=" mt-2 grid  w-full  pr-12 ">
                <div className="flex w-full items-center gap-2 py-2 "></div>
                <HoverCard openDelay={100}>
                  <HoverCardTrigger asChild>
                    <p className="min-w-32 ml-auto rounded-full bg-primary px-3 py-2 text-right text-[16px] text-white">
                      <LinkParser watchers={watchers}>
                        {message.text}
                      </LinkParser>
                    </p>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto">
                    <p className="text-center text-gray-500">{formatDistance(message.createdAt,new Date(),{addSuffix:true})}</p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ) : (
              <div key={message.id} className=" mt-2 grid  w-full  pr-12 ">
                <h3 className="text-my text-sm font-medium">
                  {message.user.name}
                </h3>
                <div className="flex w-full items-center gap-2 py-2 ">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src="https://github.com/beedhan.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <HoverCard openDelay={100}>
                    <HoverCardTrigger asChild>
                      <p className="min-w-32 mr-auto rounded-full border border-gray-500 px-3 py-2 text-right text-[16px]  ">
                      <LinkParser watchers={watchers}>
                        {message.text}
                      </LinkParser>
                      </p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto origin-bottom">
                    <p className="text-center text-gray-500">{formatDistance(message.createdAt,new Date(),{addSuffix:true})}</p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            )}
          </>
        ))}
      </div>
      <div className="relative z-50 mt-14 w-full bg-white">
        <div className="fixed bottom-0  z-50 my-5 mt-10   flex w-3/5 gap-4 bg-white">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2 bg-white"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Type a message..."
                        {...field}
                        className="w-full bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading}>Send</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
