import type { ActivityEvent } from "@/hooks/useWebSocket";

interface Props {
  events: ActivityEvent[];
}

const ActivityFeed = ({ events }: Props) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {events.map((event) => (
        <div key={event.id} className="glass-effect rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <h3 className="break-words font-semibold text-neon text-base sm:text-lg">{event.title}</h3>
            <span className="self-start sm:self-auto shrink-0 rounded-full border border-aqua-neon/30 bg-aqua-neon/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-aqua-neon sm:text-xs">
              {event.type}
            </span>
          </div>
          <p className="mt-2 break-words text-xs text-soft-neon/80 sm:text-sm">{event.description}</p>
          <p className="mt-2 text-[11px] text-soft-neon/60 sm:text-xs">{new Date(event.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
