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
        <div className="container mx-auto space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-soft-neon/60 sm:text-sm">Activity Feed</p>
              <h1 className="mt-1.5 text-2xl font-bold text-neon sm:mt-2 sm:text-3xl lg:text-4xl">Network Activity</h1>
            </div>
            <span aria-live="polite" className="self-start sm:self-auto rounded-full border border-aqua-neon/40 bg-aqua-neon/10 px-3 py-1.5 text-xs text-aqua-neon sm:px-4 sm:py-2 sm:text-sm">
              {statusText}
            </span>
          </div>

          {error ? (
            <div role="alert" className="status-panel status-panel-error text-xs sm:text-sm break-words">{error}</div>
          ) : isLoading ? (
            <div className="glass-effect rounded-2xl p-4 sm:p-6" aria-live="polite">
              <div className="skeleton h-5 w-40" />
              <div className="mt-4 space-y-3">
                <div className="skeleton h-16 w-full" />
                <div className="skeleton h-16 w-full" />
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="glass-effect rounded-2xl p-4 sm:p-6 text-xs text-soft-neon/80 sm:text-sm">No network events are available yet. Confirmed Soroban activity will appear here.</div>
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

