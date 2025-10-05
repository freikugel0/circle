import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/typings/auth.type";
import type { AxiosResponse } from "axios";
import client from "../client";

const authApi = {
  login: async (
    payload: LoginPayload,
  ): Promise<AxiosResponse<LoginResponse>> => {
    return client.post("/auth/login", payload);
  },
  register: async (
    payload: RegisterPayload,
  ): Promise<AxiosResponse<RegisterResponse>> => {
    return client.post("/auth/register", payload);
  },
};

export default authApi;
