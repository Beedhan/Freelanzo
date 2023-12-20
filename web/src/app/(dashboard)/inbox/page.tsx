"use client";
import { formatDistance } from "date-fns";
import { Icons } from "~/components/Icons";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
const Inbox = () => {
  const { data,isLoading } = api.notification.get.useQuery();
  const { mutate, isLoading: marking } =
    api.notification.markAsRead.useMutation();
  const utils = api.useContext();

  const handleMarkAllAsRead = () => {
    mutate(undefined,{
        onSuccess: () => {
            void utils.notification.invalidate();
        }
    });
  };
  return (
    <div className="w-4/5 px-24 pt-10">
      <div className="mb-2 flex w-full justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-custom scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-2xl">
            Inbox
          </h1>
          <p className="my-auto rounded bg-primary px-2 py-1 text-sm text-white">
            {data?.unreadCount || 0}
          </p>
        </div>
        <Button variant={"ghost"} onClick={handleMarkAllAsRead}>
          {marking ? (
            <Icons.spinner className="animate-spin" />
          ) : (
            "Mark all as read"
          )}
        </Button>
      </div>
      {data?.notifications?.map((notification) => (
        <div
          className={`grid w-full items-center my-2 gap-1 rounded border p-2 text-card-foreground shadow-sm ${notification.read?"bg-card":"bg-slate-100"}`}
          key={notification.id}
        >
          <Badge className="w-fit py-2 text-center">{notification.type}</Badge>
          <p>{notification.text}</p>
          <span className="text-sm text-slate-500">
            {formatDistance(notification.createdAt, new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Inbox;
