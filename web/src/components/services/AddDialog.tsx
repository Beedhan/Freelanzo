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
import type { AddDialogProps } from "~/utils/types";
import { Icons } from "../Icons";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  price: z.number().min(0),
});

export default function AddDialog({ editing, setEditing }: AddDialogProps) {
  const utils = api.useContext();
  const { mutate, isLoading } = api.services.add.useMutation();
  const { mutate: edit, isLoading: isEditing } =
    api.services.edit.useMutation();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      name: editing.name,
      price: editing.price,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (editing.id) {
      edit(
        { id: editing.id, ...data },
        {
          onSuccess: () => {
            toast({
              title: "Services edited successfully",
            });
            void utils.services.invalidate();
            setEditing({ id: "", open: false, name: "", price: 0 });
          },
        }
      );
      return;
    }
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Services created successfully",
        });
        void utils.services.invalidate();
        setEditing({ id: "", open: false, name: "", price: 0 });
      },
    });
  }
  return (
    <Dialog
      open={editing.open}
      onOpenChange={(value) =>
        setEditing({ id: "", open: value, name: "", price: 0 })
      }
    >
      <DialogTrigger asChild>
        <Button>Create Service</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[555px]">
        <DialogHeader>
          <DialogTitle>Create new service</DialogTitle>
        </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Web development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2.99"
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(parseFloat(event.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading||isEditing}>
                {(isEditing || isLoading) && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </form>
          </Form>
      </DialogContent>
    </Dialog>
  );
}
