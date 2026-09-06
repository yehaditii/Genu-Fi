# Contracts

The Soroban workspace contains four MVP packages. Each package has a small public interface and stores only the data it owns.

## Institution Registry

Methods:

- `init_admin(admin)` initializes the administrator once.
- `register_institution(name, wallet, metadata_uri)` registers an institution after wallet authorization.
- `verify_institution(wallet)` and `revoke_institution(wallet)` are administrator-authorized state changes.
- `get_institution(wallet)` and `is_verified(wallet)` retrieve institution state.

Storage is keyed by institution wallet, with an administrator and monotonic institution counter. Registration and admin initialization require the relevant address authorization.

## Credential Registry

Methods:

- `issue_credential(credential_id, issuer, recipient, credential_hash, credential_type, metadata_uri)` stores a credential after issuer authorization.
- `get_credential(credential_id)` retrieves the credential.
- `is_valid(credential_id)` returns false for missing or revoked credentials.
- `revoke_credential(credential_id, issuer)` allows only the original issuer to revoke.

Storage is one persistent record per credential ID. The record contains issuer, recipient, hash, type, metadata URI, issue time, and revocation state. The recipient address is the candidate association; no separate ownership record is necessary for this MVP.

## Verification

Methods:

- `record_verification(credential_id, verifier, is_valid)` stores the latest verifier result after verifier authorization.
- `get_verification(credential_id)` retrieves the latest result.

Storage keeps one persistent latest-result record per credential ID. A later verification replaces the previous result.

## Reputation

Methods:

- `init_admin(admin)` initializes the score administrator once.
- `set_score(admin, user, score)` stores a score from 0 through 100 after administrator authorization.
- `get_score(user)` retrieves a score, defaulting to zero.

Storage keeps one persistent score per candidate address.

The MVP keeps the packages independently deployable. A caller should verify credential existence and validity through `credential-registry` before recording a verification result, and then update the candidate score through the authorized reputation workflow. Cross-contract calls can be added later without changing these core data models.
