# Resume Analyzer - Configuration & API Reference

## Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# OpenRouter API (for AI features)
OPENROUTER_API_KEY=sk-your-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Logging
LOG_LEVEL=debug
```

## Frontend Configuration

The frontend automatically proxies API calls to `http://localhost:5000/api`.

For production, update the API base URL in the axios calls or create:

**`frontend/.env`**

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

## API Endpoints

### 1. Analyze Resume (Quality Analyzer)

**Endpoint**: `POST /api/resume/analyze`

**Request**:

```bash
curl -X POST http://localhost:5000/api/resume/analyze \
  -F "resume=@path/to/resume.pdf"
```

**Response**:

```json
{
  "success": true,
  "analysis": {
    "repeated": [
      {
        "word": "worked",
        "frequency": 7,
        "suggestions": ["led", "implemented", "developed", "architected"]
      }
    ],
    "impact": {
      "weak": [
        {
          "line": "Responsible for managing the team...",
          "weakWord": "responsible",
          "strongAlternatives": ["led", "managed", "directed"]
        }
      ],
      "strong": [
        {
          "line": "Led the redesign of the payment system...",
          "strongWord": "led"
        }
      ]
    },
    "brevity": {
      "score": 78,
      "totalBullets": 15,
      "improvements": [
        {
          "original": "This project involved working with the frontend team to create responsive components...",
          "issue": "Too long",
          "wordCount": 18,
          "suggestion": "Condense to 15-20 words max"
        }
      ]
    },
    "skills": {
      "detected": ["React", "JavaScript", "HTML", "CSS", "Node.js"],
      "missing": ["TypeScript", "Docker", "AWS", "REST APIs"],
      "coverage": 5
    },
    "overallScore": 76,
    "aiInsights": {
      "improvements": [
        {
          "original": "Worked on React components",
          "improved": "Architected 12 reusable React components adopted by 5 teams",
          "reason": "Adds specificity, metrics, and uses power verb"
        }
      ]
    }
  }
}
```

### 2. Analyze with Job Description

**Endpoint**: `POST /api/resume/analyze-with-jd`

**Request**:

```bash
curl -X POST http://localhost:5000/api/resume/analyze-with-jd \
  -F "resume=@path/to/resume.pdf" \
  -F "jobDescription=<job_description_text>"
```

**Response**:

```json
{
  "success": true,
  "analysis": {
    "atsScore": {
      "score": 72,
      "keywordMatch": 68,
      "sectionCompletion": 100,
      "matchedKeywords": 15,
      "totalKeywords": 22
    },
    "matchedSkills": {
      "matched": ["React", "JavaScript", "REST APIs", "Git"],
      "missing": ["TypeScript", "Docker", "AWS", "CI/CD"]
    },
    "keywordGaps": {
      "missingKeywords": [
        "microservices",
        "scalable",
        "agile",
        "kubernetes",
        "automated testing"
      ],
      "presentKeywords": [
        "REST API",
        "responsive design",
        "performance optimization"
      ]
    },
    "targetedSuggestions": [
      {
        "type": "skill",
        "suggestion": "Add 'TypeScript' to your skills section if you have experience"
      },
      {
        "type": "verb",
        "suggestion": "Emphasize leadership experience with action verbs like 'Led', 'Managed', 'Coordinated'"
      },
      {
        "type": "metrics",
        "suggestion": "Add quantifiable metrics to your achievements (e.g., 'Increased performance by 40%')"
      }
    ],
    "basicAnalysis": {
      "repeated": [...],
      "impact": {...},
      "brevity": {...},
      "skills": {...}
    },
    "aiRecommendations": {
      "improvements": [
        {
          "original": "Worked on improving API performance",
          "improved": "Optimized REST APIs to reduce latency by 35%, impacting 2M+ daily requests",
          "reason": "Directly addresses JD emphasis on scalability and includes metrics"
        }
      ]
    }
  }
}
```

### 3. Health Check

**Endpoint**: `GET /api/resume/health`

**Response**:

```json
{
  "status": "ok"
}
```

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "message": "Description of what went wrong",
    "status": 400
  }
}
```

Common errors:

- `400`: Missing required fields (file or job description)
- `413`: File too large (max 10MB)
- `415`: Unsupported file type
- `500`: Server error (check logs)

## Analysis Algorithms

### Repeated Words Detection

- Filters words shorter than 4 characters
- Counts occurrences (threshold: 4+)
- Returns top repeated words with alternatives
- Uses power-word dictionary for suggestions

### Impact Verb Analysis

- Weak verbs: "worked", "responsible", "helped", "involved"
- Strong verbs: "led", "implemented", "designed", "optimized"
- Provides context-specific replacements

### Brevity Scoring

- Ideal bullet length: 15-20 words
- < 5 words: Too vague (-3 points)
- > 25 words: Too long (-5 points)
- Max score: 100

### Skills Coverage

- Detects 50+ industry-standard skills
- Categories: Frontend, Backend, Databases, DevOps, Languages
- Recommends missing common skills

### ATS Scoring Formula

```
ATS Score = (KeywordMatch% × 0.6) + (SectionCompletion% × 0.4)
```

- Keyword Match: Presence of JD keywords in resume
- Section Completion: Resume has all key sections
- Result: 0-100 score

## File Storage

Uploaded files are temporarily stored in `backend/uploads/` and deleted after analysis.

To create the directory:

```bash
mkdir backend/uploads
```

## Supported LLM Models (OpenRouter)

By default: `mistral/mistral-7b-instruct`

Other options:

- `openai/gpt-3.5-turbo` (faster)
- `meta-llama/llama-2-13b-chat` (open source)
- `mistral/mistral-medium` (balanced)

To change, edit `backend/src/services/aiService.js`

## Performance Tips

1. **Resume Size**: Keep under 2 pages (10MB PDF typically)
2. **Job Description**: 500-2000 words works best
3. **Caching**: Browsers cache analysis results (clear cache to re-analyze)
4. **API Rate Limits**: OpenRouter has rate limits; check their docs

## Security Notes

- Input validation on file uploads
- CORS restricted to configured origin
- No personal data stored on server
- Files deleted after processing
- API key never exposed to frontend

## Deployment Checklist

- [ ] Set `NODE_ENV=production` in backend `.env`
- [ ] Add real OpenRouter API key
- [ ] Update `CORS_ORIGIN` to production frontend URL
- [ ] Set up database (if persistent storage needed)
- [ ] Enable HTTPS
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring & logging
- [ ] Test file uploads on production
- [ ] Configure backups
- [ ] Set rate limiting

---

For more information, see [README.md](./README.md) and [QUICKSTART.md](./QUICKSTART.md)
