#!/bin/bash
# Resume Analyzer - Authentication & Convex Setup Checklist

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Resume Analyzer - Auth & Convex Setup Checklist      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: External Setup${NC}"
echo "[ ] 1. Create Clerk account at https://clerk.com"
echo "[ ] 2. Create Convex account at https://convex.dev"
echo "[ ] 3. Copy Clerk Publishable Key"
echo "[ ] 4. Copy Convex Deployment URL"
echo ""

echo -e "${YELLOW}Step 2: Configure Environment Variables${NC}"
echo ""
echo "Create backend/.env:"
echo "[ ] PORT=5000"
echo "[ ] NODE_ENV=development"
echo "[ ] CORS_ORIGIN=http://localhost:3000"
echo "[ ] CONVEX_URL=<your-convex-url>"
echo "[ ] OPENROUTER_API_KEY=<your-api-key>"
echo ""
echo "Create frontend/.env.local:"
echo "[ ] VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-key>"
echo "[ ] VITE_CONVEX_URL=<your-convex-url>"
echo "[ ] VITE_API_URL=http://localhost:5000"
echo ""

echo -e "${YELLOW}Step 3: Deploy Convex Schema${NC}"
echo "[ ] Run: cd backend/convex && npx convex deploy"
echo ""

echo -e "${YELLOW}Step 4: Install Dependencies${NC}"
echo "[ ] Backend: cd backend && npm install"
echo "[ ] Frontend: cd frontend && npm install"
echo ""

echo -e "${YELLOW}Step 5: Start Development Servers${NC}"
echo "[ ] Terminal 1: cd backend && npm run dev"
echo "[ ] Terminal 2: cd frontend && npm run dev"
echo ""

echo -e "${YELLOW}Step 6: Test Application${NC}"
echo "[ ] Open http://localhost:3000"
echo "[ ] Sign up with test email"
echo "[ ] Upload a resume"
echo "[ ] Verify analysis is saved"
echo "[ ] Check history shows analysis"
echo ""

echo -e "${YELLOW}Step 7: Verify Database${NC}"
echo "[ ] Check Convex dashboard shows new user"
echo "[ ] Check 'users' table has your user"
echo "[ ] Check 'resumes' table has uploaded resume"
echo "[ ] Check 'analysisResults' table has results"
echo ""

echo -e "${YELLOW}Production Checklist${NC}"
echo "[ ] Switch Clerk to production keys"
echo "[ ] Update Convex to production deployment"
echo "[ ] Set CORS_ORIGIN to production domain"
echo "[ ] Configure error monitoring (Sentry)"
echo "[ ] Add rate limiting"
echo "[ ] Set up database backups"
echo "[ ] Enable HTTPS/SSL"
echo "[ ] Test all authentication flows"
echo ""

echo -e "${GREEN}✓ Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Read AUTHENTICATION.md for detailed guide"
echo "2. See API endpoints section for integration"
echo "3. Check troubleshooting for common issues"
echo ""
