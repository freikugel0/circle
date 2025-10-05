import useAuthStore from "@/stores/auth.store";
import { useEffect, useRef } from "react";

export const useWebSocket = (onMessage: (data: any) => void, url?: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  const wsUrl = url || (import.meta.env.VITE_BASE_WS_URL as string | undefined);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (wsUrl && token) {
      const socket = new WebSocket(`${wsUrl}?token=${token}`);
      socketRef.current = socket;

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessageRef.current?.(data);
        } catch (err) {
          console.error("Error parsing WS message:", err);
        }
      };

      return () => {
        socket.close();
      };
    }
  }, [wsUrl, token]);

  return socketRef.current;
};
