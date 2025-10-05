import { baseImageUrl, getData } from "@/lib/utils";
import type { UserMe } from "@/typings/user.type";
import { UserAvatar } from "./user-avatar";
import { Button, Spinner } from "./ui";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import followApi from "@/api/handler/follow";
import TabsOutlined from "./tabs-outlined";
import userApi from "@/api/handler/user";
import { ThreadItem } from "./thread-item";
import { Separator } from "@radix-ui/react-separator";

type TabValue = "threads" | "replies";

export const FullProfile = ({ user }: { user: UserMe }) => {
  const [tab, setTab] = useState<TabValue>("threads");

  const {
    data: followCounterData,
    isLoading: followCounterIsLoading,
    error: followCounterError,
  } = useQuery({
    queryKey: [...queryKeys.follows.counter, user.id],
    queryFn: () => getData(followApi.getFollowCounter()),
    enabled: !!user,
  });

  const {
    data: userThreadsData,
    isLoading: userThreadsIsLoading,
    error: userThreadsError,
  } = useQuery({
    queryKey: [...queryKeys.users.threads, user.id],
    queryFn: () => getData(userApi.getUserThreads(user.id)),
  });

  const [editProfileDialog, setEditProfileDialog] = useState(false);

  return (
    <div className="flex flex-col">
      {user.banner ? (
        <img
          className="w-full h-48 object-cover"
          src={`${baseImageUrl}/${user.banner}`}
          alt={`@${user.username}`}
        />
      ) : (
        <div className="h-48 w-full bg-primary" />
      )}
      <div className="px-6 pb-6 flex flex-col gap-6 -mt-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="bg-background p-2 rounded-full">
                <UserAvatar
                  src={user.photo_profile}
                  alt={`@${user.username}`}
                  colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
                  size={120}
                />
              </div>
              <div className="flex flex-col pb-2">
                <p className="font-semibold">@{user.username}</p>
                <span className="text-secondary-foreground">
                  {user.full_name}
                </span>
              </div>
            </div>
            <Button
              className="mb-2"
              variant={"outline"}
              onClick={() => setEditProfileDialog(true)}
            >
              Edit Profile
            </Button>
          </div>
          <p>{user.bio}</p>
          {followCounterIsLoading ? (
            <Spinner variant="ellipsis" />
          ) : followCounterError ? (
            <span>Error while fetching follows counter</span>
          ) : (
            followCounterData && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="font-bold">
                    {followCounterData.followers}
                  </span>
                  Followers
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">
                    {followCounterData.following}
                  </span>
                  Following
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="px-4 sticky top-4 bg-background">
        <TabsOutlined
          value={tab}
          onValueChange={(val) => setTab(val as TabValue)}
          tabs={[
            {
              label: "Threads",
              value: "threads",
              content: userThreadsIsLoading ? (
                <div className="flex justify-center w-full">
                  <Spinner variant="ellipsis" />
                </div>
              ) : userThreadsError ? (
                <span>Failed to fetch user threads</span>
              ) : (
                userThreadsData && (
                  <div className="w-full flex justify-center">
                    {userThreadsData.data.length > 0 ? (
                      userThreadsData.data.map((thread, i) => (
                        <React.Fragment key={thread.id}>
                          <ThreadItem thread={thread} />
                          {i !== userThreadsData.data.length - 1 && (
                            <Separator />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <span>Nothing to see here</span>
                    )}
                  </div>
                )
              ),
            },
            {
              label: "Replies",
              value: "replies",
              content: <div>Replies</div>,
            },
          ]}
        />
      </div>
    </div>
  );
};
