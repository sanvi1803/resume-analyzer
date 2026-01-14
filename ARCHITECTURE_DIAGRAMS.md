# Resume Analyzer - Architecture & Flow Diagrams

## User Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    User Registration                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Sign Up Form    │
                    │  (Clerk Modal)   │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Clerk API      │
                    │  Validate Email  │
                    │  Hash Password   │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  JWT Token       │
                    │  Generated       │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────┐
                    │  Frontend calls              │
                    │  POST /api/auth/sync         │
                    │  with token & user data      │
                    └──────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────┐
                    │  Backend validates token     │
                    │  Extracts clerkId            │
                    │  Calls Convex mutation       │
                    └──────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────┐
                    │  Convex Database             │
                    │  Creates user record         │
                    │  Sets default preferences    │
                    └──────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────┐
                    │  User signed in successfully │
                    │  Can now upload resumes      │
                    └──────────────────────────────┘
```

---

## Resume Analysis With Storage Flow

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│         User uploads resume and requests analysis            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Frontend reads file                    │
        │  Sends POST /api/resume/analyze         │
        │  with file + JWT token                  │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Backend receives request               │
        │  authMiddleware validates JWT token     │
        │  Extracts user clerkId                  │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Parse file (PDF/DOCX/TXT)              │
        │  Extract text content                   │
        │  Normalize whitespace                   │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Save resume to Convex                  │
        │  uploadResume() mutation                │
        │  Store content + metadata               │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Run 5 analysis algorithms              │
        │  ✓ Repeated words detection             │
        │  ✓ Impact verb analysis                 │
        │  ✓ Brevity scoring                      │
        │  ✓ Skills extraction                    │
        │  ✓ Overall score calculation            │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Optional: Call OpenRouter AI           │
        │  Generate improvement suggestions       │
        │  (if API key configured)                │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Save analysis results to Convex        │
        │  saveAnalysisResult() mutation          │
        │  Link to resume and user                │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Clean up temporary file                │
        │  fs.unlink() on uploads dir             │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Return JSON results to frontend        │
        │  Analysis + AI insights                 │
        │  analysisId for history                 │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Frontend displays analysis             │
        │  Shows scores and suggestions           │
        │  User can save or delete                │
        └─────────────────────────────────────────┘
```

---

## Data Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                      │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ React App                                           │  │
│  │ ├─ ClerkProvider (Authentication)                   │  │
│  │ ├─ ConvexProvider (Real-time)                       │  │
│  │ └─ Components                                       │  │
│  │    ├─ Header (with UserButton)                      │  │
│  │    ├─ Dashboard (shows history)                     │  │
│  │    └─ Analyzer (upload + results)                   │  │
│  └─────────────────────────────────────────────────────┘  │
│              │                          │                  │
│              ▼                          ▼                  │
│        [Clerk Servers]           [Convex Servers]         │
│      (authentication)          (real-time database)        │
└────────────────────────────────────────────────────────────┘
              │                          │
              │                          │
              ▼                          ▼
