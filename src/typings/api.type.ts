import type { LocaleKey } from "@/locales";

export type PaginatedResponse<T> = {
  limit: number;
  page: number;
  total: number;
  data: T[];
};

export type PaginationParams = {
  limit?: number;
  page?: number;
};

export type ErrorResponse = {
  code: LocaleKey;
  error: string;
  details: any;
};
