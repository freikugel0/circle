import notificationApi from "@/api/handler/notification";
import { queryKeys } from "@/lib/queryKeys";
import { getData } from "@/lib/utils";
import useAuthStore from "@/stores/auth.store";
import useNotificationStore from "@/stores/notification.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const NotificationFetcher = () => {
  const { token } = useAuthStore();
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  const { data } = useQuery({
    queryKey: [...queryKeys.notifications.all, token],
    queryFn: () => getData(notificationApi.getNotifications()),
    enabled: !!token,
  });

  useEffect(() => {
    if (data) {
      setNotifications(data.data);
    }
  }, [data, setNotifications]);

  return null;
};
