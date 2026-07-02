# Security and Privacy Model

## Protected assets

- memories, journals, life models, health and financial context;
- credentials and cryptographic keys;
- decisions, relationships, beliefs, locations, and vulnerabilities;
- audit, incident, appeal, and consent records.

## Primary threats

- stolen devices or databases;
- insider access;
- weak passwords and account recovery abuse;
- prompt injection and malicious source content;
- unauthorized secondary use;
- relationship surveillance and coercive access;
- data brokerage, advertising, and profiling;
- re-identification of exported or aggregated information;
- dependency or emotional manipulation;
- silent model, policy, or source changes.

## Required production controls

1. Hardware-backed, user-controlled keys where available.
2. Authenticated encryption for all private content in transit and at rest.
3. Separate identity, consent, content, and audit services.
4. Least-privilege access with short-lived credentials.
5. No plaintext server logs containing personal content.
6. Explicit purpose checks before every retrieval.
7. Tamper-evident audits visible to the owner.
8. Portable export and verified deletion.
9. Recovery that cannot silently bypass owner sovereignty.
10. Independent penetration testing, privacy review, and incident exercises.
11. Source-content sandboxing and prompt-injection defenses.
12. No sale, advertising use, or unrelated model training without separate explicit consent.

## Important limitation

The included Web Crypto vault demonstrates strong application-level encryption. A public service still requires secure authentication, hardware-backed key management, protected persistence, recovery design, infrastructure hardening, and independent audit.

