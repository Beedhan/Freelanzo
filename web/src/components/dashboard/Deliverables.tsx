import { Plus, SearchIcon, SlidersHorizontal, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";


import { Label } from "@radix-ui/react-label";
import {
  Table,
  TableCaption
} from "~/components/ui/table";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";



const page = () => {
  return <div className="w-full p-5 pl-10">

  </div>;
};

function Deliverables() {
  return (
    <div>
      <div className="flex  gap-3 items-center">
        <Button className="flex gap-3"> <Plus /> New Invoice</Button>
        <div className="flex ml-auto w-[20%]  gap-3 items-center  relative">
          <input className="bg-blue-100 py-2 px-12  rounded-md" type="text" placeholder="  Search" />
          <SearchIcon className="absolute left-1 " color="#004bad" />
          <SlidersHorizontal className="absolute right-0" color="#004bad" />
        </div>
      </div>
      <Table>
        <img className="block mx-auto my-5" width={200} src="/assets/working.svg" alt="" />
        <h1 className="flex text-3xl font-bold justify-center text-slate-700">No project deliverables</h1>
        <TableCaption>Protect yourself from getting burned. Deliver files only after clients pay.</TableCaption>
      </Table>
      <div className="flex justify-center gap-5 items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="my-5">New deliverable</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[825px]">
            <DialogHeader>
              <DialogTitle>Add deliverable</DialogTitle>
            </DialogHeader>
            <div className="width-full h-24 flex justify-center items-center border-2 border-dotted  rounded-md">

              <text className="flex gap-3 text-xl font-bold"> <Upload /> Upload Files</text>
            </div>
            <div className="grid gap-4 py-4">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Settings
              </h4>
              <div className="grid grid-cols-1 items-center gap-4 ">
                <RadioGroup defaultValue="comfortable">
                  <div className="flex-col items-center space-x-2">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">Available</Label>
                    <Label htmlFor="r1" className="block text-muted-foreground text-sm">client can fetch the deliverable immediately</Label>

                  </div>
                  <div className="flex-col items-center space-x-2 w-full">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Protrcted with Payment </Label>
                    <Label htmlFor="r2" className="block text-muted-foreground text-sm">client must pay in order to fetch the deliverable </Label>

                  </div>

                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button variant={"ghost"}>Cancel</Button>
              <Button type="submit">Save </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>

  )
}



export default Deliverables;
