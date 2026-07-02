# Humanity Laws v1.6 Risk Register

| ID | Risk | Severity | Status | Evidence Classification | Mitigation |
|---|---|---|---|---|---|
| R1 | Public launch without manual review, release approval, or deployment evidence | Critical | Open | Verified Issue | Keep launch gate false; require evidence package completion. |
| R2 | Admin route marked protected but not verified behind real auth middleware | High | Open | Verified Issue | Verify deployed auth and role enforcement before beta. |
| R3 | No backup/restore process for production data | High | Open | Verified Issue | Write and test backup/restore plan before real users. |
| R4 | No rollback procedure | High | Open | Verified Issue | Document rollback steps and test on staging. |
| R5 | No production monitoring/alerting | High | Open | Verified Issue | Add monitoring, logs, alert thresholds, and ownership. |
| R6 | Memory persistence is in-memory for app shell | High | Open | Verified Issue | Add reviewed persistence adapter before real beta data. |
| R7 | Failure UX for missing/corrupt archive not verified | Medium | Open | Assumption / Not Yet Verified | Add recovery tests and user-facing degraded states. |
| R8 | Source ledger missing/degraded state not verified in UI | Medium | Open | Assumption / Not Yet Verified | Add source-unavailable page/service tests. |
| R9 | Accessibility not screen-reader/device tested | Medium | Open | Assumption / Not Yet Verified | Run keyboard, screen-reader, contrast, and mobile checks. |
| R10 | High-risk classifier is keyword-based | Medium | Open | Verified Issue | Treat as first-pass triage only; add richer safety evaluation before scale. |
| R11 | Stripe/Supabase are boundary stubs, not live integrations | Medium | Open | Verified Pass / Limited | Verify real provider behavior in staging before beta. |
| R12 | Documentation is fragmented across older version docs | Low | Open | Verified Issue | Consolidate merged-repo docs before onboarding collaborators. |

## v2.0 Operational Readiness Reference

The v2.0 Operational Readiness Program continues these risks in:

- `docs/operational-readiness/OPERATIONAL_READINESS_PROGRAM_v2.0.md`
- `docs/operational-readiness/EVIDENCE_AND_RISK_REFERENCES_v2.0.md`
- `docs/operational-readiness/EXECUTIVE_BLOCKERS_v2.0.md`

No risk is closed by documentation alone. A risk may be reduced or closed only when the required operational evidence exists and has been verified.
