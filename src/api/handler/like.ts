import type { AxiosResponse } from "axios";
import client from "../client";

const likeApi = {
  likeThread: async (id: number): Promise<AxiosResponse> => {
    return client.patch(`/threads/${id}/like`);
  },
  likeReply: async (id: number): Promise<AxiosResponse> => {
    return client.patch(`/replies/${id}/like`);
  },
};

export default likeApi;
