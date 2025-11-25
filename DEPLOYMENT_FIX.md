# Deployment Fix - Vercel Configuration

## Issue
Vercel build failing with "No such file or directory" error when trying to access `packages/app`.

## Root Cause
Vercel's build process was not correctly handling the monorepo structure.

## Solution Applied

### 1. Updated Root Vercel Config
```json
{
  "buildCommand": "cd packages/app && npm install && npm run build",
  "outputDirectory": "packages/app/.next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 2. Added App-Specific Config
Created `/packages/app/vercel.json` for direct app deployment:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

## Alternative Deployment Options

### Option 1: Deploy from App Directory
```bash
cd packages/app
vercel --prod
```

### Option 2: Use Root with Fixed Config
The root vercel.json now properly handles the monorepo structure.

### Option 3: GitHub Actions Deployment
```yaml
- name: Deploy to Vercel
  run: |
    cd packages/app
    npm install
    npm run build
    vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Verification
- ✅ Fixed buildCommand path
- ✅ Added installCommand
- ✅ Created app-specific config
- ✅ Maintained framework detection

## Next Steps
1. Retry Vercel deployment
2. If still failing, deploy from packages/app directory
3. Consider GitHub Actions for automated deployment