# Events

Genu-Fi includes event API and WebSocket surfaces, but real Soroban event ingestion is currently disabled.

## Implemented Endpoints

Backend routes:

- `GET /api/events/recent`
- `GET /api/events/feed`
- `WS /ws/events`

## Current Behavior

`backend/services/eventService.js` intentionally does not poll Soroban yet.

Current behavior:

- `startPolling()` does nothing.
- `getRecentEvents()` returns an empty array.
- `broadcastEvent(event)` can send an event to connected WebSocket clients if called by future backend code.
- The Activity page displays an empty state when no events are returned.

This is deliberate. The app should not fabricate network activity.

## Event Shape

The frontend expects activity events shaped like:

```ts
interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}
```

Malformed WebSocket messages are ignored by the frontend.

## Future Event Ingestion

To make the activity feed live, future work should:

1. Configure deployed contract IDs.
2. Poll or subscribe to real Stellar/Soroban events.
3. Normalize events into the `ActivityEvent` shape.
4. Cache a recent feed in memory or persistent storage.
5. Broadcast only real observed events through `broadcastEvent`.
6. Add tests for event normalization and reconnect behavior.

## Privacy and Safety

Do not broadcast:

- Private keys or seed phrases.
- Raw signed transaction XDR.
- Unnecessary personal information.
- Full request bodies.

Transaction hashes and public contract/account addresses are public blockchain data, but UI and analytics should still avoid sending them to third-party analytics unless explicitly needed.
