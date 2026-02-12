/**
 * Impact word dictionary for resume analysis
 */
export const impactWordDictionary = {
    weak: [
        'worked', 'responsible for', 'helped', 'involved', 'did', 'made',
        'handled', 'participated', 'contributed', 'was in charge of',
        'assisted', 'involved in', 'part of', 'some experience'
    ],
    strong: [
        'led', 'implemented', 'designed', 'optimized', 'developed',
        'architected', 'spearheaded', 'orchestrated', 'pioneered',
        'accelerated', 'transformed', 'revolutionized', 'maximized',
        'streamlined', 'enhanced', 'expanded', 'scaled', 'automated',
        'collaborated', 'mentored', 'established', 'directed'
    ]
};

/**
 * Industry-standard skills by category
 */
export const industrySkills = {
    frontend: ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Next.js', 'Svelte'],
    backend: ['Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'C#', 'Kotlin'],
    databases: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'DynamoDB', 'Firebase'],
    devops: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'GCP', 'Terraform', 'Jenkins'],
    languages: ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust', 'Ruby', 'PHP'],
    tools: ['Git', 'Docker', 'Kubernetes', 'REST APIs', 'GraphQL', 'Linux'],
    soft: ['Communication', 'Leadership', 'Problem-solving', 'Team collaboration', 'Project management']
};

/**
 * Analyze resume for repeated words
 */
export const analyzeRepeatedWords = async (text, threshold = 4) => {
    const words = text.toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 4); // Filter short words

    const wordFreq = {};
    words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const repeatedEntries = Object.entries(wordFreq)
        .filter(([_, count]) => count >= threshold)
        .sort((a, b) => b[1] - a[1]);

    // Await all suggestions
    const repeated = await Promise.all(
        repeatedEntries.map(async ([word, count]) => ({
            word,
            frequency: count,
            suggestions: await generateSuggestions(word)
        }))
    );

    return repeated;
};

/**
 * Generate word replacement suggestions using AI
 */
const generateSuggestions = async (word) => {
    // Fallback static suggestions
    const staticSuggestions = {
        'worked': ['led', 'implemented', 'developed', 'architected', 'optimized'],
        'responsible': ['led', 'managed', 'directed', 'oversaw', 'spearheaded'],
        'helped': ['enabled', 'supported', 'facilitated', 'contributed', 'enhanced'],
        'involved': ['led', 'coordinated', 'managed', 'orchestrated', 'directed'],
        'created': ['architected', 'designed', 'developed', 'engineered', 'built'],
        'team': ['team of experts', 'cross-functional team', 'high-performing team'],
        'company': ['organization', 'enterprise', 'business', 'firm'],
        'system': ['platform', 'architecture', 'infrastructure', 'solution'],
        'project': ['initiative', 'program', 'engagement', 'deliverable']
    };

    // If no API key, use static suggestions
    if (!process.env.OPENROUTER_API_KEY) {
        return staticSuggestions[word.toLowerCase()] || ['Consider using a more specific verb'];
    }

    try {
        const { callOpenRouter } = await import('./aiService.js');
        const systemPrompt = `You are an expert resume writer. For the weak word "${word}", suggest 5 strong action verbs as replacements. Return ONLY a JSON array of strings, nothing else.`;
        const message = await callOpenRouter(systemPrompt, `Suggest strong alternatives for the word "${word}"`);
        const response = message.content;

        // Parse JSON array from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const suggestions = JSON.parse(jsonMatch[0]);
            return Array.isArray(suggestions) ? suggestions : staticSuggestions[word.toLowerCase()] || ['Consider using a more specific verb'];
        }
    } catch (error) {
        console.log('AI suggestion generation failed, using static fallback:', error.message);
    }

    // Fallback to static suggestions
    return staticSuggestions[word.toLowerCase()] || ['Consider using a more specific verb'];
};

/**
 * Analyze impact of action verbs in resume
 */
