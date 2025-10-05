import authApi from "@/api/handler/auth";
import { Brand } from "@/components/brand";
import InputEndIcon from "@/components/inputs/input-end-icon";
import InputPassword from "@/components/inputs/input-password";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Spinner,
} from "@/components/ui";
import { registerSchema } from "@/schemas/auth.schema";
import type { RegisterFormValues } from "@/typings/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MailIcon, User2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const { mutate: mutateRegister, isPending } = useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      toast.success("Success", {
        description: `${res.data.user.username} successfully registered, you can now log in with your new account`,
        classNames: {
          icon: "text-green-500",
        },
      });
      navigate({ to: "/login" });
    },
  });

  const onSubmit = (val: RegisterFormValues) => mutateRegister(val);

  return (
    <div className="flex flex-col justify-center gap-4 w-sm">
      <Brand className="text-5xl" />
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">Create your account</h1>
        {isPending && <Spinner variant="ellipsis" />}
      </div>
      <div className="flex flex-col gap-2">
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputEndIcon
                      icon={<MailIcon size={14} />}
                      type="email"
                      placeholder="Email Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputEndIcon
                      icon={<User2Icon size={14} />}
                      type="text"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputPassword placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          type="button"
          className="text-lg font-semibold rounded-full"
          onClick={form.handleSubmit(onSubmit)}
        >
          Register
        </Button>
        <Button variant={"link"} asChild>
          <Link to="/login">Already have an account?</Link>
        </Button>
      </div>
    </div>
  );
}
