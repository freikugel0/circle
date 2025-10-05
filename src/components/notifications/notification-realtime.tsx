import { useWebSocket } from "@/hooks/useWebSocket";
import useNotificationStore from "@/stores/notification.store";

export const NotificationRealtime = () => {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useWebSocket((data) => {
    if (data.payload.type === "MENTION") {
      addNotification(data.payload);
    }
  });

  return null;
};
