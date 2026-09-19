# Genu-Fi

## One-line product description

Genu-Fi is a Stellar/Soroban-based verifiable skill passport prototype for issuing, retrieving, and verifying candidate credentials.

## Problem

Candidates often need to prove skills across disconnected courses, bootcamps, internships, and projects. Institutions need a way to issue tamper-resistant credential records, and recruiters need a faster way to inspect whether a credential is real without relying only on PDFs, screenshots, or self-reported claims.

## Solution

Genu-Fi provides role-specific dashboards for candidates, institutions/issuers, and recruiters:

- Candidates connect a Freighter wallet and view credentials associated with their Stellar address.
- Institutions prepare and submit signed credential issuance transactions.
- Recruiters search candidate wallet addresses, inspect retrieved credentials, and prepare signed verification transactions.
- Feedback can be submitted through the product and stored in the existing backend database.

The implementation is an MVP. It includes frontend dashboards, an Express API, MongoDB mirror models, Soroban contract packages, and optional analytics/monitoring. It does not include a fully seeded production dataset or recorded deployed contract IDs in this repository.

## Why Stellar

Genu-Fi uses Stellar and Soroban because the product needs:

- Public, verifiable credential state.
- Low-cost Testnet-first experimentation.
- Wallet-based authorization through Stellar public keys.
- Smart contracts for credential registry, institution registry, reputation, and verification records.
- A practical path to recruiter and issuer workflows without collecting private keys or seed phrases.

## Key Features

- Candidate skill passport page for connected-wallet credential retrieval.
- Institution dashboard for preparing and submitting credential issuance transactions.
- Recruiter dashboard for searching candidate addresses and verifying credentials.
- Feedback modal with rating, qualitative feedback, validation, duplicate-submission protection, and optional connected-wallet association.
- REST API for credentials, verification, reputation, institutions, events, and feedback.
- WebSocket endpoint for activity events. Real Soroban event ingestion is currently disabled, so the feed is empty unless real backend events are broadcast later.
- Optional Plausible Analytics and Sentry monitoring.
- Soroban contract packages with unit tests.
- Mobile-responsive UI verified across common narrow widths.

## User Roles

### Candidate

- Connects a Freighter wallet.
- Views credential records associated with the connected Stellar public address.
- Views reputation score data returned by the backend.

### Institution/Issuer

- Connects an issuer wallet.
- Enters a candidate Stellar address, credential type, and metadata.
- Prepares a Soroban credential issuance transaction.
- Signs the transaction through Freighter.
- Submits the signed transaction to the backend for Stellar submission and MongoDB mirroring.

### Recruiter

- Connects a recruiter wallet when verification signing is needed.
- Searches for a candidate by Stellar public address.
- Reviews returned credentials and reputation data.
- Prepares, signs, and submits verification transactions.

## Architecture

```text
frontend/  React + TypeScript + Vite application
backend/   Express API, MongoDB models, Stellar/Soroban service layer, WebSocket server
contracts/ Soroban contract workspace
docs/      Architecture, deployment, testing, analytics, monitoring, validation docs
```

Runtime flow:

1. Frontend dashboards call backend REST endpoints.
2. Backend validates requests and prepares Soroban transactions with configured contract IDs.
3. Freighter signs transactions in the browser.
4. Frontend sends signed XDR back to the backend.
5. Backend submits signed transactions through Stellar RPC.
6. Backend stores mirrored metadata in MongoDB where implemented.
7. Frontend displays success, error, transaction hash, and empty/loading states.

## User Flow

Candidate:

1. Open the app.
2. Navigate to the Student dashboard.
3. Connect Freighter.
4. The dashboard requests credentials and reputation for the connected address.

Institution/Issuer:

1. Navigate to the Institution dashboard.
2. Connect Freighter.
3. Enter candidate address, credential type, and metadata.
4. Submit issuance request.
5. Approve the prepared Soroban transaction in Freighter.
6. View transaction status and hash if submission succeeds.

Recruiter:

