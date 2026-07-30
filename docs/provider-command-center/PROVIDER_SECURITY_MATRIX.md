# Sprint 018 Provider Security Matrix

| Boundary | Enforcement |
|---|---|
| Provider identity | Canonical stable registry |
| Secrets | References and fingerprints only; central redaction |
| Read APIs | Founder-only authorization |
| Commands | Founder-only; disabled adapters |
| Production | Activation prohibited in code and database |
| Staging | Evidence, credentials, policy, budget, Founder, allowlist, pause gates |
| Consent/suppression | Mandatory central external-effect guard |
| Rate and budget | Guard denial plus durable controls |
| Webhooks | Fail closed unless provider-specific verification succeeds |
| Audit | Append-only model and database mutation trigger |
| Idempotency | Durable key table and runtime replay |
| Concurrency | Expected-version checks |
| Outbox | Transactional provider outbox table |
| Tests | Deterministic fakes; zero network calls |

Twilio Messaging, Twilio Verify, and SendGrid are configuration-ready but
disabled. Production activation and outbound delivery are unavailable.
