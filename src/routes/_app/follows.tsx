import followApi from "@/api/handler/follow";
import { queryClient } from "@/api/queryClient";
import TabsOutlined from "@/components/tabs-outlined";
import { Button, Spinner } from "@/components/ui";
import { UserAvatar } from "@/components/user-avatar";
import { queryKeys } from "@/lib/queryKeys";
import { getData } from "@/lib/utils";
import useAuthStore from "@/stores/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app/follows")({
  component: RouteComponent,
});

type TabValue = "followers" | "following";

function RouteComponent() {
  const token = useAuthStore((s) => s.token);

  const [tab, setTab] = useState<TabValue>("followers");

  const {
    data: followersData,
    isLoading: followersIsLoading,
    error: followersError,
  } = useQuery({
    queryKey: [...queryKeys.follows.followers, token],
    queryFn: () => getData(followApi.getFollowers()),
    enabled: tab === "followers" && !!token,
  });

  const {
    data: followingData,
    isLoading: followingIsLoading,
    error: followingError,
  } = useQuery({
    queryKey: [...queryKeys.follows.following, token],
    queryFn: () => getData(followApi.getFollowing()),
    enabled: tab === "following" && !!token,
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
    <div className="flex flex-col w-full p-4 overflow-auto gap-6">
      <TabsOutlined
        value={tab}
        onValueChange={(val) => setTab(val as TabValue)}
        tabs={[
          {
            label: "Followers",
            value: "followers",
            content: followersIsLoading ? (
              <div className="w-full flex justify-center">
                <Spinner variant="ellipsis" />
              </div>
            ) : followersError ? (
              <span>Error while fetching followers</span>
            ) : followersData && followersData.total > 0 ? (
              <div className="w-full flex flex-col gap-4">
                {followersData.data.map((f) => (
                  <div
                    key={f.id}
                    className="w-full flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        src={f.follower.photo_profile}
                        alt={`@${f.follower.username}`}
                        colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
                      />
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="font-semibold">
                          @{f.follower.username}
                        </span>
                        <span>{f.follower.full_name}</span>
                      </div>
                    </div>
                    {f.followed ? (
                      <Button
                        variant={"outline"}
                        onClick={() => mutateFollow(f.follower.id)}
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button onClick={() => mutateFollow(f.follower.id)}>
                        Follow
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <p>No one has followed you yet</p>
              </div>
            ),
          },
          {
            label: "Following",
            value: "following",
            content: followingIsLoading ? (
              <div className="w-full flex justify-center">
                <Spinner variant="ellipsis" />
              </div>
            ) : followingError ? (
              <span>Error while fetching following</span>
            ) : followingData && followingData.total > 0 ? (
              <div className="w-full flex flex-col gap-2">
                {followingData.data.map((f) => (
                  <div
                    key={f.id}
                    className="w-full flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        src={f.following.photo_profile}
                        alt={`@${f.following.username}`}
                        colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
                      />
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="font-semibold">
                          @{f.following.username}
                        </span>
                        <span>{f.following.full_name}</span>
                      </div>
                    </div>
                    {f.followed ? (
                      <Button
                        variant={"outline"}
                        onClick={() => mutateFollow(f.following.id)}
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button onClick={() => mutateFollow(f.following.id)}>
                        Follow
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <p>You’re not following anyone yet</p>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