1. Navigate to the Recruiter dashboard.
2. Search by candidate Stellar address.
3. Review returned credentials and reputation.
4. Connect Freighter to verify a credential.
5. Approve the verification transaction in Freighter.

Feedback:

1. Open Feedback from the header or footer.
2. Select rating from 1 to 5.
3. Enter what worked well and what should improve.
4. Submit anonymously or with the already-connected wallet address.

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Lucide icons.
- Wallet: Freighter API.
- Backend: Node.js, Express, Mongoose, MongoDB, WebSocket (`ws`), Stellar SDK.
- Contracts: Rust, Soroban SDK.
- Analytics: Optional Plausible Analytics.
- Monitoring: Optional Sentry for frontend and backend.
- CI: GitHub Actions for frontend, backend, and contracts.

## Stellar/Soroban Contracts

No deployed Testnet contract IDs are recorded in this repository. The table below reflects the contract packages that exist in `contracts/` and the environment variable slots used by the frontend/backend.

| Contract name | Purpose | Stellar network | Contract ID | Important methods |
| :--- | :--- | :--- | :--- | :--- |
| `institution-registry` | Register institutions and let an admin verify/revoke them | Testnet intended | Not recorded / configure `INSTITUTION_REGISTRY_ID` and `VITE_INSTITUTION_REGISTRY_ID` | `name`, `init_admin`, `register_institution`, `verify_institution`, `revoke_institution`, `get_institution`, `is_verified` |
| `credential-registry` | Issue, retrieve, validate, and revoke credentials | Testnet intended | Not recorded / configure `CREDENTIAL_REGISTRY_ID` and `VITE_CREDENTIAL_REGISTRY_ID` | `name`, `issue_credential`, `get_credential`, `is_valid`, `revoke_credential` |
| `reputation` | Store an admin-controlled numeric reputation score | Testnet intended | Not recorded / configure `REPUTATION_CONTRACT_ID` and `VITE_REPUTATION_CONTRACT_ID` | `name`, `init_admin`, `set_score`, `get_score` |
| `verification` | Store the latest verifier result for a credential | Testnet intended | Not recorded / configure `VERIFICATION_CONTRACT_ID` and `VITE_VERIFICATION_CONTRACT_ID` | `name`, `record_verification`, `get_verification` |

## Live Demo

Production frontend URL currently referenced by configuration:

- https://genu-fi.vercel.app

The frontend requires a deployed backend API and configured contract IDs for full transaction flows.

## Installation

Prerequisites:

- Node.js 18 or newer.
- npm.
- Rust and Cargo.
- `wasm32-unknown-unknown` target for the current Cargo build command.
- Stellar CLI for deployment workflows.
- MongoDB for backend persistence.

Install dependencies:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../contracts && cargo fetch
```

## Environment Variables

Frontend variables are documented in `frontend/.env.example`:

```text
VITE_API_URL=
VITE_EVENTS_WS_URL=
VITE_ANALYTICS_ENABLED=
VITE_PLAUSIBLE_DOMAIN=
VITE_PLAUSIBLE_SCRIPT_URL=
VITE_SENTRY_ENABLED=
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=
VITE_SENTRY_TRACES_SAMPLE_RATE=
VITE_STELLAR_NETWORK=
VITE_STELLAR_NETWORK_PASSPHRASE=
VITE_INSTITUTION_REGISTRY_ID=
VITE_CREDENTIAL_REGISTRY_ID=
VITE_REPUTATION_CONTRACT_ID=
VITE_VERIFICATION_CONTRACT_ID=
```

Backend variables are documented in `backend/.env.example`:

```text
PORT=
NODE_ENV=
MONGODB_URI=
STELLAR_RPC_URL=
STELLAR_NETWORK_PASSPHRASE=
STELLAR_SECRET_KEY=
INSTITUTION_REGISTRY_ID=
CREDENTIAL_REGISTRY_ID=
REPUTATION_CONTRACT_ID=
VERIFICATION_CONTRACT_ID=
CORS_ORIGINS=
SENTRY_ENABLED=
SENTRY_DSN=
SENTRY_ENVIRONMENT=
SENTRY_TRACES_SAMPLE_RATE=
```

Never commit private keys, seed phrases, recovery phrases, passwords, payment details, or deployment secrets.

## Local Development

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Contracts:

```bash
cd contracts
cargo test --workspace --all
```

Default local frontend API behavior points to `http://localhost:5000/api` in development if `VITE_API_URL` is not provided.

