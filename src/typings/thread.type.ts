import type { PaginationParams } from "./api.type";
import type { User } from "./user.type";

export type Thread = {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_at: Date;
  updated_at: Date;
  created_by: number;
  liked: boolean;
  canEdit: boolean;
  canDelete: boolean;
  _count: {
    likes: number;
    replies: number;
  };

  author: Pick<User, "id" | "username" | "full_name" | "photo_profile">;
};

export type ThreadListing = Pick<
  Thread,
  | "id"
  | "title"
  | "content"
  | "image"
  | "liked"
  | "canEdit"
  | "canDelete"
  | "created_at"
> & {
  author: Pick<User, "id" | "username" | "full_name" | "photo_profile">;
  _count: {
    likes: number;
    replies: number;
  };
};

export type ThreadQueryParams = {
  sort?: "created_at";
  direction?: "asc" | "desc";
  startDate?: Date;
  endDate?: Date;
} & PaginationParams;

export type ThreadPayload = {
  title: string;
  content: string;
  file?: File[] | null;
};

/*
id         Int      @id @default(autoincrement())
content    String
image      String
created_at DateTime @default(now())
created_by Int
updated_at DateTime @updatedAt
updated_by Int

author  User    @relation("ThreadsCreatedBy", fields: [created_by], references: [id])
replies Reply[] @relation("ThreadReplies")
likes   Like[]  @relation("ThreadLikes")
*/
