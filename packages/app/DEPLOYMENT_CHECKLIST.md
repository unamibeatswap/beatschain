# BeatsChain Deployment Checklist

## Pre-Deployment

- [ ] Content migration completed successfully
- [ ] All pages are accessible via dynamic routes
- [ ] Navigation structure is properly configured in Sanity
- [ ] Fallback content is in place for all migrated pages
- [ ] SEO metadata is properly configured
- [ ] Environment variables are set correctly

## Environment Variables

Ensure these environment variables are set in your deployment environment:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
NEXT_PUBLIC_SANITY_API_TOKEN=your_token
```

## Deployment Commands

### Staging Deployment

```bash
cd packages/app
yarn deploy:staging
```

### Production Deployment

```bash
cd packages/app
yarn deploy
```

## Post-Deployment Verification

- [ ] Run verification script: `yarn verify`
- [ ] Check all migrated pages manually
- [ ] Verify navigation works correctly
- [ ] Test on mobile devices
- [ ] Check social sharing metadata

## Rollback Procedure

If issues are encountered:

1. Identify the specific issue
2. If Sanity-related, verify the fallback system is working
3. If necessary, roll back to previous version:

```bash
cd packages/app
git checkout [previous_stable_commit]
yarn build
yarn deploy
```

## Monitoring

- [ ] Set up error monitoring in Sentry
- [ ] Configure alerts for critical errors
- [ ] Monitor performance metrics

## Documentation

- [ ] Update documentation with new content management procedures
- [ ] Create guide for content editors
- [ ] Document deployment process for team members