## Testing

See `docs/testing.md` for the complete QA record.

Common commands:

```bash
cd frontend && npm test && npm run lint && npx tsc --noEmit -p tsconfig.app.json && npm run build
cd backend && npm test && npx eslint .
cd contracts && cargo fmt --all -- --check && cargo test --workspace --all
cd contracts && cargo build --workspace --release --target wasm32-unknown-unknown
```

## Production Deployment

See `docs/deployment.md`.

Summary:

- Deploy `frontend/` to Vercel or another static frontend host.
- Deploy `backend/` to a Node.js host with MongoDB and Stellar RPC access.
- Deploy contracts to Stellar Testnet with the Stellar CLI.
- Configure backend and frontend contract IDs after deployment.
- Configure CORS so the backend accepts the production frontend origin.

## Analytics

See `docs/analytics.md`.

Analytics are optional and disabled unless Plausible environment variables are configured. The code tracks coarse product events and does not intentionally send wallet addresses, credential IDs, transaction hashes, or personal information.

## Monitoring

See `docs/monitoring.md`.

Monitoring is optional and uses Sentry when enabled. Frontend and backend monitoring strip request bodies, cookies, and user context before sending events.

## User Validation

See `docs/user-validation.md`.

The repository includes a validation template. It does not contain fabricated user data.

## Screenshots

No screenshot files are currently committed in this repository. Add real screenshots here only after capturing the implemented app screens.

Suggested screenshots for evaluation:

- Home page.
- Student dashboard.
- Institution dashboard.
- Recruiter dashboard.
- Feedback modal.
- Mobile navigation.

## Demo Video

No demo video link is currently committed in this repository. Add a real video link only after recording the implemented flows.

Suggested video outline:

1. Open the live app.
2. Show the three role dashboards.
3. Demonstrate wallet connection with Freighter.
4. Demonstrate credential issuance or verification only if deployed contracts and funded Testnet accounts are configured.
5. Submit feedback.
6. Show mobile responsiveness.

## Security Considerations

- Genu-Fi never asks users for private keys, seed phrases, passwords, or payment details.
- Wallet signing is delegated to Freighter.
- Backend request bodies are limited to `1mb`.
- Feedback input is validated and length-limited.
- Stellar public addresses are validated where feedback wallet association is accepted.
- Contract methods use Soroban address authorization where required.
- Sentry is configured to avoid default PII and strips request bodies/cookies/user context.
- Production secrets must be stored in hosting-provider secret stores, not committed to Git.

## Known Limitations

- No deployed contract IDs are recorded in the repository.
- Full successful transaction flows require deployed contracts, funded Testnet wallets, Freighter, MongoDB, and a reachable Stellar RPC endpoint.
- Institution registration transaction flow in the backend service currently returns `501` and is not implemented end-to-end.
- Activity feed ingestion from Soroban is intentionally disabled; current recent events return an empty list unless real backend events are added later.
- Frontend unit/component tests are not present.
- Backend coverage is strongest around feedback and model loading, and limited around real Stellar RPC flows.
- Frontend dependency audit currently reports vulnerabilities; upgrades were not applied automatically because they may change runtime behavior.

## Future Roadmap

- Record real deployed Testnet contract IDs after deployment.
- Implement real Soroban event ingestion for the activity feed.
- Complete institution registration transaction flow.
- Add frontend component tests and wallet-flow integration tests.
- Add staging end-to-end tests using deployed Testnet contracts.
- Add screenshot and demo-video artifacts.
- Improve backend coverage for Stellar RPC success and failure cases.
- Add richer validation exports for user testing sessions.
