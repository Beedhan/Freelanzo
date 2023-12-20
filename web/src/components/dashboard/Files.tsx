import "@uploadthing/react/styles.css";
import { format } from "date-fns";
import {
  Copy,
  DollarSignIcon,
  Download,
  FileUpIcon,
  LockIcon,
  MoreVertical,
  Trash2Icon,
  UnlockIcon,
  Upload,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/utils/api";
import { UploadDropzone } from "~/utils/uploadthing";
import SkeletonTable from "../shared/SkeletonTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import LockInvoice from "./Files/LockInvoice";
import { HOST_URL } from "~/utils/lib";

const Files = ({ projectId }: { projectId: string }) => {
  return (
    <div className="w-full p-5 pl-10">
      <ClientTable projectId={projectId} />
    </div>
  );
};

function ClientTable({ projectId }: { projectId: string }) {
  const { data: user } = useSession();
  const [fileId, setFileId] = useState("");
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const { data, isLoading, refetch } = api.files.getAll.useQuery({ projectId });
  const remove = api.files.remove.useMutation();
  const unlock = api.files.unlock.useMutation();
  const utils = api.useContext();

  const handleSuccess = async () => {
    setName("");
    setShowModal(false);
    // void utils.files.invalidate();
    await refetch();
  };

  const handleLockDialog = (id: string) => {
    setFileId(id);
    setShowLockDialog(true);
  };
  const handleNavigation = (id: string) => {
    window.open(`${HOST_URL}/invoice/pay/${id}`);
  };
  const handleDelete = (fileId: string) => {
    remove.mutate(
      { fileId },
      {
        onSuccess: () => {
          void utils.files.invalidate();
        },
      }
    );
  };
  const handleUnlock = (fileId: string) => {
    unlock.mutate(
      { fileId },
      {
        onSuccess: () => {
          void utils.files.invalidate();
        },
      }
    );
  };
  return (
    <>
      <div className="flex  w-full items-center gap-3">
        <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowModal(true)}>
              <Upload className="mr-2" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <h3>Upload File</h3>
            </DialogHeader>
            <DialogDescription>
              <Input
                placeholder="Enter File Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <UploadDropzone
                endpoint={"imageUploader"} // Your endpoint for file uploads.
                input={{ projectId, name }} // Any data you want to send with the upload.
                onClientUploadComplete={handleSuccess}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader className="w-[100px] font-bold">
          <TableRow>
            <TableHead className="font-bold text-slate-900"> Name</TableHead>
            {/* <TableHead className="font-bold text-slate-950">
              File Size
            </TableHead> */}
            <TableHead className="font-bold text-slate-950">Created</TableHead>
            <TableHead className="font-bold text-slate-950">Invoice</TableHead>
            <TableHead className="font-bold text-slate-950">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SkeletonTable rows={4} />
          ) : (
            data &&
            data.map((file) => (
              <TableRow key={file.id}>
                <TableCell className=" flex items-center gap-2 font-medium">
                  <FileUpIcon />
                  {file?.url ? (
                    <a href={file?.url} download={file.name} target="_blank">
                      {file.name}
                    </a>
                  ) : (
                    <span>{file.name}</span>
                  )}
                </TableCell>

                <TableCell>
                  {format(file.createdAt, "yyyy-mm-dd hh:mm")}
                </TableCell>
                <TableCell>{file.Invoice?.title || "No invoice"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} className=" justify-between">
                        <MoreVertical className="ml-auto h-4 w-4 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {file?.url ? (
                        <DropdownMenuItem>
                          <a
                            href={file?.url}
                            download={file.name}
                            target="_blank"
                            className="flex"
                          >
                            <Download className="mr-2" size={18} />
                            Download
                          </a>
                        </DropdownMenuItem>
                      ) : (
                        <></>
                      )}

                      <DropdownMenuSeparator />
                      {user?.user.isWorkspaceOwner ? (
                        <>
                          {file.Invoice ? (
                            <DropdownMenuItem
                              className="w-full cursor-pointer"
                              onClick={() => handleUnlock(file.id)}
                            >
                              <UnlockIcon className="mr-2" size={18} /> Unlock
                              File
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="w-full cursor-pointer"
                              onClick={() => handleLockDialog(file.id)}
                            >
                              <LockIcon className="mr-2" size={18} /> Lock With
                              Payment
                            </DropdownMenuItem>
                          )}
                        </>
                      ) : (
                        <>
                          {file.Invoice === null ? (
                            <></>
                          ) : (
                            file?.Invoice?.status !== "PAID" && (
                              <DropdownMenuItem
                                className="w-full cursor-pointer"
                                onClick={() =>
                                  handleNavigation(file?.Invoice?.id)
                                }
                              >
                                <DollarSignIcon className="mr-2" size={18} />{" "}
                                Pay Invoice
                              </DropdownMenuItem>
                            )
                          )}
                        </>
                      )}
                      <DropdownMenuItem className="w-full cursor-pointer">
                        <Copy className="mr-2" size={18} /> Copy URL
                      </DropdownMenuItem>

                      {user?.user.isWorkspaceOwner && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="w-full cursor-pointer bg-red-500 text-white hover:bg-red-600 focus:bg-red-600 focus:text-white"
                            onClick={() => handleDelete(file.id)}
                          >
                            <Trash2Icon className="mr-2" size={18} /> Remove
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog
        open={showLockDialog}
        onOpenChange={(open) => setShowLockDialog(open)}
      >
        <DialogContent>
          <DialogHeader>
            <h3>Lock File</h3>
          </DialogHeader>
          <LockInvoice fileId={fileId} setShowLockDialog={setShowLockDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Files;
