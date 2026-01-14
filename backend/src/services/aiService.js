import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

/**
 * Call OpenRouter API for LLM tasks
 */
export const callOpenRouter = async (systemPrompt, userMessage, model = 'mistral/mistral-7b-instruct') => {
    try {
        const response = await axios.post(
            `${OPENROUTER_BASE_URL}/chat/completions`,
            {
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 2000
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'https://resumeanalyzer.local',
                    'X-Title': 'Resume Analyzer'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenRouter API error:', error.response?.data || error.message);
        throw new Error(`LLM API Error: ${error.message}`);
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

    const response = await callOpenRouter(systemPrompt, resumeText);

    try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (error) {
        console.error('Failed to parse LLM response:', error);
        return { raw: resumeText, error: 'Failed to parse resume' };
    }
};

/**
 * Generate improvement suggestions
 */
export const generateImprovements = async (resumeText, context = '') => {
    const systemPrompt = `You are an expert resume writer and career coach. Analyze the resume and provide specific, actionable improvements.
Focus on: action verbs, impact metrics, clarity, and professional language.
Return improvements as JSON: { "improvements": [{ "original": string, "improved": string, "reason": string }] }`;

    const userMessage = context
        ? `Resume:\n${resumeText}\n\nContext:\n${context}`
        : `Resume:\n${resumeText}`;

    const response = await callOpenRouter(systemPrompt, userMessage);

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (error) {
        console.error('Failed to parse improvements:', error);
        return { improvements: [] };
    }
};
