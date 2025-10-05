import type { PaginationParams } from "./api.type";
import type { Thread } from "./thread.type";
import type { User } from "./user.type";

export type Notification = {
  id: number;
  type: "MENTION" | "FOLLOW" | "LIKE" | "REPLY";
  message: string;
  user_id: number;
  from_user_id: number;
  thread_id: number | null;
  created_at: Date;
  read: boolean;
  user: Pick<User, "id" | "username" | "photo_profile">;
  from: Pick<User, "id" | "username" | "photo_profile">;
  thread: Pick<Thread, "id" | "title">;
};

export type NotificationQueryParams = {
  sort?: "created_at";
  direction?: "asc" | "desc";
  startDate?: Date;
  endDate?: Date;
} & PaginationParams;