┌────────────────────────────────────────────────────────────┐
│                    Backend (Express)                       │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ API Routes                                          │  │
│  │ ├─ /api/auth/*         (Authentication)             │  │
│  │ │  ├─ POST /sync       → createOrUpdateUser()       │  │
│  │ │  ├─ GET /user        → getCurrentUser()           │  │
│  │ │  └─ POST /logout     → (client handles)           │  │
│  │ │                                                   │  │
│  │ └─ /api/resume/*       (Analysis)                   │  │
│  │    ├─ POST /analyze    → analyzeResume()            │  │
│  │    ├─ POST /analyze-jd → analyzeWithJD()            │  │
│  │    ├─ GET /history     → getAnalysisHistory()       │  │
│  │    └─ DELETE /history  → deleteAnalysis()           │  │
│  │                                                     │  │
│  ├─ Services                                            │  │
│  │ ├─ analysisService.js  (5 algorithms)               │  │
│  │ ├─ aiService.js        (OpenRouter integration)     │  │
│  │ └─ convexService.js    (Database client)            │  │
│  │                                                     │  │
│  └─ Middleware                                          │  │
│    └─ authMiddleware.js  (JWT validation)              │  │
│                                                        │  │
└────────────────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────────┐
│                  Convex Cloud Database                     │
│                                                            │
│  ┌─────────────────┐  ┌──────────────────┐               │
│  │ users           │  │ resumes          │               │
│  ├─────────────────┤  ├──────────────────┤               │
│  │ clerkId         │  │ userId (FK)      │               │
│  │ email           │  │ fileContent      │               │
│  │ name            │  │ metadata         │               │
│  │ profileImage    │  │ uploadedAt       │               │
│  │ createdAt       │  └──────────────────┘               │
│  │ updatedAt       │                                     │
│  └─────────────────┘                                     │
│          │                                               │
│          │ 1:N relationship                              │
│          │                                               │
│          ▼                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐     │
│  │ analysisResults      │  │ userPreferences      │     │
│  ├──────────────────────┤  ├──────────────────────┤     │
│  │ userId (FK)          │  │ userId (FK)          │     │
│  │ resumeId (FK)        │  │ theme                │     │
│  │ analysisType         │  │ notifications        │     │
│  │ results (JSON)       │  │ customSkills         │     │
│  │ aiSuggestions        │  │ updatedAt            │     │
│  │ analyzedAt           │  └──────────────────────┘     │
│  └──────────────────────┘                               │
│          │                                               │
│          │ (optional)                                   │
│          ▼                                               │
│  ┌──────────────────────┐                               │
│  │ auditLogs            │                               │
│  ├──────────────────────┤                               │
│  │ userId (FK)          │                               │
│  │ action               │                               │
│  │ details (JSON)       │                               │
│  │ createdAt            │                               │
│  └──────────────────────┘                               │
│                                                        │
└────────────────────────────────────────────────────────────┘
```

---

## Request-Response Cycle

```
1. USER SIGN UP
   ─────────────────────────────────────────────────────
   Frontend                Backend                Convex
   ├─ Sign up form
   │  (Clerk modal)
   │
   ├─ POST /api/auth/sync
   │─────────────────────────────►
   │          │
   │          ├─ Verify JWT token
   │          │
   │          ├─ createOrUpdateUser()
   │          │─────────────────────────────►
   │          │          │
   │          │          ├─ Create user record
   │          │          ├─ Create preferences
   │          │          ├─ Return userId
   │          │◄─────────────────────────────
   │          │
   │◄─────────────────────────────
   │  userId
   │
   └─ User dashboard loads
      (can now upload)

2. UPLOAD & ANALYZE
   ─────────────────────────────────────────────────────
   Frontend                Backend                Convex
   ├─ Upload resume
   │  + JWT token
   │
   ├─ POST /api/resume/analyze
   │─────────────────────────────►
   │          │
   │          ├─ Verify token → get userId
   │          │
   │          ├─ Parse file
   │          │
   │          ├─ uploadResume()
   │          │─────────────────────────────►
   │          │          │
   │          │          ├─ Store file content
   │          │          ├─ Return resumeId
   │          │◄─────────────────────────────
   │          │
   │          ├─ Run 5 analyses (local)
   │          │
   │          ├─ saveAnalysisResult()
   │          │─────────────────────────────►
   │          │          │
   │          │          ├─ Store results
   │          │          ├─ Log action
   │          │          ├─ Return analysisId
   │          │◄─────────────────────────────
   │          │
   │◄─────────────────────────────
   │  { analysis results }
   │
   └─ Display results UI

3. VIEW HISTORY
   ─────────────────────────────────────────────────────
   Frontend                Backend                Convex
   ├─ Click "History"
   │  button
   │
   ├─ GET /api/resume/history
   │  + JWT token
   │─────────────────────────────►
   │          │
   │          ├─ Verify token → get userId
   │          │
   │          ├─ getAnalysisHistory(userId)
   │          │─────────────────────────────►
   │          │          │
   │          │          ├─ Query: userId == params.userId
   │          │          ├─ Order by analyzedAt DESC
   │          │          ├─ Return [] of analyses
   │          │◄─────────────────────────────
   │          │
   │◄─────────────────────────────
   │  [ { analysis 1 },
   │    { analysis 2 },
   │    ... ]
   │
   └─ Render history list
      in Dashboard
```

---

## Authentication States

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                Application States                      │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  STATE 1: Not Loaded                                  │
│  ├─ isLoaded: false                                   │
│  └─ Show: "Loading..." spinner                        │
│                                                        │
│  STATE 2: Not Signed In                               │
│  ├─ isSignedIn: false                                 │
│  ├─ isLoaded: true                                    │
│  └─ Show: Sign-in prompt with feature list            │
│                                                        │
│  STATE 3: Signed In, Home View                        │
│  ├─ user: { firstName, email, ... }                   │
│  ├─ isSignedIn: true                                  │
│  └─ Show: Mode selector (Quality/JD-Match)            │
│                                                        │
│  STATE 4: Analyzing                                   │
│  ├─ loading: true                                     │
│  ├─ Show: Loading spinner + progress                  │
│  └─ Disable submit button                             │
│                                                        │
│  STATE 5: Results Displayed                           │
│  ├─ analysis: { results... }                          │
│  ├─ Show: All analysis cards                          │
│  └─ Button: Back, Save, Delete, etc.                  │
│                                                        │
│  STATE 6: Dashboard                                   │
│  ├─ Show: Stats + history list                        │
│  ├─ Can delete old analyses                           │
│  └─ Can view old analysis details                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│              Security Implementation                │
└─────────────────────────────────────────────────────┘

Layer 1: Frontend Security
├─ Clerk handles password security
├─ Session tokens auto-refresh
├─ JWT sent in Authorization header
└─ HTTPS enforced in production

Layer 2: API Authentication
├─ verifyClerkToken middleware
├─ Decode JWT token
├─ Extract clerkId from token
├─ Return 401 if invalid
└─ Attach user info to request

Layer 3: Authorization
├─ requireAuth middleware
├─ Check user exists in request
├─ Check user ID on DB operations
├─ Prevent cross-user access
└─ Audit log all actions

Layer 4: Data Protection
├─ Users isolated by userId
├─ Can only access own resumes
├─ Can only access own analyses
├─ No user data exposure
└─ Temporary files deleted

Layer 5: Production Ready
├─ CORS validation
├─ Rate limiting (add express-rate-limit)
├─ Error handling (no sensitive info)
├─ HTTPS/SSL encryption
└─ Database backups enabled
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                   Production Setup                       │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Vercel/Netlify)                              │
│  ├─ React app (dist build)                              │
│  ├─ Clerk integration                                   │
│  ├─ Auto-deploy from git                               │
│  └─ CDN/Global edge network                            │
│                                                          │
│              ↓ (API calls)                              │
│                                                          │
│  Backend (Railway/Render/AWS)                           │
│  ├─ Express server                                      │
│  ├─ API endpoints                                       │
│  ├─ JWT validation                                      │
│  └─ Analysis engines                                    │
│                                                          │
│              ↓ (Database calls)                         │
│                                                          │
│  Convex Cloud                                           │
│  ├─ Managed database                                    │
│  ├─ Real-time sync                                      │
│  ├─ Auto-scaling                                        │
│  └─ Built-in security                                   │
│                                                          │
│              ↓ (Optional AI)                            │
│                                                          │
│  OpenRouter API                                         │
│  ├─ LLM inference                                       │
│  ├─ Improvement suggestions                            │
│  └─ Pay-per-call pricing                               │
│                                                          │
│              ↓ (Auth provider)                          │
│                                                          │
│  Clerk                                                  │
│  ├─ User management                                     │
│  ├─ OAuth/Password auth                                │
│  ├─ Session management                                 │
│  └─ Email verification                                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

**For detailed implementation steps, see [AUTHENTICATION.md](./AUTHENTICATION.md)**
