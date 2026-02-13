import OpenAI from 'openai';

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Only initialize client if API key is available
let client = null;

if (OPENROUTER_API_KEY) {
    client = new OpenAI({
        baseURL: OPENROUTER_BASE_URL,
        apiKey: OPENROUTER_API_KEY,
        defaultHeaders: {
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
            'X-Title': 'Resume Analyzer',
        }
    });
}

/**
 * Call OpenRouter API for LLM tasks using OpenAI SDK
 */
export const callOpenRouter = async (systemPrompt, userMessage, model = 'openrouter/aurora-alpha', reasoning = false, prevMessages = []) => {
    if (!client) {
        throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your environment variables.');
    }

    try {
        // Compose messages array
        const messages = [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            ...prevMessages,
            { role: 'user', content: userMessage }
        ];

        const response = await client.chat.completions.create({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
            ...(reasoning ? { reasoning: { enabled: true } } : {})
        });

        // Return the full message object (may include reasoning_details)
        return response.choices[0].message;
    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error('OpenRouter API error:', errorMessage);
        throw new Error(`LLM API Error: ${errorMessage}`);
    }
};

/**
 * Extract resume data using LLM
 */
export const extractResumeData = async (resumeText) => {
    const systemPrompt = `You are an expert resume parser. Extract structured data from the resume text.
Return JSON with these keys: 
{
  "name": string,
  "email": string,
  "phone": string,
  "summary": string,
  "experience": [{title, company, duration, description}],
  "education": [{degree, school, year}],
  "skills": [string],
  "certifications": [string]
}`;

    const message = await callOpenRouter(systemPrompt, resumeText);
    const response = message.content;
    try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (error) {
        return { raw: resumeText, error: 'Failed to parse resume' };
    }
};

/**
 * Generate improvement suggestions
 */
export const generateImprovements = async (resumeText, context = '', reasoning = false, prevMessages = []) => {
    const systemPrompt = `
You are an expert resume writer and career coach.

Analyze the provided resume and suggest concise, actionable improvements focusing on:
- Strong action verbs
- Quantified impact metrics
- Clarity and brevity
- Professional tone

CRITICAL OUTPUT RULES:
- Output ONLY valid JSON.
- Do NOT include markdown or code blocks.
- Do NOT include explanations outside JSON.
- Do NOT include trailing commas.
- Ensure the JSON is complete and properly closed.
- If response length becomes too large, reduce the number of improvements but ALWAYS return valid JSON.

Return EXACTLY this structure:

{
  "improvements": [
    {
      "original": "string",
      "improved": "string",
      "reason": "string"
    }
  ]
}
  if there in between context or tokens are lost, prioritize returning valid JSON with fewer improvements rather than incomplete JSON.

If no improvements exist, return:
{
  "improvements": []
}
`;

    const userMessage = context
        ? `Resume:\n${resumeText}\n\nContext:\n${context}`
        : `Resume:\n${resumeText}`;

    const message = await callOpenRouter(systemPrompt, userMessage, 'openrouter/aurora-alpha', reasoning, prevMessages);
    const response = message.content;
    console.log('LLM response for improvements:', message.content);
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
        if (message.reasoning_details) {
            result.reasoning_details = message.reasoning_details;
        }
        return result;
    } catch (error) {
        console.error('Failed to parse improvements:', error);
        return { improvements: [] };
    }
};

/**
 * Generate JD-specific resume suggestions
 * Compare job description with resume and suggest targeted changes
 */
export const generateJDMatchSuggestions = async (resumeText, jobDescriptionText) => {
    const systemPrompt = `
You are an expert recruiter and resume optimization specialist.

Compare the provided resume against the job description and suggest specific, actionable changes to make the resume better match the job requirements. Focus on:
- Missing skills or experience the JD requires
- Gaps in qualifications or certifications
- Keywords and terminology from the JD that should appear in the resume
- Experience that should be highlighted or repositioned
- Achievements that align with JD requirements

CRITICAL OUTPUT RULES:
- Output ONLY valid JSON.
- Do NOT include markdown or code blocks.
- Do NOT include explanations outside JSON.
- Do NOT include trailing commas.
- Ensure the JSON is complete and properly closed.
- If response length becomes too large, reduce suggestions but ALWAYS return valid JSON.

Return EXACTLY this structure:

{
  "improvements": [
    {
      "original": "string",
      "improved": "string",
      "reason": "string",
    }
  ]
}

If no improvements exist, return:
{
  "improvements": []
}
`;

    const userMessage = `Job Description:
${jobDescriptionText}

---

Resume:
${resumeText}

---

Please analyze the resume against the job description and provide specific suggestions to improve alignment.`;

    const message = await callOpenRouter(systemPrompt, userMessage);
    const response = message.content;
    // console.log('LLM response for JD match suggestions:', message.content);
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
        // console.log('Parsed JD match suggestions:', message);
        if (message.reasoning_details) {
            result.reasoning_details = message.reasoning_details;
        }
        return result;
    } catch (error) {
        console.error('Failed to parse JD match suggestions:', error);
        return { suggestions: [] };
    }
};

/**
 * Extract industry-specific requirements for a job role
 * Returns required skills, action verbs, tools, and qualifications for the industry
 */
export const extractIndustryRequirements = async (jobRole, jobDescriptionText) => {
    const systemPrompt = `You are an expert recruiter with deep knowledge across all industries and job roles.

Given a job role and job description, extract the industry-specific requirements including:
- Technical skills and tools commonly required
- Soft skills and competencies
- Industry-standard action verbs that show relevant experience
- Certifications or qualifications
- Key performance indicators or metrics terminology

Return ONLY valid JSON. Do not include explanations or code blocks.`;

    const userPrompt = `Job Role: ${jobRole}

Job Description:
${jobDescriptionText}

---

Analyze this job role and description to extract industry-specific requirements. Return ONLY a JSON object with this exact structure:

{
  "technicalSkills": ["skill1", "skill2", "skill3"],
  "softSkills": ["skill1", "skill2", "skill3"],
  "tools": ["tool1", "tool2", "tool3"],
  "actionVerbs": ["verb1", "verb2", "verb3"],
  "certifications": ["cert1", "cert2"],
  "metricKeywords": ["keyword1", "keyword2"],
  "industryTerms": ["term1", "term2"]
}

Focus on skills and terms specific to the ${jobRole} role and industry. Return comprehensive lists.`;

    try {
        const message = await callOpenRouter(systemPrompt, userPrompt);
        const response = message.content;

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch ? jsonMatch[0] : response);

        return {
            technicalSkills: result.technicalSkills || [],
            softSkills: result.softSkills || [],
            tools: result.tools || [],
            actionVerbs: result.actionVerbs || [],
            certifications: result.certifications || [],
            metricKeywords: result.metricKeywords || [],
            industryTerms: result.industryTerms || []
        };
    } catch (error) {
        console.error('Failed to extract industry requirements:', error);
        // Return empty structure as fallback
        return {
            technicalSkills: [],
            softSkills: [],
            tools: [],
            actionVerbs: [],
            certifications: [],
            metricKeywords: [],
            industryTerms: []
        };
    }
};