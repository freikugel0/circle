import { NotificationFetcher } from "@/components/notifications/notification-fetcher";
import { NotificationRealtime } from "@/components/notifications/notification-realtime";
import { Sidebar } from "@/components/sidebar";
import { SidebarProfile } from "@/components/sidebar-profile";
import useAuthStore from "@/stores/auth.store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: () => {
    // Prevent unauthenticated user for accessing
    const token = useAuthStore.getState().token;
    if (!token) throw redirect({ to: "/login" });
  },
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-[250px_3fr] xl:grid-cols-[300px_2fr_350px] h-screen max-h-screen overflow-hidden">
      <NotificationFetcher />
      <NotificationRealtime />
      <Sidebar />
      <Outlet />
      <SidebarProfile />
    </div>
  );
}
