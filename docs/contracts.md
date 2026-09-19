# Stellar/Soroban Contracts

The `contracts/` workspace contains four Soroban MVP contract packages. The repository includes contract code and tests, but it does not record deployed Testnet contract IDs.

## Deployment Status

| Contract | Package | Network | Contract ID in repo | Runtime env var |
| :--- | :--- | :--- | :--- | :--- |
| Institution Registry | `institution-registry` | Testnet intended | Not recorded | `INSTITUTION_REGISTRY_ID`, `VITE_INSTITUTION_REGISTRY_ID` |
| Credential Registry | `credential-registry` | Testnet intended | Not recorded | `CREDENTIAL_REGISTRY_ID`, `VITE_CREDENTIAL_REGISTRY_ID` |
| Reputation | `reputation` | Testnet intended | Not recorded | `REPUTATION_CONTRACT_ID`, `VITE_REPUTATION_CONTRACT_ID` |
| Verification | `verification` | Testnet intended | Not recorded | `VERIFICATION_CONTRACT_ID`, `VITE_VERIFICATION_CONTRACT_ID` |

Contract IDs must be produced by deployment and configured in the backend/frontend environments. Do not invent placeholder IDs for public materials.

## Institution Registry

Purpose: register institution records and allow an admin to verify or revoke an institution.

Important methods:

- `name() -> String`
- `init_admin(admin)`
- `register_institution(name, wallet, metadata_uri)`
- `verify_institution(wallet)`
- `revoke_institution(wallet)`
- `get_institution(wallet) -> Option<Institution>`
- `is_verified(wallet) -> bool`

Authorization:

- `init_admin` requires the admin address authorization and can be called only once.
- `register_institution` requires the institution wallet authorization.
- `verify_institution` and `revoke_institution` require the stored admin authorization.

Stored data:

- Institution name.
- Institution wallet address.
- Metadata URI.
- Verification flag.
- Registration timestamp.

## Credential Registry

Purpose: issue, retrieve, validate, and revoke credential records.

Important methods:

- `name() -> String`
- `issue_credential(credential_id, issuer, recipient, credential_hash, credential_type, metadata_uri)`
- `get_credential(credential_id) -> Option<Credential>`
- `is_valid(credential_id) -> bool`
- `revoke_credential(credential_id, issuer)`

Authorization:

- `issue_credential` requires issuer authorization.
- `revoke_credential` requires the original issuer authorization.

Stored data:

- Credential ID.
- Issuer address.
- Recipient address.
- Credential hash.
- Credential type.
- Metadata URI.
- Issued timestamp.
- Revocation state.

## Reputation

Purpose: store a candidate reputation score controlled by an admin.

Important methods:

- `name() -> String`
- `init_admin(admin)`
- `set_score(admin, user, score)`
- `get_score(user) -> u32`

Authorization:

- `init_admin` requires admin authorization and can be called only once.
- `set_score` requires stored admin authorization.

Constraints:

- Score must be between 0 and 100.
- Missing scores return 0.

## Verification

Purpose: store the latest verifier result for a credential.

Important methods:

- `name() -> String`
- `record_verification(credential_id, verifier, is_valid)`
- `get_verification(credential_id) -> Option<VerificationRecord>`

Authorization:

- `record_verification` requires verifier authorization.

Stored data:

- Credential ID.
- Verifier address.
- Validity boolean.
- Verification timestamp.

Only the latest verification result is stored per credential ID.

## Backend Usage

The backend currently uses Soroban clients for:

- Preparing credential issuance transactions.
- Fetching credentials.
- Checking credential validity.
- Preparing verification transactions.
- Fetching verification records.
- Fetching reputation scores.
- Submitting signed transaction XDR.

The backend `registerInstitution` Stellar service currently returns `501` and is not implemented end-to-end.

## Build and Test

From `contracts/`:

```bash
cargo fmt --all -- --check
cargo test --workspace --all
cargo build --workspace --release --target wasm32-unknown-unknown
```

Latest QA result recorded in `docs/testing.md`: 12 contract tests passed.

## Security Notes

- Contract authorization uses Soroban `require_auth` where implemented.
- Contracts do not store private keys, seed phrases, passwords, or payment data.
- Public Stellar addresses are part of the contract data model.
- Deployment keys must stay in local Stellar CLI identities or hosting secret stores, never in Git.
