import type { PaginatedResponse } from "@/typings/api.type";
import type {
  Thread,
  ThreadListing,
  ThreadPayload,
  ThreadQueryParams,
} from "@/typings/thread.type";
import type { AxiosResponse } from "axios";
import client from "../client";

const threadApi = {
  getThreads: async (
    params?: ThreadQueryParams,
  ): Promise<AxiosResponse<PaginatedResponse<ThreadListing>>> => {
    return client.get("/threads", {
      params: params ?? {},
    });
  },
  getDetailsThread: async (
    threadId: number,
  ): Promise<AxiosResponse<{ thread: Thread }>> => {
    return client.get(`/threads/${threadId}`);
  },
  createThreads: async (payload: ThreadPayload): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("content", payload.content);
    if (payload.file) {
      payload.file.forEach((f) => {
        formData.append("file", f);
      });
    }

    return client.post("/threads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default threadApi;
