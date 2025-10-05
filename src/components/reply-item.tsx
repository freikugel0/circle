import type { ReplyListing } from "@/typings/reply.type";
import { UserAvatar } from "./user-avatar";
import {
  DotIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  Trash2Icon,
} from "lucide-react";
import { baseImageUrl, cn, timeAgo } from "@/lib/utils";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
  Button,
} from "@/components/ui";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import likeApi from "@/api/handler/like";
import { queryClient } from "@/api/queryClient";
import { queryKeys } from "@/lib/queryKeys";

export const ReplyItem = ({ reply }: { reply: ReplyListing }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { mutate, isPending, variables, isError } = useMutation({
    mutationFn: likeApi.likeReply,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.threads.replies,
      });
    },
  });

  return (
    <div className="flex gap-2 items-start w-full px-2 py-4">
      <UserAvatar
        src={reply.author.photo_profile}
        alt={`@${reply.author.username}`}
        colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
      />
      <div className="flex justify-between items-start gap-4 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">@{reply.author.username}</h1>
              <div className="flex items-center text-sm text-secondary-foreground">
                {reply.author.full_name && (
                  <span>{reply.author.full_name}</span>
                )}
                <DotIcon />
                <span>{timeAgo(reply.created_at)}</span>
              </div>
            </div>
            <p className="whitespace-pre-wrap">{reply.content}</p>
            {reply.image && (
              <img
                className="rounded-md"
                src={`${baseImageUrl}/${reply.image}`}
                alt={`Thread ${reply.id}`}
              />
            )}
          </div>
          <div className="flex items-start gap-2">
            <HeartIcon
              className={cn(
                "hover:cursor-pointer transition-colors",
                isPending
                  ? reply.liked
                    ? "fill-none stroke-white"
                    : "fill-red-300 stroke-red-300"
                  : reply.liked && "fill-red-300 stroke-red-300",
              )}
              onClick={() => mutate(reply.id)}
            />{" "}
            {isPending ? (
              <span>
                {reply.liked ? reply._count.likes - 1 : reply._count.likes + 1}
              </span>
            ) : (
              <span>{reply._count.likes}</span>
            )}
            {isError && (
              <Button
                className="hover:cursor-pointer"
                variant={"ghost"}
                type="button"
                onClick={() => mutate(variables)}
              >
                <span className="text-red-500">Retry</span>
              </Button>
            )}
          </div>
        </div>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:cursor-pointer"
            >
              <EllipsisVerticalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-4">
              {[
                {
                  icon: Trash2Icon,
                  label: "Delete Reply",
                  action: () => {},
                },
              ].map((i) => (
                <button
                  type="button"
                  key={i.label}
                  onClick={() => {
                    i.action();
                    setPopoverOpen(false);
                  }}
                >
                  <div className="flex items-center gap-4 px-4 py-2 rounded-full hover:bg-accent hover:cursor-pointer transition-all">
                    <i.icon />
                    <span>{i.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
