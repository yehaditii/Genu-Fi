import { useEffect, useMemo, useState } from "react";

export interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

export function useWebSocket(url?: string) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(!!url);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setIsConnected(false);
      setIsLoading(false);
      setIsReconnecting(false);
      setError(null);
      return;
    }

    let socket: WebSocket | null = null;
    let cancelled = false;
    let reconnectTimer: number | undefined;

    setIsLoading(true);
    setIsReconnecting(false);
    setError(null);

    const connect = () => {
      if (cancelled) return;

      setIsLoading(() => !isReconnecting);
      setIsReconnecting(() => !isConnected);


      try {
        socket = new WebSocket(url);

        socket.onopen = () => {
          if (cancelled) return;
          setIsConnected(true);
          setIsLoading(false);
          setIsReconnecting(false);
          setError(null);
        };

        socket.onclose = () => {
          if (cancelled) return;
          setIsConnected(false);
          setIsLoading(false);
          setIsReconnecting(true);

          reconnectTimer = window.setTimeout(() => {
            connect();
          }, 2000);
        };

        socket.onerror = () => {
          if (cancelled) return;
          setIsConnected(false);
          setIsLoading(false);
          setIsReconnecting(false);
          setError("WebSocket connection failed");
        };

        socket.onmessage = (message) => {
          try {
            const payload = JSON.parse(message.data) as ActivityEvent;
            if (!payload?.id || !payload?.type || !payload?.timestamp) return;
            setEvents((current: ActivityEvent[]) => [payload, ...current].slice(0, 20));
          } catch {
            // Ignore malformed events.
          }
        };
      } catch {
        setIsConnected(false);
        setIsLoading(false);
        setIsReconnecting(false);
        setError("WebSocket initialization failed");
      }
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [url]);

  return useMemo(
    () => ({
      events,
      isConnected,
      isLoading,
      isReconnecting,
      error,
    }),
    [events, isConnected, isLoading, isReconnecting, error]
  );
}


