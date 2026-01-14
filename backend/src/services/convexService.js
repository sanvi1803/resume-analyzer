/**
 * Convex Database Service
 * NOTE: This is a wrapper for Convex API functions
 * Makes calls to deployed Convex functions
 */

import { ConvexClient } from "convex/browser";
import dotenv from "dotenv";

dotenv.config();

// Initialize Convex client
const convex = new ConvexClient(process.env.CONVEX_URL);

if (!process.env.CONVEX_URL) {
    console.warn("⚠️  CONVEX_URL not set. Convex operations will fail. Please set CONVEX_URL in .env");
}

/**
 * Get or create user in Convex
 * Called from: POST /api/auth/sync
 */
export const getOrCreateUser = async (clerkId, email, name, profileImage) => {
    try {
        const result = await convex.mutation("functions:createOrUpdateUser", {
            clerkId,
            email,
            name,
            profileImage: profileImage || null,
        });

        console.log("User synced to Convex:", { clerkId, email });
        return result;
    } catch (error) {
        console.error("Error creating/updating user:", error);
        throw error;
    }
};

/**
 * Save resume to Convex
 * Called from: POST /api/resume/analyze
 */
export const saveResume = async (userId, fileName, originalFileName, fileContent, fileSize, metadata) => {
    try {
        const result = await convex.mutation("functions:uploadResume", {
            userId,
            fileName,
            originalFileName,
            fileSize,
            metadata: metadata || {},
        });

        console.log("Resume saved to Convex:", { userId, fileName, fileSize });
        return result;
    } catch (error) {
        console.error("Error saving resume:", error);
        throw error;
    }
};

/**
 * Save analysis result to Convex
 * Called from: POST /api/resume/analyze or /api/resume/analyze-with-jd
 */
export const saveAnalysis = async (
    userId,
    resumeId,
    analysisType,
    results,
    jobDescription = null,
    aiEnhanced = false,
    aiSuggestions = null
) => {
    try {
        const result = await convex.mutation("functions:saveAnalysisResult", {
            userId,
            resumeId,
            analysisType,
            results,
            jobDescription,
            aiEnhanced,
            aiSuggestions,
        });

        console.log("Analysis saved to Convex:", { userId, resumeId, analysisType });
        return result;
    } catch (error) {
        console.error("Error saving analysis:", error);
        throw error;
    }
};

/**
 * Get user's analysis history
 * Called from: GET /api/resume/history
 */
export const getAnalysisHistory = async (userId) => {
    try {
        const result = await convex.query("functions:getAnalysisHistory", { userId });

        console.log("Fetched analysis history for:", userId);
        return result;
    } catch (error) {
        console.error("Error fetching analysis history:", error);
        throw error;
    }
};

/**
 * Get user's resumes
 * Called from: Dashboard component
 */
export const getUserResumes = async (userId) => {
    try {
        const result = await convex.query("functions:getUserResumes", { userId });

        console.log("Fetched resumes for:", userId);
        return result;
    } catch (error) {
        console.error("Error fetching resumes:", error);
        throw error;
    }
};

/**
 * Log user action to audit logs
 * Called from: Controllers after operations
 */
export const logAction = async (userId, action, details) => {
    try {
        await convex.mutation("functions:logAction", {
            userId,
            action,
            details,
        });

        console.log("Action logged to Convex:", { userId, action });
    } catch (error) {
        console.error("Error logging action:", error);
        // Don't throw - logging failures shouldn't break the app
    }
};

/**
 * Get specific analysis by ID
 * Called from: GET /api/resume/analysis/:id
 */
export const getAnalysisById = async (analysisId) => {
    try {
        const result = await convex.query("functions:getAnalysisById", { analysisId });

        console.log("Fetched analysis:", analysisId);
        return result;
    } catch (error) {
        console.error("Error fetching analysis:", error);
        throw error;
    }
};

/**
 * Delete analysis from Convex
 * Called from: DELETE /api/resume/analysis/:id
 */
export const deleteAnalysis = async (analysisId) => {
    try {
        await convex.mutation("functions:deleteAnalysis", { analysisId });

        console.log("Deleted analysis from Convex:", analysisId);
        return true;
    } catch (error) {
        console.error("Error deleting analysis:", error);
        throw error;
    }
};

export default {
    getOrCreateUser,
    saveResume,
    saveAnalysis,
    getAnalysisHistory,
    getUserResumes,
    getAnalysisById,
    deleteAnalysis,
    logAction
};
