# Quick Start Guide

## Setup in 3 Steps

### 1️⃣ Backend Configuration

```bash
cd backend

# Copy the environment template
cp .env.example .env

# Edit .env and add your OpenRouter API key (optional):
# OPENROUTER_API_KEY=sk-your-key-here
```

### 2️⃣ Start Backend Server

```bash
cd backend
npm run dev
```

Server will run on: **http://localhost:5000**

### 3️⃣ Start Frontend (new terminal)

```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🎯 How to Use

### Option 1: Analyze Resume Quality

1. Click "Resume Quality Analyzer"
2. Upload your resume (PDF, DOCX, or TXT)
3. Get instant feedback on:
   - Repeated words
   - Impact verbs
   - Brevity score
   - Skills coverage
   - Overall score

### Option 2: Match with Job Description

1. Click "Resume vs Job Description"
2. Upload your resume
3. Paste the job description
4. Get:
   - ATS match score (%)
   - Matched skills
   - Missing skills
   - Keyword gaps
   - Targeted improvement suggestions

---

## 📁 Project Structure

```
ResumeAnalyzer/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express server
│   │   ├── routes/resumeRoutes.js # API routes
│   │   ├── controllers/           # Business logic
│   │   ├── services/              # AI & analysis
│   │   └── utils/                 # Helpers
│   └── uploads/                   # Temp file storage
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main component
│   │   ├── components/            # UI components
│   │   └── components/analyses/   # Analysis cards
│   └── index.html
└── README.md                       # Full documentation
```

---

## 🔑 API Key Setup (Optional)

To enable AI-powered suggestions:

1. Get a free API key from [OpenRouter](https://openrouter.ai)
2. Add to `backend/.env`:
   ```
   OPENROUTER_API_KEY=your_key_here
   ```
3. Restart backend server
4. AI features will now be available

---

## 🚀 Production Build

### Frontend

```bash
cd frontend
npm run build
# Deploy the `dist/` folder
```

### Backend

```bash
cd backend
npm start
# Or use any Node.js hosting (Heroku, Railway, etc.)
```

---

## 🛠️ Troubleshooting

| Issue                   | Solution                                           |
| ----------------------- | -------------------------------------------------- |
| CORS errors             | Check `CORS_ORIGIN` in `.env` matches frontend URL |
| File upload fails       | Ensure file is PDF/DOCX/TXT and < 10MB             |
| AI features not working | Verify OpenRouter API key in `.env`                |
| Port already in use     | Change port in `.env` (PORT=5000)                  |

---

## 📚 File Upload Supported Formats

- ✅ PDF (.pdf)
- ✅ Word (.docx)
- ✅ Text (.txt)
- ❌ Google Docs (download as PDF first)
- ❌ Images/screenshots (use text format)

---

## 💡 Tips for Best Results

1. **Resume Format**: Use standard resume format (Chronological or Combination)
2. **JD Matching**: Paste full job description for accurate matching
3. **Keywords**: Include relevant technical skills explicitly
4. **Metrics**: Use numbers in achievements (e.g., "Increased by 40%")
5. **Action Verbs**: Start bullet points with strong verbs

---

## 📞 Support

For issues or questions, check the [README.md](./README.md) file.

---

**Ready to improve your resume? Start with http://localhost:3000 after running both servers!**
