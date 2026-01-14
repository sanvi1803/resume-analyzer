# Resume Analyzer - AI-Powered Resume Improvement Tool

A professional, dual-mode AI-powered web application that helps users improve their resumes and match them against job descriptions using intelligent analysis and ATS scoring.

## 🎯 Features

### Mode 1: Resume Quality Analyzer

- **Repeated Words Analysis**: Detects overused words and phrases with smart alternatives
- **Impact Verb Analysis**: Identifies weak vs strong action verbs for maximum impact
- **Brevity & Clarity Score**: Analyzes bullet point length and clarity
- **Skills Coverage**: Extracts and evaluates technical and soft skills
- **Overall Strength Score**: Comprehensive 0-100 resume quality rating

### Mode 2: Resume vs Job Description Matcher

- **ATS Match Score**: Calculates percentage match between resume and JD (weighted algorithm)
- **Skill Gap Analysis**: Shows matched skills and missing opportunities
- **Keyword Gap Detection**: Highlights important JD keywords not in resume
- **Targeted Suggestions**: Bullet-level recommendations for improvement
- **AI-Powered Insights**: LLM-based specific improvement suggestions (with OpenRouter API)

## 🛠️ Tech Stack

### Backend

- **Node.js / Express.js** - API server
- **Multer** - File upload handling
- **pdf-parse** - PDF parsing
- **DOCX** - DOCX file parsing
- **OpenRouter API** - LLM integration for advanced insights
- **Axios** - HTTP client

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **React Icons** - Icon library
- **Axios** - API calls
- **CSS3** - Styling with CSS variables

## 📋 Prerequisites

- Node.js 16+ and npm
- OpenRouter API key (optional, for AI features)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd ResumeAnalyzer
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenRouter API key (optional):

```
OPENROUTER_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Create uploads directory:

```bash
mkdir uploads
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🏃 Running the Application

### Terminal 1: Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Terminal 2: Frontend Dev Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### Build for Production

Frontend:

```bash
cd frontend
npm run build
```

## 📖 API Documentation

### Endpoints

#### 1. Analyze Resume (Quality Analyzer)

**POST** `/api/resume/analyze`

Request:

- Form data with `resume` file (PDF, DOCX, or TXT)

Response:

```json
{
  "success": true,
  "analysis": {
    "repeated": [
      {
        "word": "worked",
        "frequency": 7,
        "suggestions": ["led", "implemented", "developed"]
      }
    ],
    "impact": {
      "weak": [...],
      "strong": [...]
    },
    "brevity": {
      "score": 85,
      "totalBullets": 12,
      "improvements": [...]
    },
    "skills": {
      "detected": ["React", "JavaScript", ...],
      "missing": ["TypeScript", "Docker"],
      "coverage": 8
    },
    "overallScore": 78
  }
}
```

#### 2. Analyze with Job Description

**POST** `/api/resume/analyze-with-jd`

Request:

- Form data with `resume` file
- Form data with `jobDescription` (text)

Response:

```json
{
  "success": true,
  "analysis": {
    "atsScore": {
      "score": 72,
      "keywordMatch": 65,
      "sectionCompletion": 100,
      "matchedKeywords": 15,
      "totalKeywords": 23
    },
    "matchedSkills": {
      "matched": ["React", "JavaScript"],
      "missing": ["TypeScript", "Docker"]
    },
    "keywordGaps": {
      "missingKeywords": ["scalable", "microservices"],
      "presentKeywords": ["REST API", "responsive"]
    },
    "targetedSuggestions": [
      {
        "type": "skill",
        "suggestion": "Add TypeScript to skills if you have experience"
      }
    ]
  }
}
```

## 🔍 Analysis Methodology

### Repeated Words Analysis

- Filters common short words
- Counts word frequency (threshold: 4+ occurrences)
- Provides context-aware alternatives from power-word dictionary

### Impact Word Analysis

- Checks against weak verb dictionary (worked, responsible, helped, etc.)
- Identifies strong verbs (led, implemented, designed, optimized, etc.)
- Suggests replacements for maximum resume impact

### Brevity Scoring

- Analyzes bullet point length (ideal: 15-20 words)
- Penalizes vague or overly long descriptions
- Suggests specific metrics and measurable outcomes

### Skills Coverage

- Detects technical skills (Frontend, Backend, Databases, DevOps)
- Identifies soft skills
- Recommends industry-standard missing skills

### ATS Scoring

- **Keyword Matching (60% weight)**: Keywords from JD present in resume
- **Section Completion (40% weight)**: Presence of key resume sections
- Returns detailed breakdown of match

## 🎨 UI/UX Design

- **Color Coded Feedback**:

  - 🔴 Red: Weak / Missing (< 60%)
  - 🟡 Yellow: Needs Improvement (60-80%)
  - 🟢 Green: Strong (80%+)

- **Responsive Layout**: Mobile-friendly design with CSS Grid
- **Real-time Feedback**: Instant analysis results
- **Visual Clarity**: Cards, badges, and progress meters

## 🔐 Security Notes

- File uploads limited to 10MB
- Allowed file types: PDF, DOCX, TXT
- Files are temporarily stored and deleted after analysis
- CORS enabled for frontend domain only

## 📝 Example Resume Input

Any resume in PDF, DOCX, or TXT format. The analyzer extracts:

- Contact information
- Work experience
- Education
- Skills
- Certifications
- Summary/Objective

## 🤖 AI Features (Optional)

When `OPENROUTER_API_KEY` is set, the application provides:

- LLM-powered improvement suggestions
- Contextual rephrasing of bullet points
- Specific recommendations based on job description
- Professional language enhancements

## 🐛 Troubleshooting

### Issue: CORS errors

- Check that `CORS_ORIGIN` in backend `.env` matches frontend URL
- Ensure backend is running on port 5000

### Issue: File upload fails

- Verify file is PDF, DOCX, or TXT
- Check file size (max 10MB)
- Ensure `/uploads` directory exists in backend

### Issue: AI features not working

- Verify `OPENROUTER_API_KEY` is set in `.env`
- Check API key validity and credits
- AI features are optional; app works without them

## 📦 Project Structure

```
ResumeAnalyzer/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── utils/
│   │   └── models/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── analyses/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Deploy Backend (Node.js)

- Heroku, Railway, or any Node.js hosting
- Set environment variables in production
- Use `npm start` for production start

### Deploy Frontend

- Netlify, Vercel, or any static hosting
- Run `npm run build` to create production build
- Deploy contents of `dist/` folder

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 💡 Future Enhancements

- [ ] Resume template suggestions
- [ ] Multi-language support
- [ ] Export improved resume to PDF/DOCX
- [ ] Cover letter analyzer
- [ ] Salary prediction based on skills
- [ ] Interview question suggestions
- [ ] Portfolio link recommendations
- [ ] Competitive analysis (compare with similar profiles)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for job seekers worldwide**
