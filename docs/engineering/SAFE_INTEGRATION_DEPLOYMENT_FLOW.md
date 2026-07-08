# Humanity Laws Safe Integration & Deployment Flow

Humanity Laws changes should move through a protected path:

1. Create or use a branch before major changes.
2. Integrate new code into the existing mother code.
3. Preserve working Humanity Laws engines unless an explicit instruction says otherwise.
4. Do not blindly overwrite files.
5. Run local verification before committing:
   - TypeScript
   - full tests
   - static staging build
6. Commit only after verification passes.
7. Push to the Git repository connected to Vercel.
8. Confirm that a Vercel deployment starts.
9. Report branch, files changed, engines preserved, code integrated, tests/build status, commit hash, push status, and deployment status.

Local verification command:

```bash
npm run verify:change
```

Protected engines include:

- Humanity Laws source/book integrity
- Adam
- Eve
- Council
- Companion Operating System
- memory
- communication
- source ledger
- provider gateway
- safety boundaries
- quality intelligence
- avatar/presence metadata
- commerce/auth/Stripe membership logic

LaunchReady remains false unless live operational evidence proves all required launch gates have passed.
