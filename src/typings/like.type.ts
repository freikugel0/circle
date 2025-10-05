import type { Thread } from "./thread.type";
import type { User } from "./user.type";

export type Like = {
  id: number;
  thread_id: number;
  created_at: Date;
  created_by: number;
  updated_at: Date;
  updated_by: number;

  author: User;
  thread: Thread;
};

/*
id         Int      @id @default(autoincrement())
thread_id  Int
created_at DateTime @default(now())
updated_at DateTime @updatedAt
created_by Int

author User   @relation("LikesCreatedBy", fields: [created_by], references: [id])
thread Thread @relation("ThreadLikes", fields: [thread_id], references: [id])
*/
