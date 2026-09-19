# Deployment

This document describes how to deploy the implemented Genu-Fi components. It does not list deployed contract IDs because no real contract IDs are recorded in this repository.

## Public Frontend URL

The existing production frontend URL referenced by repository configuration is:

```text
https://genu-fi.vercel.app
```

Full transaction flows require the frontend to point to a deployed backend and both frontend/backend environments to include real deployed contract IDs.

## Components

- Frontend: static Vite app from `frontend/`.
- Backend: Node/Express app from `backend/`.
- Database: MongoDB.
- Contracts: Soroban contracts from `contracts/`, intended for Stellar Testnet during MVP evaluation.

## Frontend Deployment

The frontend can be deployed to Vercel or another static host.

Build command:

```bash
cd frontend
npm install
npm run build
```

Output directory:

```text
frontend/dist
```

`frontend/vercel.json` contains an SPA rewrite so client-side routes work on Vercel.

Required production variables for full backend connectivity:

```text
VITE_API_URL=https://<backend-host>/api
VITE_EVENTS_WS_URL=wss://<backend-host>/ws/events
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_INSTITUTION_REGISTRY_ID=<real-testnet-contract-id>
VITE_CREDENTIAL_REGISTRY_ID=<real-testnet-contract-id>
VITE_REPUTATION_CONTRACT_ID=<real-testnet-contract-id>
VITE_VERIFICATION_CONTRACT_ID=<real-testnet-contract-id>
```

Optional analytics/monitoring:

```text
VITE_ANALYTICS_ENABLED=true
VITE_PLAUSIBLE_DOMAIN=<frontend-hostname>
VITE_PLAUSIBLE_SCRIPT_URL=https://plausible.io/js/script.js
VITE_SENTRY_ENABLED=true
VITE_SENTRY_DSN=<frontend-sentry-dsn>
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0
```

## Backend Deployment

The backend can be deployed to Render, Railway, Fly.io, a VM, or another Node.js host.

Start command:

```bash
cd backend
npm install
npm start
```

Required production variables:

```text
NODE_ENV=production
PORT=5000
MONGODB_URI=<mongodb-connection-string>
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
STELLAR_SECRET_KEY=<secret-if-needed-by-future-flows>
INSTITUTION_REGISTRY_ID=<real-testnet-contract-id>
CREDENTIAL_REGISTRY_ID=<real-testnet-contract-id>
REPUTATION_CONTRACT_ID=<real-testnet-contract-id>
VERIFICATION_CONTRACT_ID=<real-testnet-contract-id>
CORS_ORIGINS=https://genu-fi.vercel.app
```

Optional monitoring:

```text
SENTRY_ENABLED=true
SENTRY_DSN=<backend-sentry-dsn>
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0
```

Production startup validates required backend variables when `NODE_ENV=production`.

## MongoDB

MongoDB is used by the backend for mirrored application data and feedback.

At minimum, configure:

```text
MONGODB_URI=<mongodb-connection-string>
```

Use a managed database with backups for public evaluation. Do not commit database credentials.

## Stellar Testnet Contracts

Contracts are intended to be deployed to Stellar Testnet for this MVP.

Network:

```text
RPC: https://soroban-testnet.stellar.org
Passphrase: Test SDF Network ; September 2015
```

Prerequisites:

- Rust and Cargo.
- Stellar CLI.
- A funded Stellar Testnet identity stored locally by Stellar CLI.
- Deployment identity alias, not a committed secret key.

Example identity setup:

```bash
stellar keys generate genufi-testnet-deployer
stellar keys fund genufi-testnet-deployer --network testnet
```

Build and test from `contracts/`:

```bash
cargo test --workspace --all
cargo build --workspace --release --target wasm32-unknown-unknown
```

The repository also includes `contracts/scripts/deploy.sh`. It expects:

```bash
export STELLAR_DEPLOYER_IDENTITY=<local-cli-identity-alias>
```

The script writes returned IDs to ignored deployment output under `contracts/target/`. Copy real returned IDs into hosting-provider environment variables.

## Contract ID Recording

For public docs and evaluation, record deployed IDs only after real deployment:

| Contract | Env var | Contract ID |
| :--- | :--- | :--- |
| Institution Registry | `INSTITUTION_REGISTRY_ID` | Not recorded |
| Credential Registry | `CREDENTIAL_REGISTRY_ID` | Not recorded |
| Reputation | `REPUTATION_CONTRACT_ID` | Not recorded |
| Verification | `VERIFICATION_CONTRACT_ID` | Not recorded |

## Post-Deployment Smoke Test

1. Open `https://genu-fi.vercel.app`.
2. Confirm the frontend loads without console errors.
3. Call `GET <backend>/health` and verify `{ "ok": true }`.
4. Confirm backend CORS allows the frontend origin.
5. Open the Student, Institution, Recruiter, Activity, and Feedback UI.
6. Connect Freighter on Testnet.
7. Prepare a credential issuance transaction with a funded issuer wallet.
8. Sign in Freighter and verify the backend returns a transaction hash.
9. Retrieve the candidate credentials.
10. Verify a credential from the Recruiter dashboard.
11. Submit feedback.

## Security Requirements

- Never commit private keys, seed phrases, passwords, database credentials, API tokens, or Sentry auth tokens.
- Use hosting-provider secret stores.
- Use explicit production CORS origins.
- Keep Freighter signing in the browser.
- Rotate any secret that was ever exposed during testing.

## Known Deployment Limitations

- No real contract IDs are committed.
- Institution registration transaction flow is not implemented end-to-end in the backend service.
- Soroban event ingestion is disabled, so the activity feed can be empty in production.
- Successful transaction flows depend on funded Testnet accounts and a healthy Stellar RPC endpoint.
