import type { PaginationParams } from "./api.type";
import type { User } from "./user.type";

export type Reply = {
  id: number;
  thread_id: number;
  image: string | null;
  content: string;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  liked: boolean;
  canEdit: boolean;
  canDelete: boolean;
  _count: {
    likes: number;
  };

  author: Pick<User, "id" | "username" | "full_name" | "photo_profile">;
};

export type ReplyListing = Omit<Reply, "author" | "thread" | "created_by"> & {
  author: Pick<User, "id" | "username" | "full_name" | "photo_profile">;
};

export type ReplyQueryParams = {
  sort?: "created_at";
  direction?: "asc" | "desc";
  startDate?: Date;
  endDate?: Date;
} & PaginationParams;

export type ReplyPayload = {
  content: string;
  file?: File[] | null;
};

/*
id         Int      @id @default(autoincrement())
thread_id  Int
image      String
created_at DateTime @default(now())
updated_at DateTime @updatedAt
created_by Int

author User   @relation("RepliesCreatedBy", fields: [created_by], references: [id])
thread Thread @relation(fields: [thread_id], references: [id])
*/
