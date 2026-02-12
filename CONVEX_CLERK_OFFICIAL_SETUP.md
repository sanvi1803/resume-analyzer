# Convex + Clerk Integration Setup (Official Method)

## Overview

This guide follows the official Convex + Clerk integration pattern. Instead of using custom JWT validation in the backend, we use:

- **Convex's built-in auth system** with `ctx.auth.getUserIdentity()`
- **Clerk's JWT templates** for Convex
- **ConvexProviderWithClerk** for unified provider setup
- **Convex's auth components** (`Authenticated`, `Unauthenticated`, `AuthLoading`)

---

## Setup Steps

### Step 1: Create Clerk JWT Template for Convex

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **JWT Templates**
3. Click **New template** → Select **Convex**
4. **IMPORTANT:** Copy and save the **Issuer URL** (looks like `https://verb-noun-00.clerk.accounts.dev`)

### Step 2: Configure Environment Variables

**Backend (.env)**

```env
CLERK_FRONTEND_API_URL=https://verb-noun-00.clerk.accounts.dev
CONVEX_URL=https://your-project.convex.cloud
OPENROUTER_API_KEY=sk_xxx (optional)
```

**Frontend (.env)**

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxx
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_API_URL=http://localhost:3000
```

### Step 3: Create Convex Auth Configuration

**backend/convex/auth.config.js**

```javascript
export default {
  providers: [
    {
      domain: process.env.CLERK_FRONTEND_API_URL,
      applicationID: "convex",
    },
  ],
};
```

### Step 4: Deploy Configuration

```bash
cd backend
npx convex dev
# This syncs auth.config.js to Convex backend
```

### Step 5: Update Frontend Provider Setup

**frontend/src/main.jsx**

```jsx
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <App />
    </ConvexProviderWithClerk>
  </ClerkProvider>
);
```

### Step 6: Use Auth Components in React

**frontend/src/App.jsx**

```jsx
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { FiLoader } from "react-icons/fi";

function App() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <FiLoader
              size={48}
              className="animate-spin text-blue-600 mx-auto mb-4"
            />
            <p className="text-xl text-gray-700">Loading...</p>
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>{/* Show sign-in UI */}</Unauthenticated>

      <Authenticated>{/* Show main app */}</Authenticated>
    </>
  );
}
```

### Step 7: Access User Identity in Convex Functions

**backend/convex/functions.ts**

```typescript
export const createOrUpdateUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user identity from Clerk JWT
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    // identity.subject = Clerk user ID
    // identity.email = User email
    // identity.name = User full name

    const clerkId = identity.subject;

    // Now use clerkId to create/update user in database
    const userId = await ctx.db.insert("users", {
      clerkId,
      email: args.email,
      name: args.name,
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});
```

---

## Key Differences from Custom Approach

| Feature               | Custom JWT                   | Official Convex+Clerk                    |
| --------------------- | ---------------------------- | ---------------------------------------- |
| Auth validation       | Manual JWT decode            | `ctx.auth.getUserIdentity()`             |
| Auth state check      | Clerk's `useAuth()`          | Convex's `useConvexAuth()`               |
| Conditional rendering | Clerk's `SignedIn/SignedOut` | Convex's `Authenticated/Unauthenticated` |
| User sync             | Manual backend endpoint      | Automatic via JWT in Convex              |
| JWT validation        | Backend middleware           | Convex handles it                        |
| Token verification    | Manual                       | Convex verifies automatically            |

---

## Data Flow

```
┌─────────────────────┐
│   User Signs In     │
│   (Clerk Modal)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Clerk issues JWT with:         │
│  - sub: Clerk user ID           │
│  - email: user email            │
│  - aud: "convex"                │
│  - iss: CLERK_FRONTEND_API_URL  │
└──────────┬──────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Frontend receives JWT       │
│  (ConvexProviderWithClerk    │
│   handles this automatically)│
└──────────┬───────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  Frontend makes Convex query/mutation   │
│  JWT sent automatically in request      │
└──────────┬────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│  Convex backend receives request   │
│  - Validates JWT signature         │
│  - Checks aud = "convex"           │
│  - Extracts identity info          │
│  - Available via ctx.auth          │
└────────────┬───────────────────────┘
             │
             ▼
┌───────────────────────────────────┐
│  In Convex function:              │
│  const identity =                 │
│    await ctx.auth.getUserIdentity()
│  // identity = {                  │
│  //   subject: "user_xxx",        │
│  //   email: "user@example.com",  │
│  //   name: "John Doe"            │
│  // }                             │
└───────────────────────────────────┘
```

---

## Accessing User Data from Frontend

**Using Convex's `useQuery` hook:**

```jsx
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function UserProfile() {
  // This automatically uses the authenticated JWT
  const currentUser = useQuery(api.users.getCurrentUser);

  return <div>User: {currentUser?.name}</div>;
}
```

The query is **only callable when the component is inside `<Authenticated>`**

---

## Deployment Checklist

- [ ] Set CLERK_FRONTEND_API_URL in backend .env
- [ ] Run `npx convex deploy` to deploy auth.config.js
- [ ] Get VITE_CONVEX_URL from deployed backend
- [ ] Set all environment variables in frontend .env
- [ ] Update main.jsx to use ConvexProviderWithClerk
- [ ] Update App.jsx to use Authenticated/Unauthenticated components
- [ ] Test sign-in flow
- [ ] Verify user appears in Convex dashboard
- [ ] Test data persistence

---

## Common Issues

### "Not authenticated" error in Convex function

**Cause:** Function called outside of `<Authenticated>` component
**Fix:** Wrap the component calling this query/mutation in `<Authenticated>`

### JWT validation fails

**Cause:** CLERK_FRONTEND_API_URL mismatch
**Fix:** Get correct URL from Clerk Dashboard → JWT Templates → Convex template

### Data not persisting

**Cause:** `npx convex deploy` not run after adding auth.config.js
**Fix:** Run `npx convex deploy` to sync configuration

### useConvexAuth() not working

**Cause:** Using outside of ConvexProviderWithClerk
**Fix:** Ensure app is wrapped with `<ConvexProviderWithClerk>`
