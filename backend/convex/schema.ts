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
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      skills: v.optional(v.array(v.string())),
    }),
  })
    .index("by_userId", ["userId"])
    .index("by_uploadedAt", ["userId", "uploadedAt"]),

  // Analysis Results table
  analysisResults: defineTable({
    userId: v.id("users"),
    resumeId: v.id("resumes"),
    analysisType: v.union(v.literal("quality"), v.literal("jd-match")),
    jobDescription: v.optional(v.string()), // For JD match analysis
    results: v.object({
      // Quality Analysis
      repeated: v.optional(
        v.array(
          v.object({
            word: v.string(),
            frequency: v.number(),
            suggestions: v.array(v.string()),
          })
        )
      ),
      impact: v.optional(
        v.object({
          weak: v.array(
            v.object({
              word: v.string(),
              suggestion: v.string(),
              count: v.number(),
            })
          ),
          strong: v.array(v.string()),
        })
      ),
      brevity: v.optional(
        v.object({
          score: v.number(),
          totalBullets: v.number(),
          improvements: v.array(v.string()),
        })
      ),
      skills: v.optional(
        v.object({
          detected: v.array(v.string()),
          missing: v.array(v.string()),
          coverage: v.number(),
        })
      ),
      overallScore: v.optional(v.number()),
      // JD Match Analysis
      atsScore: v.optional(
        v.object({
          score: v.number(),
          keywordMatch: v.number(),
          sectionCompletion: v.number(),
          matchedKeywords: v.array(v.string()),
        })
      ),
      matchedSkills: v.optional(v.array(v.string())),
      keywordGaps: v.optional(
        v.object({
          missing: v.array(v.string()),
          present: v.array(v.string()),
        })
      ),
      targetedSuggestions: v.optional(
        v.array(
          v.object({
            type: v.string(), // 'skill', 'verb', 'metric'
            suggestion: v.string(),
          })
        )
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
