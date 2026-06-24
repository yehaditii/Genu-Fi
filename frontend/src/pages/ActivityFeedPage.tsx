import ActivityFeed from "@/components/ActivityFeed";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useWebSocket } from "@/hooks/useWebSocket";

const ActivityFeedPage = () => {
  const { events, isConnected } = useWebSocket(import.meta.env.VITE_EVENTS_WS_URL);

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
              {isConnected ? "Live stream connected" : "Showing cached sample events"}
            </span>
          </div>

          <ActivityFeed events={events} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ActivityFeedPage;
