import type z from "zod";
import type { Follow } from "./follow.type";
import type { Like } from "./like.type";
import type { Reply } from "./reply.type";
import type { Thread } from "./thread.type";
import type { userEditSchema } from "@/schemas/user.schema";
import type { PaginationParams } from "./api.type";

export type User = {
  id: number;
  username: string;
  full_name: string | null;
  email: string;
  photo_profile: string | null;
  banner: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;

  created_threads: Thread[];
  created_replies: Reply[];
  created_likes: Like[];

  followers: Follow[];
  following: Follow[];
};

export type UserMe = Omit<
  User,
  | "created_likes"
  | "created_threads"
  | "created_replies"
  | "followers"
  | "following"
>;

export type UserListing = Pick<
  User,
  "id" | "username" | "full_name" | "photo_profile"
> & {
  followed: boolean;
};

export type UserEditPayload = {
  username?: string;
  full_name?: string;
  bio?: string;
  photo_profile?: File | null;
  banner?: File | null;
};

export type UserQueryParams = {
  keyword?: string;
  sort?: "created_at";
  direction?: "asc" | "desc";
} & PaginationParams;

export type UserEditFormValues = z.infer<typeof userEditSchema>;

/* 
id            Int      @id @default(autoincrement())
username      String   @unique @db.VarChar(20)
full_name     String?
email         String   @unique
password      String
photo_profile String?
bio           String?
created_at    DateTime @default(now())
updated_at    DateTime @updatedAt

created_threads Thread[] @relation("ThreadsCreatedBy")
created_replies Reply[]  @relation("RepliesCreatedBy")
created_likes   Like[]   @relation("LikesCreatedBy")

followers Follow[] @relation("Follower")
following Follow[] @relation("Following")

passwordResetToken PasswordResetToken?
*/
