import { parseFile, normalizeResumeText } from '../utils/fileParser.js';
import {
    analyzeRepeatedWords,
    analyzeImpactWords,
    calculateBrevityScore,
    extractSkills,
    calculateOverallScore
} from '../services/analysisService.js';
import {
    calculateATSScore,
    extractMatchedSkills,
    findKeywordGaps,
    generateTargetedSuggestions
} from '../utils/atsScoring.js';
import { extractResumeData, generateImprovements } from '../services/aiService.js';
import { saveAnalysis, saveResume, getAnalysisHistory as fetchAnalysisHistory, getAnalysisById as fetchAnalysisById, deleteAnalysis as deleteFromConvex } from '../services/convexService.js';
import fs from 'fs/promises';

/**
 * Analyze resume alone
 */
const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!req.user || !req.user.clerkId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Parse file
        const parsed = await parseFile(req.file.path, req.file.mimetype);
        const resumeText = normalizeResumeText(parsed.text);

        // Save resume to Convex
        let resumeId;
        try {
            const metadata = await extractResumeData(resumeText).catch(() => ({}));
            resumeId = await saveResume(
                req.user.clerkId,
                req.file.filename,
                req.file.originalname,
                resumeText,
                req.file.size,
                metadata || {},
                parsed.fileContent
            );
        } catch (error) {
            console.log('Warning: Could not save to Convex:', error.message);
        }

        // Perform analysis
        const analysis = {
            repeated: await analyzeRepeatedWords(resumeText),
            impact: await analyzeImpactWords(resumeText),
            brevity: calculateBrevityScore(resumeText),
            skills: extractSkills(resumeText)
        };

        // Calculate overall score
        analysis.overallScore = calculateOverallScore(analysis);

        // Optionally call AI for enhanced insights (if API key exists)
        let aiInsights = null;
        if (process.env.OPENROUTER_API_KEY) {
            try {
                aiInsights = await generateImprovements(resumeText);
                console.log("AI insights for resume analysis: from an", aiInsights);
            } catch (error) {
                console.log('AI insights skipped:', error.message);
            }
        }

        // Save analysis to Convex
        try {
            if (resumeId) {
                console.log("Ai suggestions for resume analysis:", aiInsights);
                await saveAnalysis(
                    req.user.clerkId,
                    resumeId,
                    'quality',
                    analysis,
                    null,
                    !!aiInsights,
                    aiInsights ? JSON.stringify(aiInsights) : ''
                );
            }
        } catch (error) {
            console.log('Warning: Could not save analysis to Convex:', error.message);
        }

        // Clean up uploaded file
        await fs.unlink(req.file.path).catch(() => { });

        res.json({
            success: true,
            analysis: {
                ...analysis,
                aiInsights
            }
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: error.message
        });
    }
};

/**
 * Analyze resume against job description
 */
const analyzeWithJobDescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        if (!req.body.jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }

        if (!req.user || !req.user.clerkId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Parse resume file
        const parsed = await parseFile(req.file.path, req.file.mimetype);
        const resumeText = normalizeResumeText(parsed.text);
        const jobDescription = req.body.jobDescription;

        // Save resume to Convex
        let resumeId;
        try {
            const metadata = await extractResumeData(resumeText).catch(() => ({}));
            resumeId = await saveResume(
                req.user.clerkId,
                req.file.filename,
                req.file.originalname,
                resumeText,
                req.file.size,
                metadata || {}
            );
        } catch (error) {
            console.log('Warning: Could not save to Convex:', error.message);
        }

        // Perform ATS analysis
        const atsScore = calculateATSScore(resumeText, jobDescription);
        const matchedSkills = extractMatchedSkills(resumeText, jobDescription);
        const keywordGaps = findKeywordGaps(resumeText, jobDescription);
        const targetedSuggestions = generateTargetedSuggestions(resumeText, jobDescription);

        // Also include basic resume analysis
        const basicAnalysis = {
            repeated: await analyzeRepeatedWords(resumeText),
            impact: await analyzeImpactWords(resumeText),
            brevity: calculateBrevityScore(resumeText),
            skills: extractSkills(resumeText)
        };

        // Optionally call AI for enhanced matching (if API key exists)
        let aiRecommendations = null;
        if (process.env.OPENROUTER_API_KEY) {
            try {
                const context = `Job Description:\n${jobDescription}`;
                aiRecommendations = await generateImprovements(resumeText, context);
            } catch (error) {
                console.log('AI recommendations skipped:', error.message);
            }
        }

        // Save analysis to Convex
        try {
            if (resumeId) {
                const analysisResults = {
                    atsScore,
                    matchedSkills,
                    keywordGaps,
                    targetedSuggestions,
                    ...basicAnalysis
                };
                await saveAnalysis(
                    req.user.clerkId,
                    resumeId,
                    'jd-match',
                    analysisResults,
                    jobDescription,
                    !!aiRecommendations,
                    aiRecommendations
                );
            }
        } catch (error) {
            console.log('Warning: Could not save analysis to Convex:', error.message);
        }

        // Clean up uploaded file
        await fs.unlink(req.file.path).catch(() => { });

        res.json({
            success: true,
            analysis: {
                atsScore,
                matchedSkills,
                keywordGaps,
                targetedSuggestions,
                basicAnalysis,
                aiRecommendations
            }
        });
    } catch (error) {
        console.error('JD matching error:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: error.message
        });
    }
};

/**
 * Get user's analysis history
 */
const getAnalysisHistory = async (req, res) => {
    try {
        if (!req.user || !req.user.clerkId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const history = await fetchAnalysisHistory(req.user.clerkId);

        res.json({
            success: true,
            analyses: history
        });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({
            error: 'Failed to fetch history',
            message: error.message
        });
    }
};

/**
 * Get specific analysis
 */
const getAnalysis = async (req, res) => {
    try {
        if (!req.user || !req.user.clerkId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { analysisId } = req.params;
        const analysis = await fetchAnalysisById(analysisId);

        if (!analysis) {
            return res.status(404).json({ error: 'Analysis not found' });
        }

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('Get analysis error:', error);
        res.status(500).json({
            error: 'Failed to fetch analysis',
            message: error.message
        });
    }
};

/**
 * Delete analysis
 */
const deleteAnalysis = async (req, res) => {
    try {
        if (!req.user || !req.user.clerkId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { analysisId } = req.params;
        await deleteFromConvex(analysisId);

        res.json({
            success: true,
            message: 'Analysis deleted'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            error: 'Failed to delete analysis',
            message: error.message
        });
    }
};

export {
    analyzeResume,
    analyzeWithJobDescription,
    getAnalysisHistory,
    getAnalysis,
    deleteAnalysis
};

