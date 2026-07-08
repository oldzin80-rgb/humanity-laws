# Humanity Laws RC1 Known Limitations

Status: RC1 DEFERRED ITEMS  
LaunchReady: FALSE until live evidence passes.

This document lists intentional limitations and post-launch items. These are not launch blockers unless they break RC1 core launch flows: membership, auth, checkout, webhook, dashboard, digital book access, admin access, launch status, or source/book integrity.

## Deferred post-launch items

### Hardcover fulfillment

Hardcover fulfillment is deferred.

RC1 includes an honest hardcover placeholder only. No hardcover checkout should be active until a real print-on-demand or fulfillment provider is connected, tested, and documented.

Required later:

- POD/fulfillment provider.
- Product IDs.
- Shipping rates.
- Tax handling.
- Order webhooks.
- Support policy.
- Refund/return handling.
- Live fulfillment proof.

### Advanced community features

Advanced community features are deferred.

RC1 may include honest community placeholders or limited-safe community pages, but it must not fake activity, fake members, fake conversations, fake testimonials, or live social behavior.

### Future live providers

Future live providers are deferred.

This includes provider integrations not required for RC1 core launch, such as future social publishing, SMS providers, phone providers, avatar providers, analytics providers, and expanded communication systems.

### Future avatar/voice/SMS integrations

Avatar, voice, phone, and SMS integrations are deferred.

RC1 may include safe provider-ready placeholders, but it must not claim live avatar, live phone, live SMS, or real human presence unless those providers are actually connected and verified.

### Expanded wellness integrations

Expanded wellness integrations are deferred.

This includes Apple Health, Google Fit, wearables, lab integrations, medical provider integrations, advanced wellness data, and any health-related provider connection requiring explicit future approval.

### Advanced analytics/monitoring

Advanced analytics and monitoring are deferred unless a provider is already configured and verified.

RC1 should avoid invasive analytics. Monitoring and error logging may be configured for operational safety, but launch readiness requires evidence, not assumptions.

### Non-critical polish

Any non-critical polish is deferred.

Polish may resume after live validation unless it fixes a verified launch blocker, accessibility blocker, security/privacy blocker, or severe usability issue in the core launch flow.

## Not deferred

These remain launch-blocking if broken:

- Auth.
- Payments.
- Webhook.
- Membership access.
- Digital book access.
- Admin access.
- Deployment.
- Security/privacy.
- Book/source integrity.
- Launch gate integrity.

## Final rule

Deferred means deferred.

Do not use these limitations as a reason to add new features before live validation is complete.

Current verdict: RC1 LIMITATIONS DOCUMENTED
