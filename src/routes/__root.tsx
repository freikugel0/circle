import { queryClient } from "@/api/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Toaster theme="system" position="bottom-right" richColors />
      <Outlet />
      <ReactQueryDevtools />
    </ThemeProvider>
  </QueryClientProvider>
);

export const Route = createRootRoute({ component: RootLayout });
