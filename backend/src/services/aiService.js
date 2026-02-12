import OpenAI from 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

const client = new OpenAI({
    baseURL: OPENROUTER_BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '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',
});

/**
 * Call OpenRouter API for LLM tasks using OpenAI SDK
 */
export const callOpenRouter = async (systemPrompt, userMessage, model = 'openrouter/aurora-alpha', reasoning = false, prevMessages = []) => {
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
        console.error('OpenRouter API error:', error.response?.data || error.message || error);
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
} `;

    const message = await callOpenRouter(systemPrompt, resumeText);
    const response = message.content;
    try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (error) {
        // console.error('Failed to parse LLM response:', error);
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
        // Optionally, preserve reasoning_details if present
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
