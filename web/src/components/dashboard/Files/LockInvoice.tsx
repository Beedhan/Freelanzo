import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { api } from "~/utils/api";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/Icons";
import { toast } from "~/components/ui/use-toast";
const FormSchema = z.object({
  invoiceId: z.string(),
  fileId:z.string()
});
const LockInvoice = ({fileId,setShowLockDialog}:{fileId:string,setShowLockDialog:(v:boolean)=>void}) => {
  const { data: invoices } = api.invoice.getAll.useQuery();
  const utils = api.useContext();
  const { mutate,isLoading } = api.files.lock.useMutation();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues:{
        fileId
    }
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(data, {
      onSuccess() {
        form.reset();
        toast({ title: "File locked with invoice" });
        void utils.invoice.invalidate();
        setShowLockDialog(false);
      },
      onError(error) {
        toast({ title: error.message });
      },
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
      <FormField
          control={form.control}
          name="invoiceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Invoice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select invoice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent asChild>
                  {invoices?.map((invoice) => (
                    <SelectItem
                      key={invoice.id}
                      value={invoice.id}
                      className="flex items-center justify-between"
                    >
                      <span>{invoice.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <Button type="submit" className="w-full justify-center bg-primary" variant={"default"} disabled={isLoading}>
          {isLoading&& <Icons.spinner className="animate-spin mr-2"/>}
          Submit
          </Button>
      </form>
    </Form>
  )
};

export default LockInvoice;
