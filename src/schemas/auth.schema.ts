import { t } from "@/locales";
import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, t("USERNAME_REQUIRED")),
  password: z.string().min(1, t("PASSWORD_REQUIRED")),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: t("USERNAME_MIN") })
      .max(20, { message: t("USERNAME_MAX") }),
    email: z.string().email({ message: t("EMAIL_INVALID") }),
    password: z.string().min(8, { message: t("PASSWORD_MIN") }),
    repeatPassword: z
      .string()
      .min(8, { message: t("REPEAT_PASSWORD_REQUIRED") }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: t("PASSWORD_MISMATCH"),
  });

export const requestResetPasswordSchema = z.object({
  email: z.string().email({ message: t("EMAIL_INVALID") }),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: t("PASSWORD_MIN") }),
    repeatPassword: z
      .string()
      .min(8, { message: t("REPEAT_PASSWORD_REQUIRED") }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: t("PASSWORD_MISMATCH"),
  });
