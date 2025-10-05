import authApi from "@/api/handler/auth";
import userApi from "@/api/handler/user";
import { queryClient } from "@/api/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import type { LoginPayload } from "@/typings/auth.type";
import type { UserMe } from "@/typings/user.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  user: UserMe | null;
  setUser: (user: UserMe) => void;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setUser: (user) => {
        set({ user });
      },
      login: async (payload) => {
        const res = await authApi.login(payload);
        const token = res.data.token;

        if (token) {
          set({ token });
          if (get().token) {
            const res = await userApi.me();
            const user = res.data.user;

            if (user) set({ user });
          }
        }
      },
      logout: () => {
        queryClient.removeQueries({
          queryKey: queryKeys.users.me,
        });

        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-store-content",
    },
  ),
);

export default useAuthStore;
