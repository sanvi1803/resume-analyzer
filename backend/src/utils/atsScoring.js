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
 * Calculate dynamic ATS score based on industry requirements
 */
export const calculateATSScoreJD = (resumeText, jobDescriptionText, matchedSkills = [], keywordGaps = {}, industryRequirements = null) => {
    const resumeWords = normalizeAndSplit(resumeText);
    const jobWords = normalizeAndSplit(jobDescriptionText);
    const resumeLower = resumeText.toLowerCase();


    // 1. Basic Keyword Matching (15%)
    let matchedCount = 0;
    jobWords.forEach(word => {
        if (resumeWords.includes(word)) {
            matchedCount++;
        }
    });
    const keywordMatchScore = (matchedCount / jobWords.length) * 100;

    // 2. Section Completeness (15%)
    const requiredSections = ['experience', 'education', 'skills'];
    const optionalSections = ['summary', 'certifications', 'projects', 'achievements'];

    let requiredSectionScore = 0;
    let optionalSectionScore = 0;

    requiredSections.forEach(section => {
        if (resumeLower.includes(section)) {
            requiredSectionScore += 33.33;
        }
    });

    optionalSections.forEach(section => {
        if (resumeLower.includes(section)) {
            optionalSectionScore += 12.5;
        }
    });

    const sectionScore = Math.min(requiredSectionScore + (optionalSectionScore * 0.5), 100);

    // 3. Skills Match (25%) - Using AI-extracted skills
    const skillMatchScore = matchedSkills && matchedSkills.length > 0
        ? (matchedSkills.length / (matchedSkills.length + (keywordGaps?.missing?.length || 0))) * 100
        : 0;

    // 4. Industry-Specific Technical Skills (15%)
    let technicalSkillScore = 0;
    let technicalSkillsFound = 0;

    if (industryRequirements && industryRequirements.technicalSkills.length > 0) {
        industryRequirements.technicalSkills.forEach(skill => {
            if (resumeLower.includes(skill.toLowerCase())) {
                technicalSkillsFound++;
            }
        });
        technicalSkillScore = (technicalSkillsFound / industryRequirements.technicalSkills.length) * 100;
    } else {
        technicalSkillScore = 50; // Neutral if no data
    }

    // 5. Industry-Specific Tools & Technologies (10%)
    let toolScore = 0;
    let toolsFound = 0;

    if (industryRequirements && industryRequirements.tools.length > 0) {
        industryRequirements.tools.forEach(tool => {
            if (resumeLower.includes(tool.toLowerCase())) {
                toolsFound++;
            }
        });
        toolScore = (toolsFound / industryRequirements.tools.length) * 100;
    } else {
        toolScore = 50;
    }

    // 6. Industry-Relevant Action Verbs (10%)
    let actionVerbScore = 0;
    let actionVerbsFound = 0;

    if (industryRequirements && industryRequirements.actionVerbs.length > 0) {
        industryRequirements.actionVerbs.forEach(verb => {
            if (resumeLower.includes(verb.toLowerCase())) {
                actionVerbsFound++;
            }
        });
        actionVerbScore = (actionVerbsFound / industryRequirements.actionVerbs.length) * 100;
    } else {
        // Fallback to generic action verbs
        const genericActionVerbs = [
            'achieved', 'improved', 'managed', 'created', 'designed',
            'built', 'implemented', 'developed', 'led', 'optimized'
        ];
        actionVerbsFound = genericActionVerbs.filter(verb => resumeLower.includes(verb)).length;
        actionVerbScore = Math.min((actionVerbsFound / 6) * 100, 100);
    }

    // 7. Quantifiable Achievements & Metrics (10%)
    const numberPattern = /\b\d+%|\b\d+\+|\b\d+[kKmM]\+?|\$\d+[kKmMbB]?|\b\d+x\b/g;
    const numbersFound = (resumeText.match(numberPattern) || []).length;

    // Check for industry-specific metric keywords
    let metricKeywordsFound = 0;
    if (industryRequirements && industryRequirements.metricKeywords.length > 0) {
        industryRequirements.metricKeywords.forEach(keyword => {
            if (resumeLower.includes(keyword.toLowerCase())) {
                metricKeywordsFound++;
            }
        });
    }

    const metricsScore = Math.min(
        ((numbersFound * 10) + (metricKeywordsFound * 20)) / 2,
        100
    );

    // 8. Certifications & Qualifications (5%)
    let certScore = 0;
    let certsFound = 0;

    if (industryRequirements && industryRequirements.certifications.length > 0) {
        industryRequirements.certifications.forEach(cert => {
            if (resumeLower.includes(cert.toLowerCase())) {
                certsFound++;
            }
        });
        certScore = (certsFound / industryRequirements.certifications.length) * 100;
    } else {
        // Check for generic qualification indicators
        const hasQualifications = resumeLower.includes('bachelor') ||
            resumeLower.includes('master') ||
            resumeLower.includes('certified');
        certScore = hasQualifications ? 75 : 25;
    }

    // 9. Industry Terminology (5%)
    let industryTermScore = 0;
    let termsFound = 0;

    if (industryRequirements && industryRequirements.industryTerms.length > 0) {
        industryRequirements.industryTerms.forEach(term => {
            if (resumeLower.includes(term.toLowerCase())) {
                termsFound++;
            }
        });
        industryTermScore = (termsFound / industryRequirements.industryTerms.length) * 100;
    } else {
        industryTermScore = 50;
    }

    // Calculate weighted final score
    const weights = {
        keyword: 0.15,
        section: 0.15,
        skills: 0.25,
        technical: 0.15,
        tools: 0.10,
        actionVerbs: 0.10,
        metrics: 0.10,
        certifications: 0.05,
        industryTerms: 0.05
    };

    const finalScore =
        (keywordMatchScore * weights.keyword) +
        (sectionScore * weights.section) +
        (skillMatchScore * weights.skills) +
        (technicalSkillScore * weights.technical) +
        (toolScore * weights.tools) +
        (actionVerbScore * weights.actionVerbs) +
        (metricsScore * weights.metrics) +
        (certScore * weights.certifications) +
        (industryTermScore * weights.industryTerms);

    return {
        score: Math.round(Math.min(Math.max(finalScore, 0), 100)),
        breakdown: {
            keywordMatch: Math.round(keywordMatchScore),
            sectionCompletion: Math.round(sectionScore),
            skillsMatch: Math.round(skillMatchScore),
            technicalSkills: Math.round(technicalSkillScore),
            toolsAndTech: Math.round(toolScore),
            actionVerbs: Math.round(actionVerbScore),
            quantifiableMetrics: Math.round(metricsScore),
            certifications: Math.round(certScore),
            industryTerminology: Math.round(industryTermScore)
        },
        details: {
            matchedKeywords: matchedCount,
            totalKeywords: jobWords.length,
            matchedSkills: matchedSkills?.length || 0,
            missingSkills: keywordGaps?.missing?.length || 0,
            technicalSkillsFound: technicalSkillsFound,
            toolsFound: toolsFound,
            actionVerbsFound: actionVerbsFound,
            metricsFound: numbersFound,
            certificationsFound: certsFound,
            industryTermsFound: termsFound
        },
        industryInsights: industryRequirements ? {
            requiredTechnicalSkills: industryRequirements.technicalSkills,
            requiredTools: industryRequirements.tools,
            recommendedActionVerbs: industryRequirements.actionVerbs,
            relevantCertifications: industryRequirements.certifications
        } : null
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
