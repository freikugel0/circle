import { Brand } from "@/components/brand";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Spinner,
} from "@/components/ui";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User2Icon } from "lucide-react";
import InputEndIcon from "@/components/inputs/input-end-icon";
import InputPassword from "@/components/inputs/input-password";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/stores/auth.store";
import { toast } from "sonner";
import type { LoginFormValues } from "@/typings/auth.type";

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { mutate: mutateLogin, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      if (user) {
        toast.success("Success", {
          description: `Successfully logged in as ${user.username}`,
          classNames: {
            icon: "text-green-500",
          },
        });
        navigate({ to: "/" });
      }
    },
  });

  const onSubmit = (val: LoginFormValues) => mutateLogin(val);

  return (
    <div className="flex flex-col justify-center gap-4 w-sm">
      <Brand className="text-5xl" />
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">Login to continue</h1>
        {isPending && <Spinner variant="ellipsis" />}
      </div>
      <div className="flex flex-col gap-2">
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputEndIcon
                      icon={<User2Icon size={14} />}
                      type="email"
                      placeholder="Email/Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputPassword placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link
                to="/reset-password-request"
                className="text-sm text-end hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </Form>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          type="button"
          className="text-lg font-semibold rounded-full"
          onClick={form.handleSubmit(onSubmit)}
        >
          Login
        </Button>
        <Button variant={"link"} asChild>
          <Link to="/register">Dont have an account?</Link>
        </Button>
      </div>
    </div>
  );
}
