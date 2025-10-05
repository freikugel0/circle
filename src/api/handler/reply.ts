import type {
  Reply,
  ReplyPayload,
  ReplyQueryParams,
} from "@/typings/reply.type";
import type { AxiosResponse } from "axios";
import client from "../client";
import type { PaginatedResponse } from "@/typings/api.type";

const replyApi = {
  getThreadReplies: async (
    threadId: number,
    params?: ReplyQueryParams,
  ): Promise<AxiosResponse<PaginatedResponse<Reply>>> => {
    return client.get(`/threads/${threadId}/replies`, {
      params: params ?? {},
    });
  },
  createThreadReply: async ({
    threadId,
    payload,
  }: {
    threadId: number;
    payload: ReplyPayload;
  }): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append("content", payload.content);
    if (payload.file) {
      payload.file.forEach((f) => {
        formData.append("file", f);
      });
    }

    return client.post(`/threads/${threadId}/reply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default replyApi;
