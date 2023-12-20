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
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export default function PasswordForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const utils = api.useContext();
  const mutation = api.account.setPassword.useMutation({
    onError(error) {
      console.log(error, "api error");
      if (error instanceof TRPCClientError) {
        toast({
          title: error.message,
        });
      }
    },
    onSuccess(data) {
      console.log(data);
      void utils.account.passwordStatus.invalidate();
      toast({
        title: "Password set successfully!",
      });
    },
  });

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    mutation.mutate(formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-2">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="opacity-70">Password</FormLabel>
              <FormControl>
                <Input className="w-1/2" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}{" "}
          Create
        </Button>
      </form>
    </Form>
  );
}
