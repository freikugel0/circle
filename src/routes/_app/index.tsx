import threadApi from "@/api/handler/thread";
import { queryClient } from "@/api/queryClient";
import { ThreadItem } from "@/components/thread-item";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Separator,
  Spinner,
  Textarea,
} from "@/components/ui";
import { UserAvatar } from "@/components/user-avatar";
import { queryKeys } from "@/lib/queryKeys";
import { getData, showErrorToast } from "@/lib/utils";
import { t } from "@/locales";
import { threadSchema } from "@/schemas/thread.schema";
import useAuthStore from "@/stores/auth.store";
import type { ThreadPayload } from "@/typings/thread.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AtSignIcon, ImagePlusIcon, SendIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useFilePicker } from "use-file-picker";
import {
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKeys.threads.all],
    queryFn: () => getData(threadApi.getThreads()),
  });

  const form = useForm({
    resolver: zodResolver(threadSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      file: null,
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

  const { mutate: mutateThread, isPending } = useMutation({
    mutationFn: threadApi.createThreads,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.threads.all,
      });
      form.reset();
      clear();
    },
  });

  const onSubmit = (val: ThreadPayload) => mutateThread(val);

  return (
    <div className="flex justify-center w-full px-4 py-2 overflow-auto">
      {isLoading ? (
        <div className="p-12">
          <Spinner variant="ellipsis" />
        </div>
      ) : error ? (
        <span>Error while fetching threads</span>
      ) : (
        data &&
        user && (
          <div className="flex flex-col w-full">
            <div className="flex gap-4 items-start w-full px-2 py-4">
              <UserAvatar
                src={user.photo_profile}
                alt={`@${user.username}`}
                colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
              />
              <Form {...form}>
                <div className="flex flex-col gap-2 w-full">
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="What happen?" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="What's on your mind?"
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
                        variant={"secondary"}
                        size={"icon"}
                      >
                        <ImagePlusIcon />
                      </Button>
                      <Button type="button" variant={"secondary"} size={"icon"}>
                        <AtSignIcon />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
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
            <Separator />
            {data.data.map((thread, i) => (
              <React.Fragment key={thread.id}>
                <ThreadItem thread={thread} />
                {i !== data.data.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        )
      )}
    </div>
  );
}
