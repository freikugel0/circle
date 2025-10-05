import type { ThreadListing } from "@/typings/thread.type";
import { UserAvatar } from "./user-avatar";
import { DotIcon, HeartIcon, MessageSquareIcon } from "lucide-react";
import { baseImageUrl, cn, timeAgo } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import likeApi from "@/api/handler/like";
import { queryClient } from "@/api/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { Button } from "./ui";
import { Link } from "@tanstack/react-router";

export const ThreadItem = ({ thread }: { thread: ThreadListing }) => {
  const { mutate, isPending, variables, isError } = useMutation({
    mutationFn: likeApi.likeThread,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.threads.all });
    },
  });

  return (
    <div className="flex gap-4 items-start w-full px-2 py-4">
      <UserAvatar
        src={thread.author.photo_profile}
        alt={`@${thread.author.username}`}
        colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">@{thread.author.username}</h1>
            <div className="flex items-center text-sm text-secondary-foreground">
              {thread.author.full_name && (
                <span>{thread.author.full_name}</span>
              )}
              <DotIcon />
              <span>{timeAgo(thread.created_at)}</span>
            </div>
          </div>
          <Link
            className="font-semibold text-xl"
            to="/threads/$threadId"
            params={{ threadId: thread.id.toString() }}
          >
            {thread.title}
          </Link>
          {thread.image ? (
            <img
              className="rounded-md"
              src={`${baseImageUrl}/${thread.image}`}
              alt={`Thread ${thread.id}`}
            />
          ) : (
            <p>{thread.content}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <HeartIcon
              className={cn(
                "hover:cursor-pointer transition-colors",
                isPending
                  ? thread.liked
                    ? "fill-none stroke-white"
                    : "fill-red-300 stroke-red-300"
                  : thread.liked && "fill-red-300 stroke-red-300",
              )}
              onClick={() => mutate(thread.id)}
            />{" "}
            {isPending ? (
              <span>
                {thread.liked
                  ? thread._count.likes - 1
                  : thread._count.likes + 1}
              </span>
            ) : (
              <span>{thread._count.likes}</span>
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
          <div className="flex items-center gap-2">
            <MessageSquareIcon className="hover:cursor-pointer" />
            <span>{thread._count.replies}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
