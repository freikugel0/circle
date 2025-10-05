import type { PaginationParams } from "./api.type";
import type { User } from "./user.type";

export type Follow = {
  id: number;
  following_id: number;
  follower_id: number;
  created_at: Date;

  following: User;
  follower: User;
};

export type FollowerListing = Pick<Follow, "id" | "created_at"> & {
  follower: Pick<User, "id" | "username" | "full_name" | "photo_profile">;
  followed: boolean;
};

export type FollowingListing = Pick<Follow, "id" | "created_at"> & {
  following: Pick<User, "id" | "username" | "full_name" | "photo_profile">;
  followed: boolean;
};

export type FollowQueryParams = {
  sort?: "created_at";
  direction?: "asc" | "desc";
  startDate?: Date;
  endDate?: Date;
} & PaginationParams;

export type FollowCounter = {
  followers: number;
  following: number;
};

export type SuggestedFollows = {
  suggestions: Pick<User, "id" | "username" | "full_name" | "photo_profile">[];
};
/*
id           Int      @id @default(autoincrement())
following_id Int
follower_id  Int
created_at   DateTime @default(now())

following User @relation("Following", fields: [following_id], references: [id])
follower  User @relation("Follower", fields: [follower_id], references: [id])
*/
