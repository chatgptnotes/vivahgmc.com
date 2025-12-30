# Vercel Environment Variables Setup

## Issue
The production deployment on Vercel is failing to connect to Supabase because environment variables are not configured.

## Solution
Add the following environment variables to your Vercel project:

### Steps:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: **vivahgmc**
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

### Required Environment Variables:

```
VITE_SUPABASE_URL=https://xnzwwbnvgohnqbqmqdzq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhuend3Ym52Z29obnFicW1xZHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwODM2NTcsImV4cCI6MjA4MjY1OTY1N30.axFx9yW6DJTblE3xwPR6RopgqiKnwQ8D4dT3-wkXN20
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhuend3Ym52Z29obnFicW1xZHpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA4MzY1NywiZXhwIjoyMDgyNjU5NjU3fQ.JMKxAiVTYCVKNiGppTY1AAbrpT3MaknwMPGkFaFqxe8
VITE_PROJECT_ID=xnzwwbnvgohnqbqmqdzq
VITE_PROJECT_NAME=murali-netizen's Project
```

### For Each Variable:

1. Click **Add New**
2. Enter the variable name (e.g., `VITE_SUPABASE_URL`)
3. Enter the value
4. Select environments: **Production**, **Preview**, **Development**
5. Click **Save**

### After Adding All Variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots menu (⋮)
4. Select **Redeploy**
5. Check "Use existing Build Cache"
6. Click **Redeploy**

## Verification

After redeployment, visit https://vivahgmc.com/signup and test:
1. The page should load without errors
2. Quick signup buttons should work
3. Email/phone verification should function properly

## Alternative: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link your project
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL
# (paste the value when prompted)

vercel env add VITE_SUPABASE_ANON_KEY
# (paste the value when prompted)

vercel env add VITE_SUPABASE_SERVICE_ROLE_KEY
# (paste the value when prompted)

vercel env add VITE_PROJECT_ID
# (paste the value when prompted)

vercel env add VITE_PROJECT_NAME
# (paste the value when prompted)

# Redeploy
vercel --prod
```

## Security Note

The `VITE_SUPABASE_ANON_KEY` is safe to expose publicly as it only has limited permissions. However, the `VITE_SUPABASE_SERVICE_ROLE_KEY` should be kept private but is included here for admin functionality. Ensure your Supabase Row Level Security (RLS) policies are properly configured to protect sensitive data.

## Troubleshooting

If you still see "Failed to fetch" errors:

1. Check Supabase project is active and not paused
2. Verify the Supabase URL is accessible
3. Check browser console for specific error messages
4. Ensure CORS is configured in Supabase settings
5. Test with the local development server first: `npm run dev`

## Status

Environment variables have been configured on Vercel. The deployment should now work correctly.
