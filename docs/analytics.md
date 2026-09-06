# Analytics

## Provider

Genu-Fi uses Plausible Analytics for optional, privacy-conscious product analytics. The frontend loads Plausible only when both of these production variables are configured:

- `VITE_ANALYTICS_ENABLED=true`
- `VITE_PLAUSIBLE_DOMAIN=<the deployed frontend hostname>`

The default script URL is `https://plausible.io/js/script.js`. A self-hosted or proxy URL can be supplied with `VITE_PLAUSIBLE_SCRIPT_URL`.

Plausible is cookieless and does not require personal profiles for the product events collected here. Analytics is disabled by default in `frontend/.env.example`.

## Events

The centralized utility is [frontend/src/lib/analytics.ts](../frontend/src/lib/analytics.ts). It exposes a small event allowlist and silently ignores provider failures.

Active events:

- `wallet_connected`: wallet connection succeeded; property `network`.
- `wallet_disconnected`: wallet was disconnected; property `network`.
- `credential_issue_started`: issuer began the issuance flow; property `network`.
- `credential_issued`: issuance transaction was confirmed; property `network`.
- `credential_issue_failed`: issuance failed; property `network`.
- `credential_viewed`: a credential card entered the candidate passport; property `status` (`active` or `revoked`).
- `credential_verification_started`: recruiter began a verification transaction; property `network`.
- `credential_verified`: verification transaction was confirmed; properties `valid` and `network`.
- `credential_verification_failed`: verification failed; property `network`.
- `recruiter_search`: recruiter searched for a candidate; property `network`.
- `candidate_profile_viewed`: candidate data loaded; property `credential_count`.

Reserved events:

- `feedback_opened`
- `feedback_submitted`

No feedback UI exists in the current application, so the reserved events are not emitted yet. They should be used when a feedback surface is added.

## Privacy Considerations

The analytics layer intentionally does not send:

- Private keys or seed phrases.
- Full or partial wallet addresses.
- Credential IDs, transaction hashes, metadata, or credential text.
- Candidate or recruiter names, email addresses, or other personal information.
- Raw API errors or request payloads.

Event properties are coarse operational values only. Analytics failures are caught and never reject wallet, transaction, API, or rendering operations. Users can use the application when analytics is disabled or unavailable.

## Dashboard Access

The Plausible dashboard is managed outside this repository by the project owner or organization administrator:

1. Create or access the Plausible site for the deployed frontend hostname.
2. Copy the site domain into the deployment provider as `VITE_PLAUSIBLE_DOMAIN`.
3. Set `VITE_ANALYTICS_ENABLED=true` for the production frontend environment.
4. Redeploy the frontend through Vercel.
5. Open the site in Plausible and use the custom event report to inspect the events above.

No Plausible API token or dashboard credential belongs in this repository. The dashboard URL and membership are provider-account configuration, not application secrets.
