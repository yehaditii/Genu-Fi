# Events

The backend exposes:

- `GET /api/events/recent`
- `GET /api/events/feed`
- `WS /ws/events`

The event service is responsible for polling Soroban activity, caching a recent feed, and broadcasting updates to connected clients.
