export const queryKeys = {
  users: {
    all: ["users"] as const,
    me: ["users", "me"] as const,
    details: ["users", "detail"] as const,
    threads: ["users", "threads"] as const,
  },
  threads: {
    all: ["threads"] as const,
    details: ["threads", "details"] as const,
    replies: ["threads", "replies"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
  },
  follows: {
    all: ["follows"] as const,
    followers: ["follows", "followers"] as const,
    following: ["follows", "following"] as const,
    counter: ["follows", "counter"] as const,
    suggested: ["follows", "suggested"] as const,
  },
};
