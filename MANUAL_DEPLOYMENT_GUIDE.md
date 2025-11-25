# BeatsChain Manual Deployment Guide

This guide will help you deploy BeatsChain to Vercel manually.

## Prerequisites

- Vercel account
- Git repository with your BeatsChain code
- Firebase project set up

## Step 1: Prepare Your Environment Variables

Create a `.env.local` file in the `packages/app` directory with all required environment variables:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other variables from vercel.env.example
```

## Step 2: Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the project:
   ```
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: packages/app
   - Build Command: bash ./vercel-build.sh
   - Output Directory: .next
5. Add environment variables from your `.env.local` file
6. Click "Deploy"

## Step 3: Verify Deployment

1. Check the deployment logs for any errors
2. Visit your deployed site
3. Test key functionality:
   - Authentication
   - Marketplace browsing
   - Web3 connections

## Troubleshooting

### Build Failures

If the build fails due to memory issues:

1. Try increasing the memory limit in `vercel-build.sh`
2. Consider splitting the build into smaller chunks
3. Remove unnecessary dependencies

### Environment Variable Issues

If features aren't working due to missing environment variables:

1. Check Vercel project settings
2. Verify all required variables are set
3. Redeploy after fixing

## Post-Deployment

After successful deployment:

1. Set up a custom domain in Vercel
2. Configure SSL certificates
3. Set up monitoring and analytics