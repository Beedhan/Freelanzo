import { ArrowDownUpIcon, FilterIcon, InfoIcon, MoreHorizontal, ScrollIcon, SearchIcon, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";


import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";

const invoices = [
    {
        Title: "Rakesh Quote",
        price: "$5",
        status: "Draft",
        author: "https://github.com/shadcn.png",
        update: "apr 28, 2023",
    },
    {
        Title: "Beedhan Quote",
        price: "$5",
        status: "Expired",
        author: "https://github.com/shadcn.png",
        update: "apr 28, 2023",
    },
    {
        Title: "Nawaraj Quote",
        price: "$5",
        status: "Draft",
        author: "https://github.com/shadcn.png",
        update: "apr 28, 2023",
    },
    {
        Title: "Rupesh Quote",
        price: "$5",
        status: "Draft",
        author: "https://github.com/shadcn.png",
        update: "apr 28, 2023",
    },
    {
        Title: "Niraj Quote",
        price: "$5",
        status: "Draft",
        author: "https://github.com/shadcn.png",
        update: "apr 28, 2023",
    },
    {
        Title: "Raj Quote ",
        price: "$5",
        status: "Expired",
        author: "https://github.com/shadcn.png",
        update: "apr 28, 2023",
    },
    {
        Title: "Prakash Quote",
        price: "$5",
        status: "Draft",
        author: "https://github.com/shadcn.png",
        update: "apr 28, 2023",
    },
]
const page = () => {
    return <div className="w-full p-5 pl-10">
        <ClientTable />
    </div>;
};

function ClientTable() {
    return (
        <div>
            <div className="flex ml-auto w-[20%]  gap-3 items-center  relative my-4">
                <input className="bg-blue-100 py-2 px-12  rounded-md" type="text" placeholder="  Search" />
                <SearchIcon className="absolute left-1 " color="#004bad" />
                <SlidersHorizontal className="absolute right-0" color="#004bad" />
            </div>
            <div className="flex justify-end gap-5 items-center">
                <FilterIcon />
                <InfoIcon />
                <ArrowDownUpIcon />
                <MoreHorizontal />
                <Button>New Quote</Button>
            </div>
            <Table>
                <TableCaption>A list of your Quotes.</TableCaption>
                <TableHeader className="w-[100px] font-bold">
                    <TableRow >
                        <TableHead className="font-bold text-slate-900"> Title</TableHead>
                        <TableHead className="font-bold text-slate-950">Price</TableHead>
                        <TableHead className="font-bold text-slate-950">Status</TableHead>
                        <TableHead className="font-bold text-slate-950"  >Author</TableHead>
                        <TableHead className="font-bold text-slate-950" >Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((Title) => (
                        <TableRow className="text-slate-500" key={Title.Title}>
                            <TableCell className=" flex items-center gap-2 font-medium"><ScrollIcon /> {Title.Title}</TableCell>
                            <TableCell>{Title.price}</TableCell>
                            <TableCell><Badge className={Title.status === "Expired" ? "bg-slate-500 " : "bg-orange-400"}> {Title.status}</Badge></TableCell>
                            <TableCell><Avatar>
                                <AvatarImage src={Title.author} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar></TableCell>
                            <TableCell>{Title.update}</TableCell>


                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}


export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard page",
};

export default page;
