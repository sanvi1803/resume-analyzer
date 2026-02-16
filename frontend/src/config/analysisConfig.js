/**
 * Analysis Details Page Configuration
 *
 * Section Types:
 * - badgeSection: Simple badge list with title
 * - badgeGroup: Multiple badge sub-sections under one title (with optional stats header)
 * - listItems: Items with word/suggestion/frequency metadata
 * - borderedList: Items with left border accent
 * - statsBox: Stats display with optional improvements list
 * - suggestionList: Suggestion cards
 * - objectBadges: Iterate object keys, render arrays as badge groups
 *
 * To add a new section:
 * 1. Add config object with type and required properties
 * 2. Set dataPath to point to data in results (e.g., "skills.detected")
 */

export const ANALYSIS_SECTIONS_CONFIG = [
    // Skills Analysis - Badge Group with stats header
    {
        type: "badgeGroup",
        title: "Skills Analysis",
        dataPath: "skills",
        stats: [{ label: "Coverage", dataPath: "skills.coverage", suffix: "%" }],
        sections: [
            {
                title: "Detected Skills",
                dataPath: "skills.detected",
                variant: "green",
                rounded: true,
                className: "mb-4",
            },
            {
                title: "Missing Skills",
                dataPath: "skills.missing",
                variant: "red",
                rounded: true,
            },
        ],
    },

    // Matched Skills - Simple badge section
    {
        type: "badgeSection",
        title: "Matched Skills",
        dataPath: "matchedSkills",
        variant: "purple",
        rounded: true,
        headingSize: "lg",
        className: "mb-8",
    },

    // Keyword Analysis - Badge Group with bordered list
    {
        type: "badgeGroup",
        title: "Keyword Analysis",
        dataPath: "keywordGaps",
        sections: [
            {
                title: "Present Keywords",
                dataPath: "keywordGaps.present",
                variant: "green",
                rounded: true,
                showCount: false,
                className: "mb-4",
            },
        ],
    },

    // Missing Keywords - Bordered List (rendered separately due to special format)
    {
        type: "borderedList",
        title: "Missing Keywords",
        dataPath: "keywordGaps.missing",
        labelKey: "keyword",
        suggestionKey: "suggestion",
        borderColor: "border-orange-400",
        className: "mb-8",
    },

    // Impact Words Analysis - Badge Group
    {
        type: "badgeGroup",
        title: "Impact Words Analysis",
        dataPath: "impact",
        sections: [
            {
                title: "Strong Words",
                dataPath: "impact.strong",
                variant: "green",
                getLabel: (item) =>
                    typeof item === "string" ? item : item.strongWord || item.word,
                className: "mb-4",
            },
            {
                title: "Weak Words",
                dataPath: "impact.weak",
                variant: "amber",
                getLabel: (item) => (typeof item === "string" ? item : item.word),
            },
        ],
    },

    // Repeated Words - List Items with metadata
    {
        type: "listItems",
        title: "Repeated Words",
        dataPath: "repeated",
        labelKey: "word",
        suggestionKey: "suggestion",
        metaKey: "frequency",
        metaColor: "text-red-600",
        metaFormat: (freq) => `${freq} times`,
        itemStyle: "bg-gray-50 border border-gray-200 rounded-lg p-3",
    },

    // Brevity Analysis - Stats Box
    {
        type: "statsBox",
        title: "Brevity Analysis",
        dataPath: "brevity",
        boxStyle: "bg-blue-50 border border-blue-200",
        stats: [
            {
                label: "Score",
                dataPath: "brevity.score",
                suffix: "/100",
                color: "text-blue-600",
            },
            { label: "Total Bullets", dataPath: "brevity.totalBullets" },
        ],
        listPath: "brevity.improvements",
        listTitle: "Improvements",
    },

    // Targeted Suggestions - Suggestion Cards
    {
        type: "suggestionList",
        title: "Targeted Suggestions",
        dataPath: "targetedSuggestions",
        suggestionKey: "suggestion",
        labelKey: "word",
        labelDisplay: "Word",
    },

    // Industry Insights - Object Badges
    {
        type: "objectBadges",
        title: "Industry Insights",
        dataPath: "atsScore.industryInsights",
        variant: "purple",
        rounded: true,
        size: "sm",
        itemStyle: "bg-purple-50 border border-purple-200",
    },
];

// ATS Score section is special and rendered separately
export const ATS_SCORE_CONFIG = {
    dataPath: "atsScore",
    scoreKey: "score",
    breakdownKey: "breakdown",
    detailsKey: "details",
};
