/**
 * Calculate ATS (Applicant Tracking System) match score
 */
export const calculateATSScore = (resumeText, jobDescriptionText) => {
    const resumeWords = normalizeAndSplit(resumeText);
    const jobWords = normalizeAndSplit(jobDescriptionText);

    // Keyword matching
    let matchedCount = 0;
    jobWords.forEach(word => {
        if (resumeWords.includes(word)) {
            matchedCount++;
        }
    });

    const keywordMatchScore = (matchedCount / jobWords.length) * 100;

    // Section completeness check
    const sections = ['experience', 'education', 'skills', 'contact'];
    let sectionScore = 0;
    sections.forEach(section => {
        if (resumeText.toLowerCase().includes(section)) {
            sectionScore += 25;
        }
    });

    // Calculate final ATS score (weighted average)
    const atsScore = (keywordMatchScore * 0.6) + (sectionScore * 0.4);

    return {
        score: Math.round(atsScore),
        keywordMatch: Math.round(keywordMatchScore),
        sectionCompletion: sectionScore,
        matchedKeywords: matchedCount.toString(),
        totalKeywords: jobWords.length
    };
};

/**
 * Extract matched skills between resume and JD using AI
 */
export const extractMatchedSkills = async (resumeText, jobDescriptionText) => {
    try {
        // Only attempt AI extraction if API key is configured
        if (!process.env.OPENROUTER_API_KEY) {
            return extractMatchedSkillsStatic(resumeText, jobDescriptionText);
        }

        const { callOpenRouter } = await import('../services/aiService.js');

        // Extract skills from resume
        const resumeSystemPrompt = `You are an expert at identifying technical and professional skills from resume text.
Extract ONLY a JSON array of skills. Do not include explanations.`;

        const resumeUserPrompt = `Extract all technical and professional skills from this resume text:

${resumeText}

Return ONLY a valid JSON array like: ["skill1", "skill2", "skill3"]`;

        // Extract skills from job description
        const jobSystemPrompt = `You are an expert at identifying technical and professional skills required by job descriptions.
Extract ONLY a JSON array of required skills. Do not include explanations.`;

        const jobUserPrompt = `Extract all technical and professional skills required by this job description:

${jobDescriptionText}

Return ONLY a valid JSON array like: ["skill1", "skill2", "skill3"]`;

        const resumeSkillsResponse = await callOpenRouter(resumeSystemPrompt, resumeUserPrompt);
        const jobSkillsResponse = await callOpenRouter(jobSystemPrompt, jobUserPrompt);

        // Parse responses
        const resumeSkillsText = resumeSkillsResponse.content;
        const jobSkillsText = jobSkillsResponse.content;

        const jsonRegex = /\[[\s\S]*\]/;
        const resumeJsonMatch = resumeSkillsText.match(jsonRegex);
        const jobJsonMatch = jobSkillsText.match(jsonRegex);

        const resumeSkills = resumeJsonMatch ? JSON.parse(resumeJsonMatch[0]) : [];
        const jobSkills = jobJsonMatch ? JSON.parse(jobJsonMatch[0]) : [];

        // Normalize and deduplicate
        const normalizedResumeSkills = resumeSkills.map(s => s.toLowerCase().trim());
        const normalizedJobSkills = jobSkills.map(s => s.toLowerCase().trim());

        // Find matched and missing
        const matched = [];
        const missing = [];

        normalizedJobSkills.forEach(skill => {
            if (normalizedResumeSkills.includes(skill)) {
                matched.push(skill);
            } else {
                missing.push(skill);
            }
        });

        // Remove duplicates
        return {
            matched: [...new Set(matched)],
            missing: [...new Set(missing)]
        };
    } catch (error) {
        console.error('Error extracting skills with AI, falling back to static extraction:', error.message);
        return extractMatchedSkillsStatic(resumeText, jobDescriptionText);
    }
};

/**
 * Static regex-based skill extraction (fallback)
 */
const extractMatchedSkillsStatic = (resumeText, jobDescriptionText) => {
    const skillPatterns = [
        /\b(python|javascript|typescript|java|c\+\+|go|rust|ruby|php)\b/gi,
        /\b(react|vue|angular|next\.js|svelte)\b/gi,
        /\b(node\.js|express|django|flask|fastapi)\b/gi,
        /\b(postgresql|mysql|mongodb|redis|dynamodb)\b/gi,
        /\b(docker|kubernetes|ci\/cd|aws|azure|gcp|terraform)\b/gi,
        /\b(git|rest api|graphql|linux|unix)\b/gi
    ];

    const matched = new Set();
    const missing = new Set();

    skillPatterns.forEach(pattern => {
        const resumeMatches = resumeText.match(pattern) || [];
        const jobMatches = jobDescriptionText.match(pattern) || [];

        jobMatches.forEach(skill => {
            if (resumeMatches.some(r => r.toLowerCase() === skill.toLowerCase())) {
                matched.add(skill.toLowerCase());
            } else {
                missing.add(skill.toLowerCase());
            }
        });
    });

    return {
        matched: Array.from(matched),
        missing: Array.from(missing)
    };
};

