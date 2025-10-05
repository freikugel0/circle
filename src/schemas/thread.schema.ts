import { t } from "@/locales";
import z from "zod";

export const threadSchema = z.object({
  title: z
    .string()
    .min(1, { message: t("THREAD_TITLE_EMPTY") })
    .max(1000, { message: t("THREAD_TITLE_TOO_LONG") }),
  content: z
    .string()
    .min(1, { message: t("THREAD_CONTENT_EMPTY") })
    .max(1000, { message: t("THREAD_CONTENT_TOO_LONG") }),
  file: z.array(z.instanceof(File)).optional().nullable(),
});
