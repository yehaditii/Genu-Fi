# Testing and QA

This document records the current Genu-Fi QA commands, coverage, important test cases, known limitations, and production release checklist.

## Test Commands

Run from the repository root unless a working directory is shown.

### Frontend

```bash
cd frontend
npm test
npm run lint
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

Notes:
- `npm test` currently runs `jest --passWithNoTests`; no frontend test files are present.
- `npm run lint` currently passes with one warning from `react-refresh/only-export-components` in `src/context/StellarContext.tsx`.
- `npx tsc --noEmit -p tsconfig.app.json` is the direct type check used for QA because no dedicated typecheck script is configured.

### Backend

```bash
cd backend
npm test
npx eslint .
npm test -- --coverage
```

Notes:
- No backend lint script is configured, but `npx eslint .` runs successfully.
- Backend tests use Jest and Supertest.

### Smart Contracts

```bash
cd contracts
cargo fmt --all -- --check
cargo test --workspace --all
cargo build --workspace --release --target wasm32-unknown-unknown
```

### Existing CI Equivalents

The GitHub workflows currently run:

```bash
cd frontend && npm install && npm run lint && npm test && npm run build
cd backend && npm install && npm test
cd contracts && cargo test --workspace --all
cd contracts && cargo build --workspace --release --target wasm32-unknown-unknown
```

Local QA additionally runs frontend type checking, backend linting, contract formatting, mobile viewport smoke checks, and targeted API failure checks.

## Latest QA Results

Last local QA pass: 2026-09-19.

| Area | Command | Result |
| :--- | :--- | :--- |
| Frontend tests | `npm test` | Passed, no tests found |
| Frontend lint | `npm run lint` | Passed with 1 warning |
| Frontend type check | `npx tsc --noEmit -p tsconfig.app.json` | Passed |
| Frontend build | `npm run build` | Passed |
| Backend tests | `npm test` | Passed, 13 tests |
| Backend lint | `npx eslint .` | Passed |
| Backend coverage | `npm test -- --coverage` | Passed |
| Contract format | `cargo fmt --all -- --check` | Passed |
| Contract tests | `cargo test --workspace --all` | Passed, 12 tests |
| Contract WASM build | `cargo build --workspace --release --target wasm32-unknown-unknown` | Passed |
| Mobile smoke | Playwright viewport probe | Passed |
| API integration probes | Supertest against Express app | Passed |

## Coverage

Backend Jest coverage from `npm test -- --coverage`:

| Metric | Coverage |
| :--- | :--- |
| Statements | 47.71% |
| Branches | 44.80% |
| Functions | 26.02% |
| Lines | 48.24% |

Notable backend coverage:
- `routes/feedback.js`: 91.30% statements, 93.93% lines.
- Mongoose model files: 100% statements and lines.
- Stellar integration service remains lightly covered because real RPC and signed transaction flows are not executed in unit tests.

Frontend coverage is not available because no frontend test files are currently present.

## Important Test Cases

### User Journeys

| Journey | Current QA coverage |
| :--- | :--- |
| Wallet connection | Type check and static/runtime path inspection of Freighter `isConnected` plus `requestAccess`; manual browser test required with Freighter installed |
| Wallet disconnection | UI path inspected in `WalletConnector`; manual browser test required with Freighter installed |
| Credential issuance | Backend route tests and API probes cover validation and invalid transaction XDR; real issuance requires Testnet contracts and Freighter signing |
| Transaction rejection | Frontend dashboards catch signing errors and show error state; manual rejection in Freighter required |
| Transaction failure | Backend `submitTransaction` handles invalid XDR, submission failure, and confirmation failure paths |
| Credential retrieval | Backend route logic and contract tests cover retrieval patterns; real API retrieval requires MongoDB mirror data and deployed contracts |
| Credential verification | Backend verification route and contract tests cover valid verification behavior; real end-to-end verification requires signed Freighter transaction |
| Invalid credential verification | Contract tests cover invalid/unauthorized verification; API probes cover missing requester and invalid XDR |
| Recruiter search | Frontend flow inspected and build/type checked; real data retrieval requires backend API, MongoDB, and deployed contracts |
| Feedback submission | Backend tests cover success, validation, duplicate prevention, and database failure; frontend modal build/lint checked |
| Mobile UI | Viewport smoke checked at 320, 375, 390, 414, 768, and desktop widths across major routes, mobile nav, and feedback modal |
| API failure | Frontend service layer and backend error middleware checked; API probes cover validation failures |
| Database failure | Feedback API test and API probe cover Mongo/Mongoose failure returning `DATABASE_ERROR` |
| Stellar RPC failure | Backend service wraps Stellar failures and API probes cover contract-not-configured and invalid XDR failures |

### API Integration Probes

The latest QA pass used temporary Supertest probes for:
- `GET /health`
- `POST /api/feedback` invalid rating
- `POST /api/feedback` invalid wallet address
- `POST /api/feedback` database unavailable
- `POST /api/credentials/prepare` missing issuer
- `POST /api/credentials/prepare` missing contract configuration
- `POST /api/credentials/submit` invalid signed transaction XDR
- `POST /api/verification/prepare` missing requester
- `POST /api/verification/submit` invalid signed transaction XDR

### Mobile UI Probe

The latest QA pass used a temporary Playwright probe over:
- Routes: `/`, `/student`, `/institution`, `/recruiter`, `/activity`, and an unknown route.
- Widths: 320, 375, 390, 414, 768, and 1280 px.
- States: initial page, mobile navigation, feedback modal.
- Checks: horizontal overflow and interactive/container elements extending outside the viewport.

## Bugs Fixed During QA

- Removed invalid `ignoreDeprecations: "6.0"` from `frontend/tsconfig.app.json` so direct TypeScript checking works with the installed TypeScript version.
- Updated Freighter wallet connection flow to use `requestAccess()` for the wallet address instead of reading a stale `publicKey` property from `isConnected()`.
- Fixed websocket reconnect state so the activity feed does not rely on stale React state captured by the effect closure.
- Added accessible radio semantics to the feedback star rating control.

## Known Limitations

- No frontend unit or component tests currently exist.
- Real wallet connection, wallet disconnection, transaction rejection, and signing flows require manual testing in a browser with the Freighter extension installed.
- Successful credential issuance and verification require deployed contract IDs, funded Stellar Testnet accounts, a working Soroban RPC endpoint, and MongoDB.
- Local API probes intentionally do not fake successful Stellar transactions.
- Backend coverage is limited around Stellar RPC, event polling, database connection startup, and full credential/verification happy paths.
- `npm audit` in `frontend/` currently reports 12 dependency vulnerabilities. They were not automatically fixed during QA because dependency upgrades can change runtime behavior.

## Production QA Checklist

Before a production release:

- [ ] Run frontend CI commands: `npm run lint`, `npm test`, `npm run build`.
- [ ] Run frontend type check: `npx tsc --noEmit -p tsconfig.app.json`.
- [ ] Run backend tests and lint: `npm test`, `npx eslint .`.
- [ ] Run backend coverage and review meaningful drops: `npm test -- --coverage`.
- [ ] Run contract format, tests, and WASM build.
- [ ] Verify production environment variables are set: MongoDB URI, Stellar RPC URL, network passphrase, contract IDs, CORS origins, and monitoring settings.
- [ ] Manually test Freighter wallet connect and disconnect on desktop and mobile-sized browser windows.
- [ ] Manually reject Freighter signing for issuance and verification and confirm visible error states.
- [ ] Execute one Testnet credential issuance with a funded institution wallet.
- [ ] Retrieve the issued credential from the student dashboard.
- [ ] Verify the credential from the recruiter dashboard.
- [ ] Verify an invalid/revoked credential path if test data is available.
- [ ] Confirm transaction hashes are visible and copyable/readable on narrow screens.
- [ ] Submit feedback anonymously and with a connected wallet when appropriate.
- [ ] Confirm duplicate feedback submissions are blocked.
- [ ] Test API outage, MongoDB outage, and Stellar RPC outage behavior in staging.
- [ ] Run mobile smoke checks at 320, 375, 390, 414, 768, and desktop widths.
- [ ] Review browser console and backend logs for uncaught errors.