/**
 * Find keyword gaps
 */
export const findKeywordGaps = (resumeText, jobDescriptionText) => {
    const jobKeywords = extractKeywords(jobDescriptionText);
    const resumeKeywords = extractKeywords(resumeText);

    const gaps = jobKeywords.filter(kw => !resumeKeywords.includes(kw));

    return {
        missing: gaps.slice(0, 10),
        present: jobKeywords.filter(kw => resumeKeywords.includes(kw))
    };
};

/**
 * Generate targeted resume suggestions using AI
 */
export const generateTargetedSuggestions = async (resumeText, jobDescriptionText) => {
    try {
        // Only attempt AI extraction if API key is configured
        if (!process.env.OPENROUTER_API_KEY) {
            return generateTargetedSuggestionsStatic(resumeText, jobDescriptionText);
        }

        const { callOpenRouter } = await import('../services/aiService.js');

        const systemPrompt = `You are an expert recruiter and resume optimization specialist.

Analyze the resume against the job description and generate targeted suggestions to improve job match. Focus on:
- Missing skills or keywords from the JD
- Action verbs and leadership language that should be emphasized
- Quantifiable metrics and achievements that align with the role
- Experience positioning and relevance
- Professional terminology from the JD that should appear in resume

Return ONLY a valid JSON array. Do not include explanations or code blocks.`;

        const userPrompt = `Job Description:
${jobDescriptionText}

---

Resume:
${resumeText}

---

Generate targeted suggestions to improve this resume's alignment with the job description. Return ONLY a JSON array with this structure:

[
  {
    "type": "skill|verb|metrics|positioning",
    "suggestion": "specific actionable suggestion",
    "keyword": "relevant keyword or skill if applicable if it coming out to be null then send empty string instead"
  }
]

If no suggestions, return: []`;

        const message = await callOpenRouter(systemPrompt, userPrompt);
        const response = message.content;
        // console.log('LLM response for targeted suggestions:', response);
        try {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            const suggestions = JSON.parse(jsonMatch ? jsonMatch[0] : response);
            return Array.isArray(suggestions) ? suggestions : [];
        } catch (error) {
            console.error('Failed to parse suggestions:', error);
            return generateTargetedSuggestionsStatic(resumeText, jobDescriptionText);
        }
    } catch (error) {
        console.error('Error generating AI suggestions, falling back to static:', error.message);
        return generateTargetedSuggestionsStatic(resumeText, jobDescriptionText);
    }
};

/**
 * Static suggestion generation (fallback)
 */
const generateTargetedSuggestionsStatic = (resumeText, jobDescriptionText) => {
    const suggestions = [];

    // Extract job requirements
    const jobKeywords = extractKeywords(jobDescriptionText);
    const resumeKeywords = extractKeywords(resumeText);

    // Suggest skill additions
    jobKeywords.forEach(keyword => {
        if (!resumeKeywords.includes(keyword)) {
            suggestions.push({
                type: 'skill',
                suggestion: `Add "${keyword}" to your skills section if you have experience with it`,
                keyword
            });
        }
    });

    // Suggest section enhancements
    if (jobDescriptionText.toLowerCase().includes('lead') ||
        jobDescriptionText.toLowerCase().includes('team')) {
        if (!resumeText.toLowerCase().includes('led') &&
            !resumeText.toLowerCase().includes('managed')) {
            suggestions.push({
                type: 'verb',
                suggestion: 'Emphasize leadership experience with action verbs like "Led", "Managed", "Coordinated"'
            });
        }
    }

    // Suggest metric additions
    const metricKeywords = ['increased', 'reduced', 'improved', 'optimized', 'scaled'];
    const hasMetrics = metricKeywords.some(m => resumeText.toLowerCase().includes(m));

    if (!hasMetrics) {
        suggestions.push({
            type: 'metrics',
            suggestion: 'Add quantifiable metrics to your achievements (e.g., "Increased performance by 40%")'
        });
    }

    return suggestions;
};

/**
 * Helper: Normalize and split text
 */
const normalizeAndSplit = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2);
};

/**
 * Helper: Extract important keywords
 */
const extractKeywords = (text) => {
    const keywords = new Set();

    // Technical skills
    const techPatterns = [
        /\b(python|javascript|typescript|java|c\+\+|go|rust)\b/gi,
        /\b(react|vue|angular|next\.js|node\.js|express)\b/gi,
        /\b(postgresql|mysql|mongodb|redis)\b/gi,
        /\b(docker|kubernetes|aws|azure|gcp)\b/gi
    ];

    techPatterns.forEach(pattern => {
        const matches = text.match(pattern) || [];
        matches.forEach(match => keywords.add(match.toLowerCase()));
    });

    // Important phrases
    const phrasePatterns = [
        /\brest api\b/gi,
        /\bci\/cd\b/gi,
        /\bagile\b/gi,
        /\bscrum\b/gi,
        /\bdevops\b/gi
    ];

    phrasePatterns.forEach(pattern => {
        const matches = text.match(pattern) || [];
        matches.forEach(match => keywords.add(match.toLowerCase()));
    });

    return Array.from(keywords);
};
