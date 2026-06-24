# Architecture

GenuFi is organized as a monorepo with three application layers:

- `frontend/` for learner, institution, recruiter, and activity views
- `backend/` for REST APIs, persistence, event streaming, and Soroban integration
- `contracts/` for Soroban contract packages

## Data Flow

1. Institutions register and issue credentials through the backend API.
2. The backend submits or simulates Soroban transactions and stores mirrored metadata.
3. Event polling broadcasts network activity over WebSocket.
4. Frontend dashboards consume REST data and live event updates.
