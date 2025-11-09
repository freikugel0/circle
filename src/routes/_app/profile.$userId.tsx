// import { queryKeys } from "@/lib/queryKeys";
// import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/profile/$userId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const userId = Number(params.userId);
    if (isNaN(userId)) throw redirect({ to: "/" });

    return {
      userId,
    };
  },
});

function RouteComponent() {
  // const { userId } = Route.useLoaderData();

  // const { data, isLoading, error } = useQuery({
  //   queryKey: [...queryKeys.users.details, userId],
  // });

  return <div>Hello "/_app/profile/$userId"!</div>;
}
