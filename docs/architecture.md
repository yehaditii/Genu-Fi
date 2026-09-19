# Architecture

Genu-Fi is a monorepo with a React frontend, an Express backend, MongoDB persistence, and Soroban contract packages.

## Repository Layout

```text
frontend/   React + TypeScript + Vite client
backend/    Express API, Mongoose models, Stellar/Soroban service layer
contracts/  Rust/Soroban contract workspace
docs/       Project documentation
```

There is also an older root-level Vite app scaffold. The current product implementation used by the documented role dashboards is in `frontend/`.

## Runtime Components

### Frontend

The frontend provides these routes:

- `/` home page.
- `/student` candidate skill passport dashboard.
- `/institution` institution/issuer credential issuance dashboard.
- `/recruiter` recruiter candidate search and verification dashboard.
- `/activity` network activity page.
- `*` not found page.

Key frontend responsibilities:

- Connect and disconnect Freighter.
- Request backend data through REST APIs.
- Prepare user-entered form data for backend APIs.
- Ask Freighter to sign prepared transaction XDR.
- Submit signed XDR to the backend.
- Show loading, success, and error states.
- Submit user feedback.

### Backend

The backend is an Express application in `backend/server.js`.

Major routes:

- `/health`
- `/api/institutions`
- `/api/credentials`
- `/api/reputation`
- `/api/verification`
- `/api/events`
- `/api/feedback`
- `/ws/events`

Key backend responsibilities:

- Validate request input where implemented.
- Prepare Soroban transactions through `@stellar/stellar-sdk` contract clients.
- Submit signed transactions through Stellar RPC.
- Store MongoDB mirror records for credentials, institutions, verification requests, reputation models, and feedback.
- Return consistent JSON errors through the error middleware.
- Optionally report errors to Sentry.

### MongoDB

Mongoose models exist for:

- `Credential`
- `Feedback`
- `Institution`
- `Reputation`
- `VerificationRequest`

MongoDB is required for persisted feedback and mirrored application data. If `MONGODB_URI` is absent, database connection is skipped at startup, but database-backed routes can fail when used.

### Soroban Contracts

The contract workspace contains four independent packages:

- `institution-registry`
- `credential-registry`
- `reputation`
- `verification`

No deployed Testnet contract IDs are recorded in the repository. Runtime contract IDs must be supplied through frontend and backend environment variables.

## Data Flow

### Candidate Credential Retrieval

1. Candidate connects Freighter.
2. Frontend calls `/api/credentials/recipient/:address`.
3. Backend reads mirrored credentials from MongoDB.
4. For each mirror record, backend calls the credential contract and verification contract through Stellar RPC.
5. Backend returns normalized credential data.
6. Frontend renders the skill passport.

### Credential Issuance

1. Institution enters recipient address, credential type, and metadata.
2. Frontend hashes the payload client-side.
3. Frontend calls `/api/credentials/prepare`.
4. Backend prepares a Soroban `issue_credential` transaction.
5. Frontend asks Freighter to sign the XDR.
6. Frontend calls `/api/credentials/submit` with signed XDR.
7. Backend submits to Stellar RPC.
8. Backend stores a MongoDB credential mirror after successful submission.
9. Frontend displays success state and transaction hash.

### Credential Verification

1. Recruiter searches a candidate address.
2. Frontend displays returned credentials.
3. Recruiter selects a credential to verify.
4. Frontend calls `/api/verification/prepare`.
5. Backend checks credential validity and prepares `record_verification`.
6. Frontend asks Freighter to sign.
7. Frontend calls `/api/verification/submit`.
8. Backend submits the transaction and stores a verification request record.
9. Frontend displays validity and transaction hash.

### Feedback

1. User opens the feedback modal from the header or footer.
2. User selects a rating and optionally enters qualitative feedback.
3. If a wallet is already connected, the user can choose whether to associate the public address.
4. Frontend posts to `/api/feedback`.
5. Backend validates, checks for accidental duplicates, and stores the feedback in MongoDB.

### Events

The backend exposes recent-event REST endpoints and a WebSocket path. Real Soroban event ingestion is currently disabled in `backend/services/eventService.js`, so recent event APIs return an empty list unless future code broadcasts real events.

## Error Handling

Frontend:

- API request failures are converted to visible user errors.
- Wallet and signing failures are caught and shown in dashboard status panels.
- React render errors are captured by `ErrorBoundary`.
- Optional Sentry monitoring can capture sanitized errors.

Backend:

- Route handlers pass errors to `middleware/errorHandler.js`.
- Expected validation and service errors use HTTP 4xx/5xx status codes and structured error codes.
- Stellar RPC and database errors are captured when monitoring is enabled.

## Security and Privacy Boundaries

- The application never requests private keys, seed phrases, passwords, or payment details.
- Wallet signatures are handled by Freighter.
- Public wallet addresses can be used as identifiers for candidate, issuer, and recruiter actions.
- Feedback wallet association is optional and only uses an already connected public address.
- Sentry is configured to avoid default PII and strip request bodies, cookies, and user context.

## Current Gaps

- No deployed contract IDs are committed.
- Institution registration is not implemented end-to-end in the backend Stellar service.
- Soroban event ingestion is disabled.
- Real successful transaction flows require external Testnet setup.
- Frontend has no component/unit test suite yet.
