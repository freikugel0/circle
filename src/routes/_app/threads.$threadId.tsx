import likeApi from "@/api/handler/like";
import replyApi from "@/api/handler/reply";
import threadApi from "@/api/handler/thread";
import { queryClient } from "@/api/queryClient";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Spinner,
} from "@/components/ui";
import TextareaAutosize from "react-textarea-autosize";
import { UserAvatar } from "@/components/user-avatar";
import { queryKeys } from "@/lib/queryKeys";
import {
  baseImageUrl,
  cn,
  getData,
  showErrorToast,
  timeAgo,
} from "@/lib/utils";
import { replySchema } from "@/schemas/reply.schema";
import type { ReplyPayload } from "@/typings/reply.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  AtSignIcon,
  DotIcon,
  HeartIcon,
  ImagePlusIcon,
  MessageSquareIcon,
  SendIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { ReplyItem } from "@/components/reply-item";
import { useFilePicker } from "use-file-picker";
import {
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import { t } from "@/locales";

export const Route = createFileRoute("/_app/threads/$threadId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const threadId = Number(params.threadId);
    if (isNaN(threadId)) throw redirect({ to: "/" });

    return {
      threadId,
    };
  },
});

function RouteComponent() {
  const { threadId } = Route.useLoaderData();

  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKeys.threads.details, threadId],
    queryFn: () => getData(threadApi.getDetailsThread(threadId)),
  });

  const {
    data: repliesData,
    isLoading: repliesIsLoading,
    error: repliesError,
  } = useQuery({
    queryKey: [...queryKeys.threads.replies, threadId],
    queryFn: () => getData(replyApi.getThreadReplies(threadId)),
  });

  const {
    mutate: mutateLike,
    isPending: isPendingLike,
    variables: variablesLike,
    isError: isErrorLike,
  } = useMutation({
    mutationFn: likeApi.likeThread,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.threads.all });
    },
  });

  const form = useForm({
    resolver: zodResolver(replySchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  // TODO: Refactor image picker feature to multiple images
  // TODO: Add delete button pre-upload preview image
  const { openFilePicker, filesContent, clear } = useFilePicker({
    readAs: "DataURL",
    accept: [".jpg", ".png"],
    multiple: false,
    validators: [
      new FileTypeValidator(["jpg", "png"]),
      new FileSizeValidator({ maxFileSize: 3 * 1024 * 1024 }), // 3MB
    ],
    onFilesSelected: ({ plainFiles }) => {
      form.setValue("file", plainFiles);
    },
    onFilesRejected: ({ errors }) => {
      errors.forEach((e) => {
        if (e.name === "FileSizeError") {
          const msg = `${e.causedByFile.name}: ${t("FILE_TOO_LARGE")}`;
          showErrorToast(new Error(msg));
        }
      });
    },
  });

  const { mutate: mutateReply, isPending } = useMutation({
    mutationFn: replyApi.createThreadReply,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.threads.replies,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.threads.details,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.threads.all,
        }),
      ]);

      form.reset();
      clear();
    },
  });

  const onSubmit = async (val: ReplyPayload) =>
    mutateReply({
      threadId,
      payload: val,
    });

  return (
    <div className="flex flex-col gap-4 w-full overflow-auto p-4">
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} size={"icon"} asChild>
          <Link to="/">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <h1 className="font-semibold text-xl">Status</h1>
      </div>
      {isLoading ? (
        <div className="p-12 flex justify-center w-full">
          <Spinner variant="ellipsis" />
        </div>
      ) : error ? (
        <span>Error while fetching replies</span>
      ) : (
        data && (
          <div className="flex flex-col gap-4 items-start w-full px-2 py-4">
            <div className="flex gap-2">
              <UserAvatar
                src={data.thread.author.photo_profile}
                alt={`@${data.thread.author.username}`}
                colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <h1 className="font-semibold">
                    @{data.thread.author.username}
                  </h1>
                  <DotIcon />
                  <span>{timeAgo(data.thread.created_at)}</span>
                </div>
                <div className="flex text-sm text-secondary-foreground">
                  {data.thread.author.full_name && (
                    <span>{data.thread.author.full_name}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="font-semibold text-xl">{data.thread.title}</h1>
              {data.thread.image && (
                <img
                  className="rounded-md"
                  src={`${baseImageUrl}/${data.thread.image}`}
                  alt={`Thread ${data.thread.id}`}
                />
              )}
              <p className="whitespace-pre-wrap">{data.thread.content}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <HeartIcon
                    className={cn(
                      "hover:cursor-pointer transition-colors",
                      isPendingLike
                        ? data.thread.liked
                          ? "fill-none stroke-white"
                          : "fill-red-300 stroke-red-300"
                        : data.thread.liked && "fill-red-300 stroke-red-300",
                    )}
                    onClick={() => mutateLike(data.thread.id)}
                  />{" "}
                  {isPendingLike ? (
                    <span>
                      {data.thread.liked
                        ? data.thread._count.likes - 1
                        : data.thread._count.likes + 1}
                    </span>
                  ) : (
                    <span>{data.thread._count.likes}</span>
                  )}
                  {isErrorLike && (
                    <Button
                      className="hover:cursor-pointer"
                      variant={"ghost"}
                      type="button"
                      onClick={() => mutateLike(variablesLike)}
                    >
                      <span className="text-red-500">Retry</span>
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquareIcon className="hover:cursor-pointer" />
                  <span>{data.thread._count.replies}</span>
                </div>
              </div>
            </div>
            <Form {...form}>
              <div className="flex flex-col gap-2 w-full p-4 rounded-md bg-transparent dark:bg-input/30">
                {filesContent.length > 0 && (
                  <div className="flex items-center gap-2">
                    {filesContent.map((file) => (
                      <img
                        className="size-24 rounded object-cover"
                        key={file.name}
                        src={file.content}
                        alt={file.name}
                      />
                    ))}
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="w-full h-full">
                      <FormControl>
                        <TextareaAutosize
                          className="p-2 outline-none resize-none"
                          placeholder="What do you think?"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => openFilePicker()}
                      type="button"
                      variant={"ghost"}
                      size={"icon"}
                    >
                      <ImagePlusIcon />
                    </Button>
                    <Button type="button" variant={"ghost"} size={"icon"}>
                      <AtSignIcon />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    {isPending && <Spinner variant="ellipsis" />}
                    <Button
                      onClick={form.handleSubmit(onSubmit)}
                      type="button"
                      size={"sm"}
                      className="hover:cursor-pointer"
                    >
                      <SendIcon />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        )
      )}
      <div>
        {repliesIsLoading ? (
          <div className="p-12 flex justify-center w-full">
            <Spinner variant="ellipsis" />
          </div>
        ) : repliesError ? (
          <span>Error while fetching replies</span>
        ) : repliesData && repliesData.data.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-xl">
              Replies ({repliesData.total})
            </h1>
            <div className="flex flex-col">
              {repliesData.data.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}
            </div>
          </div>
        ) : (
          <span>There are no replies</span>
        )}
      </div>
    </div>
  );
}
