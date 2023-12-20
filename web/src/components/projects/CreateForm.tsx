"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm, UseFormProps } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";
import { cn } from "~/utils/lib";
import { toast } from "../ui/use-toast";
import { Icons } from "../Icons";

export const CreateProjectSchema = z.object({
  title: z.string().min(1).max(15),
  description: z.string().max(255).optional(),
  deadLine: z.date(),
});

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

const CreateForm = () => {
  const router = useRouter();
  const utils = api.useContext();
  const [open, setOpen] = React.useState(false);
  const mutation = api.projects.create.useMutation({
    onError(error, variables, context) {
      console.log(error, "api error");
      toast({
        title: error.message,
        // action: (
        //   <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
        // ),
      });
    },
    onSuccess(data, variables, context) {
      if (data) {
        void utils.projects.invalidate();
        router.push(`/projects/${data.projectId}/conversation`);
      }
    },
  });
  const methods = useZodForm({
    schema: CreateProjectSchema,
    defaultValues: {
      title: "",
      description: "",
      deadLine: new Date(),
    },
  });

  return (
    <form
      onSubmit={methods.handleSubmit(async (values) => {
        await mutation.mutateAsync(values);
        methods.reset();
      })}
      className=" my-auto w-full max-w-sm "
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="project-title">Project Name</Label>
          <Input
            type="text"
            id="project-title"
            placeholder="New Project"
            onChange={(e) => methods.setValue("title", e.target.value)}
          />
          {methods.formState.errors.title?.message && (
            <p className="my-2 text-red-700">
              {methods.formState.errors.title?.message}
            </p>
          )}

          <Label htmlFor="project-description">
            Project Description (Optional)
          </Label>
          <Textarea
            placeholder="Type your message here."
            id={"project-description"}
            onChange={(e) => methods.setValue("description", e.target.value)}
          />
          {methods.formState.errors.description?.message && (
            <p className="my-2 text-red-700">
              {methods.formState.errors.description?.message}
            </p>
          )}
          <Label htmlFor="project-deadline">Estimated Deadline</Label>
          <Popover open={open} onOpenChange={(val)=>setOpen(val)}>
            <PopoverTrigger asChild>
              <Button
                id={"project-deadline"}
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !methods.getValues("deadLine") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {methods.getValues("deadLine") ? (
                  format(methods.getValues("deadLine"), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={methods.getValues("deadLine")}
                onSelect={(date) => {
                  date && methods.setValue("deadLine", date);
                  setOpen(false);
              }}
                initialFocus
              />
            </PopoverContent>
            {methods.formState.errors.deadLine?.message && (
              <p className="my-2 text-red-700">
                {methods.formState.errors.deadLine?.message}
              </p>
            )}
          </Popover>
        </CardContent>
        <CardFooter>
          <Button
            variant={"default"}
            disabled={mutation.isLoading}
            className={"mt-5  w-full"}
            type="submit"
          >
            {mutation.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Project
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreateForm;
