# v2.0 Product Experience Checklist

Purpose: prove real users can understand and safely use the product experience before controlled beta.

Status language: Planned, In Progress, Verified, Blocked.

| Item | Status | Objective | Required evidence | Verification method | Owner action | Rollback or recovery requirement | Exit criteria |
|---|---|---|---|---|---|---|---|
| End-to-end visitor journey | In Progress | Verify Visitor -> Home -> Book -> Join is understandable. | Local route tests plus human staging walkthrough notes. | Walk the route as a first-time visitor. | Complete staging walkthrough and record confusion points. | Join/payment path can be disabled. | Visitor understands purpose, AI nature, boundaries, and launch state. |
| New member dashboard | In Progress | Verify a new member can reach dashboard and understand next steps. | Dashboard route evidence, onboarding notes. | Create test member in staging and inspect dashboard. | Record dashboard completion and empty-state clarity. | Test account deletion and session reset documented. | New member knows what to do next and can recover if stuck. |
| Book experience | In Progress | Verify archive, hash, law index, chapter navigation, quote provenance, and source citations are visible and usable. | Archive hash, page references, search/navigation test, mobile screenshot. | Search, navigate, inspect quote provenance, and verify hash display. | Complete book walkthrough on desktop and mobile. | Missing/corrupt archive recovery message documented. | Book source feels real, traceable, and recoverable. |
| Adam conversation | In Progress | Verify Adam uses merged runtime and communicates safely as an AI companion. | Conversation transcript, source display, boundary test. | Run normal and high-risk Adam prompts. | Save sanitized test transcripts. | Conversation disable/fallback path documented. | Adam is clear, useful, source-aware, and boundary-aware. |
| Eve conversation | In Progress | Verify Eve uses merged runtime and communicates safely as an AI companion. | Conversation transcript, source display, boundary test. | Run normal and high-risk Eve prompts. | Save sanitized test transcripts. | Conversation disable/fallback path documented. | Eve is clear, useful, source-aware, and boundary-aware. |
| Council conversation | In Progress | Verify Council routes through professional boundaries and presents balanced guidance. | Council transcript, high-risk routing evidence. | Run standard, conflict, and high-risk Council scenarios. | Save sanitized test transcripts. | Council disable/fallback path documented. | Council remains helpful without bypassing boundaries. |
| Memory consent | Verified locally / Blocked for production | Ensure memory requires consent and export/delete works. | Local memory tests; staging persistence proof still missing. | Exercise opt-in, opt-out, export, delete, and denied-memory states. | Repeat tests against deployed persistence. | Memory purge/delete recovery path documented. | No memory is stored without consent; export/delete works in staging. |
| Source transparency | Verified locally / In Progress | Ensure users can see sources, book hash, law index, page refs, and quote provenance. | Source-ledger tests, page inspection, staging walkthrough. | Inspect Adam/Eve/Council/Book/Library source displays. | Record source visibility screenshots/notes. | Source unavailable message documented. | Users can tell what is source-backed and what is general guidance. |
| Professional boundaries | Verified locally / In Progress | Route medical, legal, financial, mental-health, emergency, and child/vulnerable-adult flows safely. | Boundary tests, transcript review, emergency wording review. | Run high-risk scenario prompts. | Save sanitized route results and reviewer notes. | Escalation/fallback messages documented. | High-risk issues never present as licensed/professional replacement. |
| Accessibility | Planned | Verify keyboard, screen-reader, contrast, focus order, and mobile layout. | Keyboard audit, screen-reader notes, contrast report, mobile screenshots. | Manual and tool-assisted accessibility review. | Complete accessibility pass with issues triaged. | Accessibility regression checklist documented. | No critical accessibility blocker remains. |
| UX validation | Planned | Confirm real people understand the experience without coaching. | Human QA notes, issue list, resolution log. | Observe internal alpha users and collect feedback. | Run guided but non-leading user sessions. | Revert unsafe/confusing copy quickly. | Common confusion points are identified and resolved or tracked. |
| Empty and failure states | Planned | Ensure users get helpful recovery messages. | Missing archive, missing source ledger, expired session, payment unavailable, Supabase unavailable evidence. | Trigger each failure in staging. | Record each message and recovery path. | Fallback/retry paths documented. | Users understand what happened and what to do next. |

## Current Product Summary

Verified locally:

- App routes render.
- Adam/Eve runtime is wired.
- Council routes through boundaries.
- Book/archive registry is connected.
- Source hash and provenance are visible.
- Memory consent, export, and delete tests pass.
- Launch status remains blocked.

Not yet verified for beta:

- Real browser/device walkthrough.
- Screen-reader and contrast evidence.
- Staging conversation transcripts.
- Production-like memory persistence.
- Missing/corrupt archive recovery UX.
- Source-ledger degraded-state UX.

