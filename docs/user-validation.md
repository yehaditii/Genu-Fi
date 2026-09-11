# User Validation & Feedback Log

This document provides the standardized framework and template for conducting, capturing, and summarizing real-world user validation testing sessions on GenuFi.

> **Note on Data Integrity**: This template contains only unpopulated schemas and recording structures. Do not fabricate or pre-populate test data. Real feedback must be recorded during or immediately after live user testing sessions.

---

## User Validation Session Template

Use the following template for each validation batch or testing session.

### Session Metadata
- **Date / Time**: `YYYY-MM-DD HH:MM UTC`
- **Testing Environment**: `[Stellar Testnet / Futurenet / Mainnet / Localhost]`
- **Moderator / Facilitator**: `[Name or ID]`
- **Target User Cohort**: `[Students / Academic Institutions / Recruiters / Web3 Developers]`

---

### Summary Metrics
| Metric | Value |
| :--- | :--- |
| **Total Users Tested** | `[0]` |
| **Total Wallet Interactions** | `[0]` |
| **Successful Transactions** | `[0]` |
| **Failed Transactions** | `[0]` |
| **Average Rating (1–5)** | `[N/A]` |

---

### Individual User Interaction Log

| # | User Identifier | Wallet Interaction Type | Feature Used | Transaction Hash | Rating (1–5) | Qualitative Feedback (What worked well / liked) | Improvements Requested (Friction points / suggested changes) |
| :-: | :--- | :--- | :--- | :--- | :-: | :--- | :--- |
| 1 | `[User #1]` | `[Freighter Connected / Anonymous / Sign Tx]` | `[Skill Passport / Issue Credential / Verify Credential / Reputation Check / Activity Feed]` | `[Stellar Tx Hash or N/A]` | `[1-5]` | `[Record exact user observations]` | `[Record specific actionable improvements]` |
| 2 | `[User #2]` | `[Freighter Connected / Anonymous / Sign Tx]` | `[Skill Passport / Issue Credential / Verify Credential / Reputation Check / Activity Feed]` | `[Stellar Tx Hash or N/A]` | `[1-5]` | `[Record exact user observations]` | `[Record specific actionable improvements]` |
| 3 | `[User #3]` | `[Freighter Connected / Anonymous / Sign Tx]` | `[Skill Passport / Issue Credential / Verify Credential / Reputation Check / Activity Feed]` | `[Stellar Tx Hash or N/A]` | `[1-5]` | `[Record exact user observations]` | `[Record specific actionable improvements]` |
| 4 | `[User #4]` | `[Freighter Connected / Anonymous / Sign Tx]` | `[Skill Passport / Issue Credential / Verify Credential / Reputation Check / Activity Feed]` | `[Stellar Tx Hash or N/A]` | `[1-5]` | `[Record exact user observations]` | `[Record specific actionable improvements]` |
| 5 | `[User #5]` | `[Freighter Connected / Anonymous / Sign Tx]` | `[Skill Passport / Issue Credential / Verify Credential / Reputation Check / Activity Feed]` | `[Stellar Tx Hash or N/A]` | `[1-5]` | `[Record exact user observations]` | `[Record specific actionable improvements]` |

---

## Detailed Feedback Template per Participant

Copy and fill this block for in-depth user interview notes:

```markdown
### Participant Log: [User ID / Alias]
- **Number of Users Represented**: 1
- **Wallet Interactions**:
  - Wallet Type: [e.g. Freighter / Other / None]
  - Wallet Connected: [Yes / No]
  - Transactions Signed: [e.g. 0, 1, 2]
- **Feature Used**: [e.g. Student Passport Loading, Institution Credential Issuance, Recruiter Verification, Live Events]
- **Transaction Hash**: [e.g. Stellar Transaction Hash or N/A]
- **Rating (1–5)**: [1 - Poor | 2 - Below Expectations | 3 - Good | 4 - Very Good | 5 - Excellent]
- **Qualitative Feedback (What did you like?)**:
  - 
- **Improvements Requested (What should we improve?)**:
  - 
- **Follow-up Action Items**:
  - [ ] 
```

---

## Data Collection & Privacy Policy

When conducting validation sessions:
1. **Never Collect Sensitive Credentials**: Never request or record private keys, seed phrases, recovery phrases, passwords, or payment card details.
2. **Wallet Addresses**: Public Stellar addresses (`G...`) may be recorded only with user consent for transaction debugging and verifying on-chain activity.
3. **Storage**: User feedback submitted through the application is persisted in the GenuFi MongoDB database under the `feedbacks` collection via the `/api/feedback` endpoint.
