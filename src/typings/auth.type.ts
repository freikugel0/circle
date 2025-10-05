import type { loginSchema, registerSchema } from "@/schemas/auth.schema";
import type z from "zod";

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: {
    id: number;
    username: string;
    email: string;
    created_at: Date;
  };
};

export type RegisterFormValues = z.infer<typeof registerSchema>;
