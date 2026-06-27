import ActivityFeed from "@/components/ActivityFeed";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useWebSocket } from "@/hooks/useWebSocket";

const ActivityFeedPage = () => {
  const { events, isConnected, isLoading, isReconnecting, error } = useWebSocket(
    (import.meta as any)?.env?.VITE_EVENTS_WS_URL
  );

  const statusText = isConnected
    ? "Live stream connected"
    : isLoading
      ? "Connecting..."
      : isReconnecting
        ? "Reconnecting..."
        : error
          ? `Error: ${error}`
          : "No events yet";

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-soft-neon/60">Activity Feed</p>
              <h1 className="mt-2 text-4xl font-bold text-neon">Network Activity</h1>
            </div>
            <span className="rounded-full border border-aqua-neon/40 px-4 py-2 text-sm text-aqua-neon">
              {statusText}
            </span>
          </div>

          {error ? (
            <div className="glass-effect rounded-2xl p-6 text-soft-neon/80">{error}</div>
          ) : isLoading ? (
            <div className="glass-effect rounded-2xl p-6 text-soft-neon/80">Loading events…</div>
          ) : events.length === 0 ? (
            <div className="glass-effect rounded-2xl p-6 text-soft-neon/80">No events available.</div>
          ) : (
            <ActivityFeed events={events} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ActivityFeedPage;

