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
        matchedKeywords: matchedCount,
        totalKeywords: jobWords.length
    };
};

/**
 * Extract matched skills between resume and JD
 */
export const extractMatchedSkills = (resumeText, jobDescriptionText) => {
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
        missingKeywords: gaps.slice(0, 10),
        presentKeywords: jobKeywords.filter(kw => resumeKeywords.includes(kw))
    };
};

/**
 * Generate targeted resume suggestions
 */
export const generateTargetedSuggestions = (resumeText, jobDescriptionText) => {
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
            !resumeText.toLowerCase().includes('led')) {
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
