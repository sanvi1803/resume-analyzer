# Quick Start: Convex + Clerk Integration

## IMPORTANT: Do This First!

### 1. Create Clerk JWT Template for Convex

```
1. Go to https://dashboard.clerk.com
2. Left sidebar → JWT Templates
3. Click "New template" → Select "Convex"
4. You'll see a template created with default claims
5. At the top, copy the Issuer URL (e.g., https://verb-noun-00.clerk.accounts.dev)
6. Save this somewhere - you'll use it in Step 2
```

### 2. Update Backend Environment Variables

**File: `backend/.env`**

```
CLERK_FRONTEND_API_URL=https://verb-noun-00.clerk.accounts.dev
CONVEX_URL=https://your-project.convex.cloud
OPENROUTER_API_KEY=sk_xxx (optional)
```

Replace `https://verb-noun-00.clerk.accounts.dev` with the actual URL from your Clerk JWT template.

### 3. Deploy Convex Auth Configuration

```bash
cd backend
npx convex dev
# This will sync the auth.config.js file to Convex
# Wait for it to say "✓ Ready"
# Press Ctrl+C to stop
```

### 4. Get Your Convex URL

After deployment:

1. Go to https://dashboard.convex.dev
2. Click your project
3. Copy the deployment URL (should look like `https://xxxx.convex.cloud`)
4. This is your VITE_CONVEX_URL

### 5. Update Frontend Environment Variables

**File: `frontend/.env`**

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_CONVEX_URL=https://xxxx.convex.cloud
VITE_API_URL=http://localhost:3000
```

### 6. Install Required Package

```bash
cd frontend
npm install convex/react-clerk
```

### 7. Deploy Everything

```bash
# In backend
npx convex deploy

# In frontend
npm run dev
```

---

## What Changed?

### ❌ No Longer Needed:

- Custom JWT validation in middleware
- Backend auth/sync endpoints (POST /api/auth/sync)
- Manual user sync on sign-in
- useAuthSync hook
- localStorage to store userId

### ✅ New Approach:

- Clerk JWT automatically sent with Convex requests
- Convex verifies JWT using auth.config.js
- Access user identity via `ctx.auth.getUserIdentity()` in Convex functions
- Use `useConvexAuth()` hook for auth state in components
- Use `<Authenticated>` / `<Unauthenticated>` components for conditional rendering

---

## Testing

1. **Start backend:**

   ```bash
   cd backend && npm run dev
   ```

2. **Start frontend:**

   ```bash
   cd frontend && npm run dev
   ```

3. **Sign in:**
   - Open http://localhost:5173
   - Click "Sign In"
   - Use Clerk test credentials

4. **Verify in Convex Dashboard:**
   - Go to https://dashboard.convex.dev
   - Click your project
   - Click "Data"
   - You should see the `users` table populated when you sign in

5. **Test resume upload:**
   - Upload a resume after signing in
   - Check Convex dashboard for `resumes` table
   - Data should be automatically saved

---

## If Something Breaks

### "Not authenticated" error

→ Make sure component is inside `<Authenticated>` wrapper

### JWT validation error

→ Check CLERK_FRONTEND_API_URL matches your Clerk JWT template

### Data not saving

→ Run `npx convex deploy` to sync auth configuration

### useConvexAuth() returns false

→ Wait for the `AuthLoading` state to complete
