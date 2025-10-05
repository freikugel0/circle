import followApi from "@/api/handler/follow";
import userApi from "@/api/handler/user";
import { queryClient } from "@/api/queryClient";
import InputStartIcon from "@/components/inputs/input-start-icon";
import { Button, Spinner } from "@/components/ui";
import { UserAvatar } from "@/components/user-avatar";
import { useDebounce } from "@/hooks/useDebounce";
import { queryKeys } from "@/lib/queryKeys";
import { getData } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/search")({
  component: RouteComponent,
});

function RouteComponent() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKeys.users.all, debouncedKeyword],
    queryFn: () => getData(userApi.getUsers({ keyword: debouncedKeyword })),
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
      <InputStartIcon
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        icon={<SearchIcon size={14} />}
        placeholder="Find people by username or full name"
      />
      {isLoading ? (
        <div className="w-full flex justify-center">
          <Spinner variant="ellipsis" />
        </div>
      ) : error ? (
        <span>Error while fetching users</span>
      ) : (
        data && (
          <div className="w-full flex flex-col gap-4">
            {data.data.map((user) => (
              <div
                key={user.id}
                className="w-full flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <UserAvatar
                    src={user.photo_profile}
                    alt={`@${user.username}`}
                    colors={["#e7e5e4", "#1e293b", "#f3e5f5"]}
                  />
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-semibold">@{user.username}</span>
                    <span>{user.full_name}</span>
                  </div>
                </div>
                {user.followed ? (
                  <Button
                    variant={"outline"}
                    onClick={() => mutateFollow(user.id)}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button onClick={() => mutateFollow(user.id)}>Follow</Button>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
