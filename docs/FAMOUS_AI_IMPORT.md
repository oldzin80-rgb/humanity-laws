# Famous.AI Import Instructions

This repository is a Famous/React-ready TypeScript launch package for Humanity Laws Launch V1.

## Import path

1. Upload or connect this repository to the Famous.AI project workspace.
2. Configure environment variables from `.env.example`.
3. Apply the Supabase migration in `supabase/migrations/0001_launch_v1_schema.sql`.
4. Configure Stripe monthly and yearly price IDs.
5. Run the verification commands before public launch.

## Required verification before public launch

```bash
npm install
npm run build
npm test
npm run smoke
npm run evidence
npm run evidence:build
npm run evidence:test
npm run evidence:smoke
npm run launch:report
```

Deployment verification requires a real `DEPLOYMENT_URL` and should not be marked passed until the deployed application is reachable.

## Evidence boundary

The repository includes generated source, tests, smoke tests, evidence collectors, and launch reports. Release readiness remains false until manual review, release approval, and deployment evidence pass.
