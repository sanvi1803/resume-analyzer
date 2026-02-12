# Why Auth is Stuck on Loading - Troubleshooting Guide

## Common Causes & Fixes

### ❌ Issue 1: Clerk JWT Template Not Created

**Symptoms:** Stuck on loading spinner after sign-in

**Fix:**

1. Go to https://dashboard.clerk.com
2. Left sidebar → **JWT Templates**
3. Click **New template** → Select **Convex**
4. Copy the **Issuer URL** (looks like `https://verb-noun-00.clerk.accounts.dev`)
5. Add to `backend/.env`:
   ```
   CLERK_FRONTEND_API_URL=https://verb-noun-00.clerk.accounts.dev
   ```

### ❌ Issue 2: Convex Backend Not Deployed

**Symptoms:** JWT template created but auth still failing

**Fix:**

```bash
cd backend
npx convex deploy
```

This deploys the `auth.config.js` to Convex so it knows how to validate Clerk JWTs.

### ❌ Issue 3: Environment Variables Not Set

**Fix: Backend `backend/.env`**

```
CLERK_FRONTEND_API_URL=https://verb-noun-00.clerk.accounts.dev
CONVEX_URL=https://your-project.convex.cloud
OPENROUTER_API_KEY=sk_xxx
```

**Fix: Frontend `frontend/.env`**

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_API_URL=http://localhost:3000
```

### ❌ Issue 4: Convex URL Mismatch

**Check:**

1. Go to https://dashboard.convex.dev
2. Click your project
3. Copy the deployment URL
4. Verify it matches `VITE_CONVEX_URL` in frontend/.env

### ❌ Issue 5: Package Not Installed

**Fix:**

```bash
cd frontend
npm install convex/react-clerk
```

---

## Step-by-Step Diagnostic

### Step 1: Check Backend Environment

```bash
cd backend
cat .env
# Should show:
# CLERK_FRONTEND_API_URL=https://...
# CONVEX_URL=https://...
```

### Step 2: Check Frontend Environment

```bash
cd frontend
cat .env
# Should show:
# VITE_CLERK_PUBLISHABLE_KEY=pk_...
# VITE_CONVEX_URL=https://...
# VITE_API_URL=http://localhost:3000
```

### Step 3: Verify Convex Deployment

```bash
cd backend
npx convex status
# Should show: "✓ Deployed"
```

### Step 4: Check Browser Console

1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Look for errors like:
   - "Missing VITE_CONVEX_URL" → Add to frontend/.env
   - "Auth failed" → Check Clerk JWT template
   - "Not authenticated" → Check token validation

### Step 5: Check Network Requests

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Sign in
4. Look for requests to Convex
5. Check if they have `Authorization` header with Bearer token

---

## Complete Setup Order

1. **Create Clerk JWT Template**
   - Go to Clerk Dashboard → JWT Templates
   - Create Convex template
   - Copy Issuer URL

2. **Set Backend Environment**
   - Add CLERK_FRONTEND_API_URL to `backend/.env`
   - Add CONVEX_URL to `backend/.env`

3. **Deploy Convex**

   ```bash
   cd backend
   npx convex deploy
   ```

4. **Set Frontend Environment**
   - Add VITE_CONVEX_URL to `frontend/.env`
   - Add VITE_CLERK_PUBLISHABLE_KEY to `frontend/.env`

5. **Install Package**

   ```bash
   cd frontend
   npm install convex/react-clerk
   ```

6. **Restart Apps**

   ```bash
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2
   cd frontend && npm run dev
   ```

7. **Test Sign-In**
   - Go to http://localhost:5173
   - Click "Sign In"
   - Should show animated landing page
   - After sign-in, should go to authenticated content (not stuck on loading)

---

## Quick Reset

If still stuck, try this complete reset:

```bash
# Stop both servers (Ctrl+C)

# Clear caches
cd frontend && rm -rf node_modules .next
cd ../backend && rm -rf node_modules

# Reinstall
cd frontend && npm install && npm install convex/react-clerk
cd ../backend && npm install

# Verify .env files have all variables
# Then restart: npm run dev in both terminals
```

---

## Expected Behavior

**Before Sign-In:**

- Beautiful landing page with features
- "Sign In Now" button

**After Signing In:**

- Should redirect away from loading spinner
- Should show Dashboard or Mode Selector
- Should display authenticated content

**If Stuck on Loading:**

- Something in the setup is incomplete
- Follow the diagnostic steps above
- Check browser console for errors

---

## Getting Convex URL

If you don't have it yet:

1. Go to https://dashboard.convex.dev
2. Sign in
3. Click your Resume Analyzer project
4. Look for the deployment URL (top of page)
5. Copy it
6. Paste as VITE_CONVEX_URL in frontend/.env

---

## Getting Clerk Info

If you don't have it yet:

1. Go to https://dashboard.clerk.com
2. Sign in
3. Go to API Keys (left sidebar)
4. Copy Publishable Key → VITE_CLERK_PUBLISHABLE_KEY
5. Go to JWT Templates → Convex template
6. Copy Issuer URL → CLERK_FRONTEND_API_URL
