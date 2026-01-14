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
export const analyzeRepeatedWords = (text, threshold = 4) => {
    const words = text.toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 4); // Filter short words

    const wordFreq = {};
    words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const repeated = Object.entries(wordFreq)
        .filter(([_, count]) => count >= threshold)
        .sort((a, b) => b[1] - a[1])
        .map(([word, count]) => ({
            word,
            frequency: count,
            suggestions: generateSuggestions(word)
        }));

    return repeated;
};

/**
 * Generate word replacement suggestions
 */
const generateSuggestions = (word) => {
    const suggestions = {
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

    return suggestions[word.toLowerCase()] || ['Consider using a more specific verb'];
};

/**
 * Analyze impact of action verbs in resume
 */
export const analyzeImpactWords = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    const analysis = {
        weak: [],
        strong: [],
        suggestions: []
    };

    lines.forEach(line => {
        impactWordDictionary.weak.forEach(weakWord => {
            if (line.toLowerCase().includes(weakWord)) {
                analysis.weak.push({
                    line,
                    weakWord,
                    strongAlternatives: impactWordDictionary.strong.slice(0, 5)
                });
            }
        });

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
