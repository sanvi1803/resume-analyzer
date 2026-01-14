# Authentication & Database Guide

## Overview

Resume Analyzer now includes complete authentication and persistent storage using industry-standard tools:

- **Authentication**: Clerk (easy sign-in/sign-up)
- **Database**: Convex (real-time backend)
- **API Protection**: JWT token validation on all endpoints

---

## Setup Instructions

### Step 1: Create Clerk Account

1. Visit [clerk.com](https://clerk.com)
2. Sign up for free account
3. Create a new application
4. Copy your **Publishable Key** (public_key_xxx)

### Step 2: Create Convex Account

1. Visit [convex.dev](https://convex.dev)
2. Sign up for free account
3. Create a new project
4. Copy your **Deployment URL** (https://xxx.convex.cloud)

### Step 3: Configure Frontend Environment

Create `frontend/.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_API_URL=http://localhost:5000
```

### Step 4: Configure Backend Environment

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
CONVEX_URL=https://your-project.convex.cloud

# AI (Optional)
OPENROUTER_API_KEY=your_key_here
```

### Step 5: Deploy Convex Schema

```bash
cd backend/convex
npx convex deploy
```

### Step 6: Install Dependencies

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000** and sign in!

---

## Authentication Flow

### User Registration

1. User clicks "Sign In"
2. Clerk modal opens
3. User enters email and creates password
4. Clerk creates user account
5. JWT token is generated
6. Frontend calls `POST /api/auth/sync` with token
7. Backend creates user in Convex database
8. User is authenticated

### User Login

1. User enters email and password
2. Clerk validates credentials
3. JWT token is issued
4. User is signed in and dashboard loads
5. All API calls include Bearer token

### Token Validation

All protected endpoints require:

```
Authorization: Bearer <jwt_token>
```

Backend middleware (`authMiddleware.js`) validates:

- Token exists
- Token is valid
- User ID can be extracted from token

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /api/auth/sync

Sync Clerk user with Convex database

```
Request:
POST /api/auth/sync
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "profileImage": "https://..."
}

Response:
{
  "success": true,
  "userId": "user_id_from_convex",
  "message": "User synchronized successfully"
}
```

#### GET /api/auth/user

Get current authenticated user

```
Request:
GET /api/auth/user
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "clerkId": "user_clerk_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/logout

Logout user (client handles token removal)

```
Request:
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Resume Routes (Protected - Require Auth)

#### POST /api/resume/analyze

Analyze resume (with authentication)

```
Request:
POST /api/resume/analyze
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- resume: File (PDF/DOCX/TXT)

Response:
{
  "success": true,
  "analysis": {
    "repeated": [...],
    "impact": {...},
    "brevity": {...},
    "skills": {...},
    "overallScore": 76,
    "aiInsights": "..."
  }
}
```

#### POST /api/resume/analyze-with-jd

Match resume against job description (with authentication)

```
Request:
POST /api/resume/analyze-with-jd
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- resume: File
- jobDescription: string

Response:
{
  "success": true,
  "analysis": {
    "atsScore": {...},
    "matchedSkills": [...],
    "keywordGaps": {...},
    "targetedSuggestions": [...],
    "aiSuggestions": "..."
  }
}
```

#### GET /api/resume/history

Get user's analysis history

```
Request:
GET /api/resume/history
Authorization: Bearer <token>

Response:
{
  "success": true,
  "analyses": [
    {
      "_id": "analysis_id",
      "analysisType": "quality",
      "results": {...},
      "analyzedAt": 1234567890
    },
    ...
  ]
}
```

#### GET /api/resume/history/:analysisId

Get specific analysis result

```
Request:
GET /api/resume/history/analysis_id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "analysis": {
    "_id": "analysis_id",
    "analysisType": "quality",
    "results": {...},
    "analyzedAt": 1234567890
  }
}
```

#### DELETE /api/resume/history/:analysisId

Delete analysis result

```
Request:
DELETE /api/resume/history/analysis_id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Analysis deleted"
}
```

---

## Convex Database Schema

### Users Table

```typescript
{
  clerkId: string,      // Clerk user ID
  email: string,        // User email
  name: string,         // User full name
  profileImage?: string,// Avatar URL
  createdAt: number,    // Timestamp
  updatedAt: number     // Last update timestamp
}
```

### Resumes Table

```typescript
{
  userId: Id<"users">,           // Foreign key to users
  fileName: string,              // Stored filename
  originalFileName: string,      // Original upload name
  fileContent: string,           // Extracted text content
  uploadedAt: number,            // Upload timestamp
  fileSize: number,              // File size in bytes
  metadata: {
    name?: string,
    email?: string,
    phone?: string,
    skills?: string[]
  }
}
```

### AnalysisResults Table

```typescript
{
  userId: Id<"users">,                        // Foreign key
  resumeId: Id<"resumes">,                    // Foreign key
  analysisType: "quality" | "jd-match",      // Analysis type
  jobDescription?: string,                    // JD if match analysis
  results: {
    // Quality analysis fields
    repeated?: Array<{word, frequency, suggestions}>,
    impact?: {weak: [], strong: []},
    brevity?: {score, totalBullets, improvements},
    skills?: {detected, missing, coverage},
    overallScore?: number,

    // JD match fields
    atsScore?: {score, keywordMatch, sectionCompletion, matchedKeywords},
    matchedSkills?: string[],
    keywordGaps?: {missing, present},
    targetedSuggestions?: Array<{type, suggestion}>
  },
  analyzedAt: number,                         // Analysis timestamp
  aiEnhanced: boolean,                        // Has AI suggestions
  aiSuggestions?: string                      // AI text improvements
}
```

### UserPreferences Table

```typescript
{
  userId: Id<"users">,
  theme: "light" | "dark",
  notifications: boolean,
  defaultModel?: string,
  customSkills?: string[],
  updatedAt: number
}
```

### AuditLogs Table

```typescript
{
  userId: Id<"users">,
  action: string,  // 'resume_uploaded', 'analysis_run', etc.
  details: {
    resumeId?: Id<"resumes">,
    analysisId?: Id<"analysisResults">,
    description?: string
  },
  createdAt: number
}
```

---

## Frontend Authentication Hook

### useUser() Hook (Clerk)

```jsx
import { useUser } from "@clerk/clerk-react";