export const analyzeImpactWords = async (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    const analysis = {
        weak: [],
        strong: [],
    };

    // Collect all weak word instances
    const weakWordInstances = [];
    lines.forEach(line => {
        impactWordDictionary.weak.forEach(weakWord => {
            if (line.toLowerCase().includes(weakWord)) {
                const count = (line.toLowerCase().match(new RegExp(weakWord, 'g')) || []).length;
                weakWordInstances.push({ weakWord, line, count });
            }
        });
    });

    // Get AI suggestions for each weak word with resume context
    for (const instance of weakWordInstances) {
        let suggestion = impactWordDictionary.strong[0]; // Default fallback

        if (process.env.OPENROUTER_API_KEY) {
            try {
                const { callOpenRouter } = await import('./aiService.js');
                const systemPrompt = `You are an expert resume writer. Given a weak word found in a resume line, suggest a strong action verb replacement based on the context. Return ONLY a single strong action verb, nothing else.`;
                const userMessage = `Resume line: "${instance.line}"\n\nWeak word to replace: "${instance.weakWord}"\n\nSuggest a stronger action verb.`;
                const message = await callOpenRouter(systemPrompt, userMessage);
                const response = message.content?.trim();

                if (response && response.length > 0 && response.length < 50) {
                    suggestion = response;
                }
            } catch (error) {
                console.log('AI suggestion for weak word failed, using static fallback:', error.message);
            }
        }

        analysis.weak.push({
            word: instance.weakWord,
            suggestion,
            count: instance.count,
            line: instance.line,
        });
    }

    // Analyze strong words
    lines.forEach(line => {
        impactWordDictionary.strong.forEach(strongWord => {
            if (line.toLowerCase().includes(strongWord)) {
                analysis.strong.push({
                    line,
                    strongWord
                });
            }
        });
    });

    return analysis;
};

/**
 * Calculate brevity score
 */
export const calculateBrevityScore = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    const bulletPoints = lines.filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'));

    let score = 100;
    const improvements = [];

    bulletPoints.forEach(bullet => {
        const words = bullet.split(/\s+/).length;
        if (words > 25) {
            score -= 5;
            improvements.push({
                original: bullet.trim(),
                issue: 'Too long',
                wordCount: words,
                suggestion: 'Condense to 15-20 words max'
            });
        }
        if (words < 5) {
            score -= 3;
            improvements.push({
                original: bullet.trim(),
                issue: 'Too vague',
                wordCount: words,
                suggestion: 'Add specific details and metrics'
            });
        }
    });

    return {
        score: Math.max(0, score),
        totalBullets: bulletPoints.length,
        improvements
    };
};

/**
 * Extract skills from resume
 */
export const extractSkills = (text) => {
    const detected = [];
    const missing = [];

    for (const [category, skills] of Object.entries(industrySkills)) {
        skills.forEach(skill => {
            if (text.toLowerCase().includes(skill.toLowerCase())) {
                detected.push(skill);
            }
        });
    }

    // Find missing common skills
    for (const category of ['frontend', 'backend', 'devops']) {
        industrySkills[category].forEach(skill => {
            if (!detected.includes(skill) && Math.random() < 0.3) {
                missing.push(skill);
            }
        });
    }

    return {
        detected: [...new Set(detected)],
        missing: [...new Set(missing)],
        coverage: detected.length
    };
};

/**
 * Calculate overall resume strength score
 */
export const calculateOverallScore = (analysis) => {
    let score = 100;

    // Deduct for repeated words
    if (analysis.repeated && analysis.repeated.length > 5) {
        score -= 10;
    } else if (analysis.repeated && analysis.repeated.length > 0) {
        score -= 5;
    }

    // Deduct for weak verbs
    if (analysis.impact && analysis.impact.weak && analysis.impact.weak.length > 5) {
        score -= 15;
    } else if (analysis.impact && analysis.impact.weak && analysis.impact.weak.length > 0) {
        score -= 5;
    }

    // Deduct for brevity issues
    if (analysis.brevity && analysis.brevity.score < 70) {
        score -= 10;
    } else if (analysis.brevity && analysis.brevity.score < 85) {
        score -= 5;
    }

    // Deduct for missing skills
    if (analysis.skills && analysis.skills.missing && analysis.skills.missing.length > 3) {
        score -= 10;
    }

    return Math.max(0, Math.min(100, score));
};
