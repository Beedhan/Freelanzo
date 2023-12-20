"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { api } from "~/utils/api";
import { cn } from "~/utils/lib";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContentDate, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Icons } from "../Icons";
const FormSchema = z.object({
  due: z.date({
    required_error: "A due date is required.",
  }),
  clientId: z.string(),
  serviceId: z.string(),
  projectId: z.string(),
  amount: z.number(),
  title: z.string(),
});

const CreateForm = ({setIsOpen}:{setIsOpen:(state:boolean)=>void}) => {
  const router = useRouter();
  const { data: clients } = api.workspace.joinedClients.useQuery();
  const { data: services } = api.services.services.useQuery();
  const { data: projects } = api.projects.getProjects.useQuery();
  const { mutate,isLoading } = api.invoice.create.useMutation();
  const utils = api.useContext();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    mutate(data, {
      onSuccess() {
        form.reset();
        toast({ title: "Create invoice success" });
        setIsOpen(false);
        void utils.invoice.invalidate();
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Invoice no or title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice for</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem
                      key={client.user.id}
                      value={client.user.id}
                      className="flex items-center justify-between"
                    >
                      <span>{client.user?.email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select onValueChange={(value)=>{
                console.log(value)
                const service = services?.find((service)=>service.id===value)
                if(service){
                  form.setValue("amount",service?.price)
                  form.setValue("serviceId",service?.id)
                }
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services?.map((service) => (
                    <SelectItem
                      key={service.id}
                      value={service.id}
                      className="flex items-center justify-between"
                    >
                      <span>{service.name}</span>
                    </SelectItem>
                  ))}
                  <Button
                    className="flex w-full items-center "
                    onClick={() => router.push("/services")}
                    variant={"ghost"}
                  >
                    <Plus /> <span>Add New</span>
                  </Button>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects?.map((project) => (
                    <SelectItem
                      key={project.id}
                      value={project.id}
                      className="flex items-center justify-between"
                    >
                      <span>{project.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Invoice amount"
                  type="number"
                  {...field}
                  onChange={(e) =>
                    form.setValue("amount", e.target.valueAsNumber)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="due"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContentDate className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContentDate>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"default"} className="w-full justify-center" disabled={isLoading}>
          {isLoading&& <Icons.spinner className="animate-spin mr-2"/>}
          Submit
          </Button>
      </form>
    </Form>
  );
};

export default CreateForm;
