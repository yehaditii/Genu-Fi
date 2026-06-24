# GenuFi

GenuFi is being migrated into a monorepo for a Stellar Soroban-based verifiable skill passport and recruiter trust network.

## Repository Layout

```text
genufi/
├── frontend/
├── backend/
├── contracts/
├── docs/
└── .github/workflows/
```

## Workspaces

- `frontend/`: React + TypeScript client for learners, institutions, and recruiters
- `backend/`: Express API, MongoDB models, Soroban services, and event streaming
- `contracts/`: Soroban contract workspace
- `docs/`: architecture, deployment, testing, and events documentation

## Current Status

This repository now contains the migration scaffold needed to move from the earlier Polygon/Hardhat certificate flow to the new Stellar Soroban architecture while preserving the existing frontend look and feel where possible.

## Next Steps

- Install workspace dependencies for `frontend/` and `backend/`
- Configure environment variables for Stellar RPC, MongoDB, and contract IDs
- Implement and deploy the Soroban contracts
- Wire the backend event poller to live contract deployments
