"use client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { toast } from "~/components/ui/use-toast";
import type { StripeDialogProps } from "~/utils/types";
import { Icons } from "../Icons";
import { Settings } from "lucide-react";
import { useState } from "react";

const FormSchema = z.object({
  public_key: z
    .string()
    .regex(/^pk_test_.*/)
    .min(1),
  secret_key: z
    .string()
    .regex(/^sk_test_.*/)
    .min(1),
});

export default function StripeDialog() {
  const utils = api.useContext();
  const { mutate, isLoading } = api.checkout.setStripe.useMutation();
  const { data } = api.checkout.getStripe.useQuery();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      public_key: data?.Stripe?.public_key ?? "",
      secret_key: data?.Stripe?.secret_key ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Services created successfully",
        });
        void utils.checkout.invalidate();
        setOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
        });
      },
    });
  }
  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="my-3 flex w-full justify-between py-8 text-xl"
          variant={"outline"}
        >
          <svg
            width="2500"
            height="1045"
            className="w-14"
            viewBox="0 0 512 214"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
          >
            <path
              d="M35.982 83.484c0-5.546 4.551-7.68 12.09-7.68 10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92 0 6.541-5.688 8.675-13.653 8.675-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106 29.582 0 49.92-14.648 49.92-40.106-.142-42.382-54.329-34.845-54.329-50.774zm96.142-66.986l-34.702 7.395-.142 113.92c0 21.05 15.787 36.551 36.836 36.551 11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022l.142-30.862zm71.112 41.386L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524zm38.257-10.524h35.698v124.444h-35.698V47.36zm0-10.809l35.698-7.68V0l-35.698 7.538V36.55zm109.938 8.391c-13.938 0-22.898 6.542-27.875 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96 25.458 0 48.64-20.48 48.64-65.564-.142-41.245-23.609-63.716-48.498-63.716zm-8.533 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968 12.942 0 21.902 14.506 21.902 33.137 0 19.058-8.818 33.28-21.902 33.28zM512 110.08c0-36.409-17.636-65.138-51.342-65.138-33.85 0-54.33 28.73-54.33 64.854 0 42.808 24.179 64.426 58.88 64.426 16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658zm-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756 8.675 0 17.92 6.685 17.92 22.756h-36.694z"
              fill="#6772E5"
            />
          </svg>
          <span className="flex w-full items-center justify-between px-4">
            Stripe
            <Settings />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[555px]">
        <DialogHeader>
          <DialogTitle>Connect Stripe</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="public_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Public Key</FormLabel>
                    <FormControl>
                      <Input placeholder="pk_" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secret_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Key</FormLabel>
                    <FormControl>
                      <Input placeholder="sk_" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
