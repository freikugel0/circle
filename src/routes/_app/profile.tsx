import { FullProfile } from "@/components/full-profile";
import useAuthStore from "@/stores/auth.store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();

  return (
    user && (
      <div className="w-full">
        <FullProfile user={user} />
      </div>
    )
  );
}
