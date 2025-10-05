import { t } from "@/locales";
import z from "zod";

export const replySchema = z.object({
  content: z
    .string()
    .min(1, { message: t("REPLY_CONTENT_EMPTY") })
    .max(1000, { message: t("REPLY_CONTENT_TOO_LONG") }),
  file: z.array(z.instanceof(File)).optional().nullable(),
});
