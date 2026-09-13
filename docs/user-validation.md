# User Validation Template

Use this document to record real Genu-Fi user validation sessions. Do not fabricate, pre-fill, or infer user data. Leave fields blank or mark them `N/A` when they were not observed.

## Session Metadata

- **Date / Time**: `[YYYY-MM-DD HH:MM timezone]`
- **Testing Environment**: `[Localhost / Stellar Testnet / Futurenet / Mainnet]`
- **Facilitator**: `[Name or ID]`
- **User Cohort**: `[Students / Institutions / Recruiters / Other]`

## Summary

| Field | Value |
| :--- | :--- |
| Number of users | `[ ]` |
| Wallet interactions | `[ ]` |
| Feature used | `[ ]` |
| Transaction hash | `[N/A or hash]` |
| Average rating | `[N/A or 1-5]` |
| Qualitative feedback | `[ ]` |
| Improvements requested | `[ ]` |

## User Interaction Log

| User # | Wallet interactions | Feature used | Transaction hash | Rating | Qualitative feedback | Improvements requested |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | `[Connected / Signed transaction / Viewed only / None]` | `[ ]` | `[N/A or Stellar transaction hash]` | `[1-5]` | `[What did the user like?]` | `[What should be improved?]` |

## Detailed Participant Notes

Copy this block once per real participant or validation group.

```markdown
### Participant: [User number or alias]

- Number of users represented: [1 or group size]
- Wallet interactions: [Connected / Signed transaction / Viewed only / None]
- Feature used: [Feature name]
- Transaction hash: [N/A or Stellar transaction hash]
- Rating: [1-5]
- Qualitative feedback:
  - [What did the user like?]
- Improvements requested:
  - [What should be improved?]
- Follow-up actions:
  - [ ] [Action item]
```

## Privacy Rules

- Never collect private keys, seed phrases, recovery phrases, passwords, payment details, or unnecessary personal information.
- Record public wallet addresses or transaction hashes only when they are already available, appropriate for validation, and needed for debugging or verification.
- User feedback submitted through the product is stored in the existing Genu-Fi backend database through the `/api/feedback` endpoint.
