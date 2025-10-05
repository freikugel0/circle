import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import useAuthStore from "@/stores/auth.store";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: () => {
    // Prevent authenticated user from logging in multiple times
    const token = useAuthStore.getState().token;
    if (token) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
      <Outlet />
    </div>
  );
}
