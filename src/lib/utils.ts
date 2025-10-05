import { t, type LocaleKey } from "@/locales";
import type { ErrorResponse } from "@/typings/api.type";
import { isAxiosError, type AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showErrorToast(error: unknown, fallback = "An error occured") {
  if (isAxiosError<ErrorResponse>(error)) {
    const code = String(error.response?.data.code) as LocaleKey;
    const msg = t(code);

    toast.error("Error", { description: msg });
  } else {
    const msg = (error instanceof Error && error.message) ?? null;
    toast.error("Error", { description: msg ?? fallback });
  }
}

export const getData = async <T>(
  promise: Promise<AxiosResponse<T>>,
): Promise<T | null> => {
  try {
    const response = await promise;
    return response.data;
  } catch {
    return null;
  }
};

export const timeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // detik

  if (diff < 60) {
    return t("TIME.seconds", { count: diff });
  } else if (diff < 3600) {
    return t("TIME.minutes", { count: Math.floor(diff / 60) });
  } else if (diff < 86400) {
    return t("TIME.hours", { count: Math.floor(diff / 3600) });
  } else if (diff < 2592000) {
    return t("TIME.days", { count: Math.floor(diff / 86400) });
  } else if (diff < 31536000) {
    return t("TIME.months", { count: Math.floor(diff / 2592000) });
  } else {
    return t("TIME.years", { count: Math.floor(diff / 31536000) });
  }
};

export const baseImageUrl = `${import.meta.env.VITE_BASE_API_URL}/images`;
