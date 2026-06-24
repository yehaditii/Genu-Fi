# Deployment

## Frontend

- Deploy `frontend/` to Vercel
- Configure `VITE_API_URL`, `VITE_STELLAR_NETWORK`, and contract IDs

## Backend

- Deploy `backend/` to Render or another Node host
- Configure MongoDB, Stellar RPC, network passphrase, and secret key

## Contracts

- Install `rustup`
- Add the `wasm32-unknown-unknown` target
- Install `stellar-cli`
- Build and deploy the packages in `contracts/`
