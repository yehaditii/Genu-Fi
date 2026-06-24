import type { ActivityEvent } from "@/hooks/useWebSocket";

interface Props {
  events: ActivityEvent[];
}

const ActivityFeed = ({ events }: Props) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="glass-effect rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold text-neon">{event.title}</h3>
            <span className="text-xs uppercase tracking-wide text-aqua-neon">{event.type}</span>
          </div>
          <p className="mt-2 text-soft-neon/80">{event.description}</p>
          <p className="mt-3 text-sm text-soft-neon/60">{new Date(event.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
