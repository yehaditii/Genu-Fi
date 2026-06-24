import { useEffect, useMemo, useState } from "react";

export interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

const sampleEvents: ActivityEvent[] = [
  {
    id: "evt-1",
    type: "institution_registered",
    title: "Institution joined",
    description: "A new institution completed onboarding on Stellar testnet.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "evt-2",
    type: "credential_issued",
    title: "Credential issued",
    description: "A learner received a verifiable skill credential.",
    timestamp: new Date().toISOString(),
  },
];

export function useWebSocket(url?: string) {
  const [events, setEvents] = useState<ActivityEvent[]>(sampleEvents);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) {
      return;
    }

    try {
      const socket = new WebSocket(url);

      socket.onopen = () => setIsConnected(true);
      socket.onclose = () => setIsConnected(false);
      socket.onerror = () => setIsConnected(false);
      socket.onmessage = (message) => {
        try {
          const payload = JSON.parse(message.data) as ActivityEvent;
          setEvents((current) => [payload, ...current].slice(0, 20));
        } catch {
          // Ignore malformed events until the backend stream is wired to production deployments.
        }
      };

      return () => socket.close();
    } catch {
      setIsConnected(false);
    }
  }, [url]);

  return useMemo(
    () => ({
      events,
      isConnected,
    }),
    [events, isConnected]
  );
}
