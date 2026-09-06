# Error Monitoring

## Setup

Genu-Fi uses Sentry for optional frontend and backend error monitoring. The official SDKs are installed in the existing application packages:

- Frontend: `@sentry/react`
- Backend: `@sentry/node`

Monitoring is disabled unless both the relevant `*_SENTRY_ENABLED` variable and DSN are configured. The integration is environment-controlled, so local development can remain disabled while production captures errors.

Frontend initialization occurs in [frontend/src/main.tsx](../frontend/src/main.tsx). React rendering failures are captured by [frontend/src/components/ErrorBoundary.tsx](../frontend/src/components/ErrorBoundary.tsx). API, wallet, and Stellar transaction errors use the shared monitoring utility at [frontend/src/lib/monitoring.ts](../frontend/src/lib/monitoring.ts).

Backend initialization occurs in [backend/server.js](../backend/server.js). API errors are captured by [backend/middleware/errorHandler.js](../backend/middleware/errorHandler.js), database failures by [backend/config/database.js](../backend/config/database.js), and Soroban/RPC failures by [backend/services/stellarService.js](../backend/services/stellarService.js).

## Captured Errors

Frontend categories:

- `react_render_error`
- `api_failure`
- `wallet_error`
- `stellar_transaction_error`
- Browser-level unhandled exceptions and rejected promises through Sentry initialization

Backend categories:

- `api_failure` for unexpected server errors
- `database_failure`
- `stellar_rpc_failure`
- `configuration_failure`
- `uncaught_exception`
- `unhandled_rejection`

Monitoring records only coarse tags and operational properties such as category, HTTP status, operation name, network, and transaction validity. It does not record transaction hashes, wallet addresses, credential identifiers, request bodies, metadata, or raw provider error messages.

## Privacy Considerations

- `sendDefaultPii` is disabled for both SDKs.
- Request bodies, cookies, and user context are removed before events are sent.
- Error wrappers replace raw exception messages with safe error names so private keys, seed phrases, credentials, and provider payloads are not forwarded.
- Monitoring calls are wrapped in `try/catch`; a Sentry outage or configuration problem cannot crash the frontend or backend.
- Sentry DSNs are configuration values, but tokens, dashboard credentials, private keys, and seed phrases must never be committed.

## Production Configuration

Frontend Vercel variables from [frontend/.env.example](../frontend/.env.example):

```text
VITE_SENTRY_ENABLED=true
VITE_SENTRY_DSN=<frontend-sentry-dsn>
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0
```

Backend hosting variables from [backend/.env.example](../backend/.env.example):

```text
SENTRY_ENABLED=true
SENTRY_DSN=<backend-sentry-dsn>
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0
```

Use separate Sentry projects or DSNs for the frontend and backend when possible. Set a nonzero traces sample rate only after reviewing traffic volume and privacy requirements. The Sentry dashboard, alert rules, and team access are configured in the Sentry account and are not stored in this repository.