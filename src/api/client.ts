import useAuthStore from "@/stores/auth.store";
import { type ErrorResponse } from "@/typings/api.type";
import axios, { AxiosError, isAxiosError } from "axios";
import { redirect } from "@tanstack/react-router";
import { showErrorToast } from "@/lib/utils";

const getApiUrl = () => {
  return import.meta.env.VITE_BASE_API_URL || "http://localhost:3000/api/v1";
};

const client = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

client.interceptors.request.use(
  (req) => {
    const token = useAuthStore.getState().token;
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (res) => {
    return res;
  },
  (error: AxiosError<ErrorResponse>) => {
    if (isAxiosError(error)) {
      const { token, logout } = useAuthStore.getState();
      if (error.response?.status === 401 && token) {
        // Logout user
        logout();
        throw redirect({ to: "/login" });
      }
    }
    showErrorToast(error);
    return Promise.reject(error);
  },
);

export default client;
