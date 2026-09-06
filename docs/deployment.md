# Deployment

## Stellar Testnet

Contracts must be deployed only to Stellar Testnet during MVP development.

- Network alias: `testnet`
- RPC: `https://soroban-testnet.stellar.org`
- Network passphrase: `Test SDF Network ; September 2015`
- No Testnet contract IDs have been recorded in this repository yet.
- Never commit a secret key, seed phrase, or generated deployment credentials.

### Prerequisites

- Rust and Cargo
- Stellar CLI 23 or newer
- The `wasm32v1-none` Rust target required by Stellar CLI 23:

```bash
rustup target add wasm32v1-none
```

- A funded Stellar Testnet identity stored locally by the Stellar CLI. Use an alias, not a secret, in the deployment command:

```bash
stellar keys generate genufi-testnet-deployer
stellar keys fund genufi-testnet-deployer --network testnet
```

The identity alias above is an example. Do not print or commit its secret key or seed phrase.

### Build and Test

From `contracts/`:

```bash
cargo test --workspace --all
stellar contract build --package institution-registry --out-dir target/testnet-artifacts
stellar contract build --package credential-registry --out-dir target/testnet-artifacts
stellar contract build --package reputation --out-dir target/testnet-artifacts
stellar contract build --package verification --out-dir target/testnet-artifacts
```

The repeatable deployment script runs the package tests and builds again before each deployment:

```bash
export STELLAR_DEPLOYER_IDENTITY=genufi-testnet-deployer
bash contracts/scripts/deploy.sh
```

On Windows, run the same script from Git Bash or WSL. The script always passes `--network testnet`, uses the Testnet RPC and passphrase, deploys all four MVP contracts, verifies each `name` method, and writes the resulting IDs to the ignored file `contracts/target/testnet-contract-ids.env`.

### Manual Deployment Commands

If the script cannot run, execute these commands from `contracts/` after replacing only `YOUR_TESTNET_IDENTITY_ALIAS` with a local CLI identity alias:

```bash
cargo test --workspace --all
rustup target add wasm32v1-none
stellar contract build --package institution-registry --out-dir target/testnet-artifacts
stellar contract build --package credential-registry --out-dir target/testnet-artifacts
stellar contract build --package reputation --out-dir target/testnet-artifacts
stellar contract build --package verification --out-dir target/testnet-artifacts

stellar contract deploy --wasm target/testnet-artifacts/institution_registry.wasm --source-account YOUR_TESTNET_IDENTITY_ALIAS --network testnet --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015" --alias institution-registry
stellar contract deploy --wasm target/testnet-artifacts/credential_registry.wasm --source-account YOUR_TESTNET_IDENTITY_ALIAS --network testnet --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015" --alias credential-registry
stellar contract deploy --wasm target/testnet-artifacts/reputation.wasm --source-account YOUR_TESTNET_IDENTITY_ALIAS --network testnet --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015" --alias reputation
stellar contract deploy --wasm target/testnet-artifacts/verification.wasm --source-account YOUR_TESTNET_IDENTITY_ALIAS --network testnet --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015" --alias verification
```

Record each returned `C...` contract ID. Verify an ID without changing contract state:

```bash
stellar contract invoke --id CONTRACT_ID --source-account YOUR_TESTNET_IDENTITY_ALIAS --network testnet --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015" --send no -- name
```

The expected result is the deployed contract name. Do not replace the IDs below until deployment returns real values.

| Contract | Purpose | Testnet Contract ID | Status |
| --- | --- | --- | --- |
| `institution-registry` | Institution registration and admin verification | `TBD` | Not deployed |
| `credential-registry` | Credential issuance, lookup, validity, and revocation | `TBD` | Not deployed |
| `reputation` | Admin-controlled candidate reputation score | `TBD` | Not deployed |
| `verification` | Latest verifier result for a credential | `TBD` | Not deployed |

### Frontend and Backend References

After deployment, set the real IDs in hosting-provider environment variables. Do not commit them if the deployment is environment-specific.

Frontend:

```text
VITE_STELLAR_NETWORK=TESTNET
VITE_INSTITUTION_REGISTRY_ID=<institution-registry-testnet-id>
VITE_CREDENTIAL_REGISTRY_ID=<credential-registry-testnet-id>
VITE_REPUTATION_CONTRACT_ID=<reputation-testnet-id>
VITE_VERIFICATION_CONTRACT_ID=<verification-testnet-id>
```

Backend:

```text
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
INSTITUTION_REGISTRY_ID=<institution-registry-testnet-id>
CREDENTIAL_REGISTRY_ID=<credential-registry-testnet-id>
REPUTATION_CONTRACT_ID=<reputation-testnet-id>
VERIFICATION_CONTRACT_ID=<verification-testnet-id>
```

## Frontend

- Deploy `frontend/` to Vercel
- Configure `VITE_API_URL`, `VITE_EVENTS_WS_URL`, `VITE_STELLAR_NETWORK`, contract IDs, and optional Plausible analytics variables from `frontend/.env.example`
- Enable analytics only with `VITE_ANALYTICS_ENABLED=true` and the deployed hostname in `VITE_PLAUSIBLE_DOMAIN`
- `VITE_API_URL` must point to the deployed backend API, including the `/api` path
- `VITE_EVENTS_WS_URL` must point to the deployed backend WebSocket endpoint
- The existing `frontend/vercel.json` SPA rewrite is compatible with the separate backend architecture

## Backend

- Deploy `backend/` to Render or another Node host
- Configure all variables from `backend/.env.example`
- Set `NODE_ENV=production` and provide an explicit `CORS_ORIGINS` list containing the deployed frontend origin
- Keep `STELLAR_SECRET_KEY` in the hosting provider's secret store; never commit it

## Contract Deployment Summary

The Testnet contract build and deployment process is documented above. The repository does not contain deployed contract addresses until the deployment script or the manual commands complete successfully.
