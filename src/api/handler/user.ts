import type {
  UserEditPayload,
  UserListing,
  UserMe,
  UserQueryParams,
} from "@/typings/user.type";
import type { AxiosResponse } from "axios";
import client from "../client";
import type { PaginatedResponse } from "@/typings/api.type";
import type { ThreadListing, ThreadQueryParams } from "@/typings/thread.type";

const userApi = {
  me: async (): Promise<
    AxiosResponse<{
      user: UserMe;
    }>
  > => {
    return client.get("/me");
  },
  editMe: async (
    payload: UserEditPayload,
  ): Promise<AxiosResponse<{ user: UserMe }>> => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return client.post("/me/edit", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getUsers: async (
    params?: UserQueryParams,
  ): Promise<AxiosResponse<PaginatedResponse<UserListing>>> => {
    const { keyword, ...rest } = params ?? {};

    return client.get("/users", {
      params: {
        ...rest,
        ...(keyword !== undefined && keyword !== "" ? { keyword } : {}),
      },
    });
  },
  getUserThreads: async (
    userId: number,
    params?: ThreadQueryParams & { userId: number },
  ): Promise<AxiosResponse<PaginatedResponse<ThreadListing>>> => {
    return client.get(`/users/${userId}/threads`, {
      params: params ?? {},
    });
  },
};

export default userApi;
