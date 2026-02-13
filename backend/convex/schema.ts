import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    clerkId: v.string(), // Unique Clerk user ID
    email: v.string(),
    name: v.string(),
    profileImage: v.optional(v.string()),
    createdAt: v.number(), // Timestamp
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // Resumes table
  resumes: defineTable({
    userId: v.id("users"),
    fileName: v.string(),
    originalFileName: v.string(),
    fileContent: v.string(), // Extracted text content
    uploadedAt: v.number(),
    fileSize: v.number(),
    metadata: v.object({
      error: v.optional(v.string()),
      raw: v.optional(v.string()),
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      skills: v.optional(v.array(v.string())),
      certifications: v.optional(v.array(v.string())),
      education: v.optional(
        v.array(
          v.object({
            degree: v.string(),
            school: v.string(),
            year: v.string(),
            details: v.optional(v.string()),
          }),
        ),
      ),
      experience: v.optional(
        v.array(
          v.object({
            company: v.string(),
            title: v.string(),
            duration: v.string(),
            description: v.string(),
            history: v.optional(v.array(v.string())),
          }),
        ),
      ),
      summary: v.optional(v.string()),
    }),
  })
    .index("by_userId", ["userId"])
    .index("by_uploadedAt", ["userId", "uploadedAt"]),

  // Analysis Results table
  analysisResults: defineTable({
    userId: v.id("users"),
    resumeId: v.id("resumes"),
    analysisType: v.union(v.literal("quality"), v.literal("jd-match")),
    jobDescription: v.optional(v.any()), // For JD match analysis
    results: v.object({
      // Quality Analysis
      repeated: v.optional(
        v.array(
          v.object({
            word: v.string(),
            frequency: v.number(),
            suggestions: v.array(v.string()),
          }),
        ),
      ),
      impact: v.optional(
        v.object({
          weak: v.array(
            v.object({
              word: v.string(),
              suggestion: v.string(),
              count: v.number(),
              line: v.string(),
            }),
          ),
          strong: v.array(
            v.object({
              line: v.string(),
              strongWord: v.string(),
            }),
          ),
        }),
      ),
      brevity: v.optional(
        v.object({
          score: v.number(),
          totalBullets: v.number(),
          improvements: v.array(v.string()),
        }),
      ),
      skills: v.optional(
        v.object({
          detected: v.array(v.string()),
          missing: v.array(v.string()),
          coverage: v.number(),
        }),
      ),
      overallScore: v.optional(v.number()),
      // JD Match Analysis
      atsScore: v.optional(
        v.object({
          score: v.number(),
          keywordMatch: v.number(),
          sectionCompletion: v.number(),
          matchedKeywords: v.string(),
          totalKeywords: v.number(),
        }),
      ),
      matchedSkills: v.optional(v.array(v.string())),
      keywordGaps: v.optional(
        v.object({
          missing: v.array(v.string()),
          present: v.array(v.string()),
        }),
      ),
      targetedSuggestions: v.optional(
        v.array(
          v.object({
            type: v.string(), // 'skill', 'verb', 'metric'
            suggestion: v.string(),
            keyword: v.optional(v.any()),
          }),
        ),
      ),
    }),
    analyzedAt: v.number(),
    aiEnhanced: v.boolean(), // Whether AI suggestions were generated
    aiSuggestions: v.optional(v.string()), // AI-generated improvements
  })
    .index("by_userId", ["userId"])
    .index("by_resumeId", ["resumeId"])
    .index("by_analyzedAt", ["userId", "analyzedAt"]),

  // User Preferences table
  userPreferences: defineTable({
    userId: v.id("users"),
    theme: v.union(v.literal("light"), v.literal("dark")),
    notifications: v.boolean(),
    defaultModel: v.optional(v.string()),
    customSkills: v.optional(v.array(v.string())),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Audit logs for tracking changes
  auditLogs: defineTable({
    userId: v.id("users"),
    action: v.string(), // 'resume_uploaded', 'analysis_run', 'export', etc.
    details: v.object({
      resumeId: v.optional(v.id("resumes")),
      analysisId: v.optional(v.id("analysisResults")),
      description: v.optional(v.string()),
    }),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_action", ["action"]),
});
