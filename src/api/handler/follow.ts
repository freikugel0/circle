import type {
  FollowCounter,
  FollowerListing,
  FollowingListing,
  FollowQueryParams,
  SuggestedFollows,
} from "@/typings/follow.type";
import type { AxiosResponse } from "axios";
import client from "../client";
import type { PaginatedResponse } from "@/typings/api.type";

const followApi = {
  getFollowers: async (
    params?: FollowQueryParams,
  ): Promise<AxiosResponse<PaginatedResponse<FollowerListing>>> => {
    return client.get("/follow/followers", {
      params: params ?? {},
    });
  },
  getFollowing: async (
    params?: FollowQueryParams,
  ): Promise<AxiosResponse<PaginatedResponse<FollowingListing>>> => {
    return client.get("/follow/following", {
      params: params ?? {},
    });
  },
  getFollowCounter: async (): Promise<AxiosResponse<FollowCounter>> => {
    return client.get("/follow/counter");
  },
  getSuggestedFollows: async (): Promise<AxiosResponse<SuggestedFollows>> => {
    return client.get("/follow/suggested");
  },
  toggleFollow: async (id: number): Promise<AxiosResponse> => {
    return client.patch(`/follow/${id}`);
  },
};

export default followApi;
