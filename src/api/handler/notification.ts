import type { PaginatedResponse } from "@/typings/api.type";
import type {
  Notification,
  NotificationQueryParams,
} from "@/typings/notification.type";
import type { AxiosResponse } from "axios";
import client from "../client";

const notificationApi = {
  getNotifications: async (
    params?: NotificationQueryParams,
  ): Promise<AxiosResponse<PaginatedResponse<Notification>>> => {
    return client.get("/notifications", {
      params: params ?? {},
    });
  },
  readNotifications: async (): Promise<AxiosResponse> => {
    return client.patch(`/notifications`);
  },
  readNotification: async (id: number): Promise<AxiosResponse> => {
    return client.patch(`/notifications/${id}`);
  },
  deleteNotifications: async (): Promise<AxiosResponse> => {
    return client.delete("/notifications");
  },
  deleteNotification: async (id: number): Promise<AxiosResponse> => {
    return client.delete(`/notifications/${id}`);
  },
};

export default notificationApi;