function MyComponent() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return <SignInButton />;
  }

  return <div>Welcome, {user.firstName}!</div>;
}
```

### Getting Auth Token

```jsx
const { user } = useUser();
const token = await user?.getToken();

axios.get("/api/resume/history", {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Security Features

✅ **JWT Token Validation** - All routes check token validity
✅ **User Isolation** - Users can only access their own data
✅ **Rate Limiting** - Prevent abuse (implement with express-rate-limit)
✅ **CORS Protection** - Only allow frontend origin
✅ **File Upload Validation** - Type and size checks
✅ **Error Handling** - Don't expose sensitive info

---

## Troubleshooting

### "Invalid token" Error

**Problem**: API returns 401 Unauthorized

**Solutions**:

1. Check token is being sent in header: `Authorization: Bearer <token>`
2. Verify Clerk is properly initialized
3. Check token hasn't expired
4. Restart backend server

### "CORS Error"

**Problem**: Browser blocks request from frontend

**Solutions**:

1. Verify `CORS_ORIGIN` in backend .env matches frontend URL
2. Check backend server is running
3. For development, set: `CORS_ORIGIN=http://localhost:3000`

### "User Not Found in Convex"

**Problem**: User logged in but analysis fails

**Solutions**:

1. Call `POST /api/auth/sync` after login
2. Wait for `createOrUpdateUser` mutation to complete
3. Check Convex deployment URL is correct

### "Convex URL Not Found"

**Problem**: Frontend can't connect to Convex

**Solutions**:

1. Verify `VITE_CONVEX_URL` is set correctly
2. Check Convex project is deployed
3. Ensure environment variable is in `.env.local`
4. Restart dev server after changing env vars

---

## Production Deployment

### Environment Variables

Update these for production:

**Frontend (.env.production)**:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxx
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_API_URL=https://api.youromain.com
```

**Backend (.env.production)**:

```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://youromain.com
CONVEX_URL=https://your-project.convex.cloud
OPENROUTER_API_KEY=your_key
```

### Clerk Production Setup

1. Go to Clerk Dashboard → Applications
2. Switch to Production environment
3. Update frontend code with production publishable key
4. Update redirect URLs in Clerk dashboard

### Deploy Backend

```bash
# Option 1: Railway
railway init
railway up

# Option 2: Render
render deploy --production

# Option 3: AWS/Heroku
git push heroku main
```

### Deploy Frontend

```bash
# Option 1: Vercel
vercel deploy --prod

# Option 2: Netlify
netlify deploy --prod
```

---

## Performance Tips

1. **Cache Analysis Results** - Don't re-analyze same resume
2. **Paginate History** - Show 10 at a time, lazy load
3. **Compress Files** - Warn users about large PDFs
4. **Debounce Requests** - Prevent rapid duplicate calls
5. **Use CDN** - Serve frontend from edge

---

## Next Steps

1. ✅ Set up Clerk and Convex accounts
2. ✅ Configure environment variables
3. ✅ Deploy Convex schema
4. ✅ Test sign-in/sign-up flow
5. ✅ Verify data saves to Convex
6. ✅ Deploy to production
7. ✅ Monitor error logs

---

## Support & Resources

- **Clerk Docs**: https://clerk.com/docs
- **Convex Docs**: https://docs.convex.dev
- **JWT Tokens**: https://jwt.io/
- **Express Middleware**: https://expressjs.com/en/guide/using-middleware.html

---

**Your Resume Analyzer is now secure, scalable, and ready for production! 🚀**
