import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ==================== USER FUNCTIONS ====================

export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        profileImage: args.profileImage,
        updatedAt: Date.now(),
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      profileImage: args.profileImage,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create default preferences
    await ctx.db.insert("userPreferences", {
      userId,
      theme: "light",
      notifications: true,
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// ==================== RESUME FUNCTIONS ====================

export const uploadResume = mutation({
  args: {
    userId: v.id("users"),
    fileName: v.string(),
    originalFileName: v.string(),
    fileContent: v.string(),
    fileSize: v.number(),
    metadata: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      skills: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("resumes", {
      userId: args.userId,
      fileName: args.fileName,
      originalFileName: args.originalFileName,
      fileContent: args.fileContent,
      fileSize: args.fileSize,
      metadata: args.metadata,
      uploadedAt: Date.now(),
    });
  },
});

export const getUserResumes = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getResumeById = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.resumeId);
  },
});

export const deleteResume = mutation({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.resumeId);
    return { success: true };
  },
});

// ==================== ANALYSIS FUNCTIONS ====================

export const saveAnalysisResult = mutation({
  args: {
    userId: v.id("users"),
    resumeId: v.id("resumes"),
    analysisType: v.union(v.literal("quality"), v.literal("jd-match")),
    jobDescription: v.optional(v.string()),
    results: v.object({
      repeated: v.optional(v.any()),
      impact: v.optional(v.any()),
      brevity: v.optional(v.any()),
      skills: v.optional(v.any()),
      overallScore: v.optional(v.number()),
      atsScore: v.optional(v.any()),
      matchedSkills: v.optional(v.array(v.string())),
      keywordGaps: v.optional(v.any()),
      targetedSuggestions: v.optional(v.array(v.any())),
    }),
    aiEnhanced: v.boolean(),
    aiSuggestions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const analysisId = await ctx.db.insert("analysisResults", {
      userId: args.userId,
      resumeId: args.resumeId,
      analysisType: args.analysisType,
      jobDescription: args.jobDescription,
      results: args.results,
      analyzedAt: Date.now(),
      aiEnhanced: args.aiEnhanced,
      aiSuggestions: args.aiSuggestions,
    });

    // Log the action
    await ctx.db.insert("auditLogs", {
      userId: args.userId,
      action: "analysis_run",
      details: {
        resumeId: args.resumeId,
        analysisId,
        description: `${args.analysisType} analysis completed`,
      },
      createdAt: Date.now(),
    });

    return analysisId;
  },
});

export const getAnalysisHistory = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analysisResults")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getAnalysisById = query({
  args: { analysisId: v.id("analysisResults") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.analysisId);
  },
});

export const deleteAnalysis = mutation({
  args: { analysisId: v.id("analysisResults") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.analysisId);
    return { success: true };
  },
});

// ==================== PREFERENCES FUNCTIONS ====================

export const updateUserPreferences = mutation({
  args: {
    userId: v.id("users"),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
    notifications: v.optional(v.boolean()),
    defaultModel: v.optional(v.string()),
    customSkills: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existingPrefs = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const updates: any = { updatedAt: Date.now() };
    if (args.theme !== undefined) updates.theme = args.theme;
    if (args.notifications !== undefined)
      updates.notifications = args.notifications;
    if (args.defaultModel !== undefined)
      updates.defaultModel = args.defaultModel;
    if (args.customSkills !== undefined)
      updates.customSkills = args.customSkills;

    if (existingPrefs) {
      await ctx.db.patch(existingPrefs._id, updates);
      return existingPrefs._id;
    }

    return await ctx.db.insert("userPreferences", {
      userId: args.userId,
      theme: args.theme || "light",
      notifications: args.notifications !== false,
      defaultModel: args.defaultModel,
      customSkills: args.customSkills,
      updatedAt: Date.now(),
    });
  },
});

export const getUserPreferences = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const analyses = await ctx.db
      .query("analysisResults")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const qualityAnalyses = analyses.filter(
      (a) => a.analysisType === "quality"
    );
    const matchAnalyses = analyses.filter((a) => a.analysisType === "jd-match");

    const avgScore =
      qualityAnalyses.length > 0
        ? qualityAnalyses.reduce(
            (sum, a) => sum + (a.results.overallScore || 0),
            0
          ) / qualityAnalyses.length
        : 0;

    const avgAtsScore =
      matchAnalyses.length > 0
        ? matchAnalyses.reduce(
            (sum, a) => sum + (a.results.atsScore?.score || 0),
            0
          ) / matchAnalyses.length
        : 0;

    return {
      totalResumes: resumes.length,
      totalAnalyses: analyses.length,
      qualityAnalyses: qualityAnalyses.length,
      matchAnalyses: matchAnalyses.length,
      averageResumeScore: Math.round(avgScore),
      averageAtsScore: Math.round(avgAtsScore),
      lastAnalysis: analyses[0]?.analyzedAt || null,
    };
  },
});
