import ActivityFeed from "@/components/ActivityFeed";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { frontendEnv } from "@/config/env";
import { useWebSocket } from "@/hooks/useWebSocket";

const ActivityFeedPage = () => {
  const { events, isConnected, isLoading, isReconnecting, error } = useWebSocket(
    frontendEnv.eventsWsUrl || undefined
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
              <h1 className="mt-2 text-3xl font-bold text-neon sm:text-4xl">Network Activity</h1>
            </div>
            <span aria-live="polite" className="rounded-full border border-aqua-neon/40 px-4 py-2 text-sm text-aqua-neon">
              {statusText}
            </span>
          </div>

          {error ? (
            <div role="alert" className="status-panel status-panel-error">{error}</div>
          ) : isLoading ? (
            <div className="glass-effect rounded-2xl p-6" aria-live="polite"><div className="skeleton h-5 w-40" /><div className="mt-4 space-y-3"><div className="skeleton h-16 w-full" /><div className="skeleton h-16 w-full" /></div></div>
          ) : events.length === 0 ? (
            <div className="glass-effect rounded-2xl p-6 text-soft-neon/80">No network events are available yet. Confirmed Soroban activity will appear here.</div>
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

