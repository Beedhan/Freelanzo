import { PlusCircle, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

const FormSchema = z.object({
  projectId: z.string(),
  message: z.string().nonempty({ message: "Message is required" }),
});

const InternalNotes = ({ projectId }: { projectId: string }) => {
  const { mutate, isLoading } = api.conversation.sendInteralNote.useMutation();
  const { mutate:deleteInternal } = api.conversation.deleteInternalNotes.useMutation();
  const utils = api.useContext();
  const { data } = api.conversation.getInternalNotes.useQuery({
    projectId,
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { projectId },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    mutate(data, {
      onSuccess() {
        form.setValue("message", "");
        void utils.conversation.invalidate();
      },
      onError(error) {
        toast({ title: error.message });
      },
    });
  }
  const handleDelete = (id:string) => {
    deleteInternal({id},{
      onSuccess() {
        void utils.conversation.invalidate();
      },
    });
  }
  return (
    <div className="relative flex w-full flex-col justify-end">
      <div className="bottom-0 mx-1 my-5 flex w-full  gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
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
            <Button disabled={isLoading}>
              <PlusCircle className="mr-2" />
              Save
            </Button>
          </form>
        </Form>
      </div>

      {data?.map((note) => (
        <div className="mt-4 grid w-full  pr-24" key={note.id}>
          <div className=" flex w-full items-center justify-between gap-2 py-2 ">
            <p className="ml-10 text-lg">{note.text}</p>
            <Button size={"sm"} variant={"destructive"} onClick={()=>handleDelete(note.id)}><Trash size={18}/></Button>
          </div>
          <div className="mt-2 h-0.5 w-full bg-slate-200">
          </div>
        </div>
      ))}
    </div>
  );
};

export default InternalNotes;
