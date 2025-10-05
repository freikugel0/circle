import useAuthStore from "@/stores/auth.store";
import {
  Avatar,
  Button,
  Card,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Spinner,
  Textarea,
} from "./ui";
import { UserAvatar } from "./user-avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { baseImageUrl, getData, showErrorToast } from "@/lib/utils";
import followApi from "@/api/handler/follow";
import { queryKeys } from "@/lib/queryKeys";
import { useEffect, useState } from "react";
import { ScrollableDialog } from "./dialogs/scrollable-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userEditSchema } from "@/schemas/user.schema";
import userApi from "@/api/handler/user";
import { queryClient } from "@/api/queryClient";
import type { UserEditFormValues } from "@/typings/user.type";
import InputEndIcon from "./inputs/input-end-icon";
import { PencilIcon, SignatureIcon, User2Icon } from "lucide-react";
import { useFilePicker } from "use-file-picker";
import {
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import { t } from "@/locales";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useMatchRoute } from "@tanstack/react-router";

export const SidebarProfile = () => {
  const matchRoute = useMatchRoute();
  const show = !matchRoute({ to: "/profile" });

  const { user, setUser, token } = useAuthStore();

  const [editProfileDialog, setEditProfileDialog] = useState(false);

  const editProfileForm = useForm({
    resolver: zodResolver(userEditSchema),
    mode: "onChange",
    defaultValues: {
      username: user?.username ?? "",
      full_name: user?.full_name ?? "",
      bio: user?.bio ?? "",
      photo_profile: null,
      banner: null,
    },
  });

  const {
    openFilePicker: openBannerFilePicker,
    filesContent: bannerFilesContent,
    clear: clearBanner,
  } = useFilePicker({
    readAs: "DataURL",
    accept: [".jpg", ".png"],
    multiple: false,
    validators: [
      new FileTypeValidator(["jpg", "png"]),
      new FileSizeValidator({ maxFileSize: 3 * 1024 * 1024 }), // 3MB
    ],
    onFilesSelected: ({ plainFiles }) => {
      editProfileForm.setValue("banner", plainFiles?.[0]);
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

  const {
    openFilePicker: openPhotoFilePicker,
    filesContent: photoFilesContent,
    clear: clearPhoto,
  } = useFilePicker({
    readAs: "DataURL",
    accept: [".jpg", ".png"],
    multiple: false,
    validators: [
      new FileTypeValidator(["jpg", "png"]),
      new FileSizeValidator({ maxFileSize: 3 * 1024 * 1024 }), // 3MB
    ],
    onFilesSelected: ({ plainFiles }) => {
      editProfileForm.setValue("photo_profile", plainFiles?.[0]);
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

  useEffect(() => {
    if (editProfileDialog === false) {
      editProfileForm.reset();
      clearBanner();
      clearPhoto();
    }
  }, [editProfileDialog]);

  const { mutate, isPending } = useMutation({
    mutationFn: userApi.editMe,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.users.me,
      });
      setUser(res.data.user);

      clearBanner();
      clearPhoto();
    },
  });

  const onSubmit = (val: UserEditFormValues) => mutate(val);

  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKeys.follows.counter, token],
    queryFn: () => getData(followApi.getFollowCounter()),
    enabled: !!token,
  });

  const {
    data: followSuggestions,
    isLoading: followSuggestionsIsLoading,
    error: followSuggestionsError,
  } = useQuery({
    queryKey: [...queryKeys.follows.suggested, token],
    queryFn: () => getData(followApi.getSuggestedFollows()),
    enabled: !!token,
  });

  const { mutate: mutateFollow } = useMutation({
    mutationFn: followApi.toggleFollow,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.follows.all,
      });
    },
  });

  return (
    <div className="border-l invisible xl:visible flex flex-col items-center px-4 py-6">
      {user ? (
        <div className="flex flex-col gap-4 w-full">
          {show && (
            <div className="w-full">
              <Card className="w-full p-0 overflow-hidden">
                <div className="flex flex-col">
                  {user.banner ? (
                    <img
                      className="w-full h-24 object-cover"
                      src={`${baseImageUrl}/${user.banner}`}
                      alt={`@${user.username}`}
                    />
                  ) : (
                    <div className="h-24 w-full bg-primary" />
                  )}
                  <div className="px-6 pb-6 flex flex-col gap-6 -mt-10">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-end justify-between">
                        <div className="bg-card p-2 rounded-full">
                          <UserAvatar
                            src={user.photo_profile}
                            alt={`@${user.username}`}
                            colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
                            size={72}
                          />
                        </div>
                        <Button
                          variant={"outline"}
                          onClick={() => setEditProfileDialog(true)}
                        >
                          Edit Profile
                        </Button>
                      </div>
                      <div className="flex flex-col gap-1">
                        <CardTitle>@{user?.username}</CardTitle>
                        <span className="text-secondary-foreground">
                          {user.full_name}
                        </span>
                      </div>
                    </div>
                    {user.bio ? (
                      <p>{user.bio}</p>
                    ) : (
                      <p className="italic">No bio yet</p>
                    )}
                    {isLoading ? (
                      <div className="w-full flex justify-center">
                        <Spinner variant="ellipsis" />
                      </div>
                    ) : error ? (
                      <span>Error while fetching follows counter</span>
                    ) : (
                      data && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">{data.followers}</span>
                            Followers
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold">{data.following}</span>
                            Following
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}
          {followSuggestionsIsLoading ? (
            <div className="w-full flex justify-center">
              <Spinner variant="ellipsis" />
            </div>
          ) : followSuggestionsError ? (
            <span>Failed to fetch suggestions</span>
          ) : (
            followSuggestions && (
              <Card className="w-full p-4 overflow-hidden">
                <div className="flex flex-col gap-4">
                  <h1 className="font-semibold">Suggested for you</h1>
                  {followSuggestions.suggestions.map((f) => (
                    <div
                      key={f.id}
                      className="w-full flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          src={f.photo_profile}
                          alt={`@${f.username}`}
                          colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
                        />
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="font-semibold">@{f.username}</span>
                          <span>{f.full_name}</span>
                        </div>
                      </div>
                      <Button onClick={() => mutateFollow(f.id)}>Follow</Button>
                    </div>
                  ))}
                </div>
              </Card>
            )
          )}
        </div>
      ) : (
        <span>Failed to fetch user profile</span>
      )}
      {/* Edit profile dialog */}
      <ScrollableDialog
        title="Edit Profile"
        description="You can edit your profile here"
        open={editProfileDialog}
        onOpenChange={setEditProfileDialog}
        footerComponent={
          <div className="flex justify-between items-center w-full">
            {isPending ? <Spinner variant="ellipsis" /> : <div></div>}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => setEditProfileDialog(false)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={editProfileForm.handleSubmit(onSubmit)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        }
      >
        {user && (
          <div className="p-2">
            <Form {...editProfileForm}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center overflow-hidden">
                  <div
                    className="relative w-full h-24"
                    onClick={() => openBannerFilePicker()}
                  >
                    {bannerFilesContent.length > 0 ? (
                      bannerFilesContent.map((file) => (
                        <img
                          className="w-full h-24 object-cover rounded"
                          key={file.name}
                          src={file.content}
                          alt={file.name}
                        />
                      ))
                    ) : user.banner ? (
                      <img
                        className="w-full h-24 object-cover rounded"
                        src={`${baseImageUrl}/${user.banner}`}
                        alt={`@${user.username}`}
                      />
                    ) : (
                      <div className="h-24 w-full bg-primary" />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded">
                      <span className="text-white text-sm font-medium">
                        <PencilIcon />
                      </span>
                    </div>
                  </div>
                  <div
                    className="relative bg-background p-2 rounded-full -mt-10"
                    onClick={() => openPhotoFilePicker()}
                  >
                    {photoFilesContent.length > 0 ? (
                      photoFilesContent.map((file) => (
                        <Avatar key={file.name} className="size-18">
                          <AvatarImage src={file.content} />
                        </Avatar>
                      ))
                    ) : (
                      <UserAvatar
                        src={user.photo_profile}
                        alt={`@${user.username}`}
                        colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
                        size={72}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                      <span className="text-white text-xs">
                        <PencilIcon />
                      </span>
                    </div>
                  </div>
                </div>
                <FormField
                  control={editProfileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputEndIcon
                          icon={<User2Icon size={14} />}
                          type="text"
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editProfileForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputEndIcon
                          icon={<SignatureIcon size={14} />}
                          type="text"
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editProfileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Bio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </div>
        )}
      </ScrollableDialog>
    </div>
  );
};
