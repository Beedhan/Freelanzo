"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/utils/api";
import { TRPCClientError } from "@trpc/client";
import { Icons } from "../Icons";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

export default function InviteForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const utils = api.useContext();
  const mutation = api.workspace.invite.useMutation({
    onError(error) {
      console.log(error, "api error");
      if (error instanceof TRPCClientError) {
        toast({
          title: error.message,
        });
      }
    },
    onSuccess(data) {
      console.log(data)
      form.reset();
      void utils.workspace.getClients.invalidate();
      toast({
        title: "Invitation sent!",
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutation.mutate(data);
  }

  return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="opacity-70">Email Address</FormLabel>
              <FormControl>
                <Input className="w-1/2" placeholder="user@app.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"default"} disabled={mutation.isLoading}>
        {mutation.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )} Invite
          </Button>
      </form>
    </Form>
  );
}
