import { t } from "@/locales";
import z from "zod";

export const userEditSchema = z.object({
  username: z
    .string()
    .min(5, { message: t("USERNAME_MIN") })
    .max(20, { message: t("USERNAME_MAX") })
    .optional(),
  full_name: z
    .string()
    .min(1, { message: t("FULLNAME_MIN") })
    .max(50, { message: t("FULLNAME_MAX") })
    .optional(),
  bio: z
    .string()
    .max(160, { message: t("BIO_MAX") })
    .optional(),
  photo_profile: z.instanceof(File).optional().nullable(),
  banner: z.instanceof(File).optional().nullable(),
});
