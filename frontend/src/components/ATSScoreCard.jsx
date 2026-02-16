import { BadgeList } from "./ui";

// Breakdown item component
function BreakdownItem({ label, value, variant }) {
  const bgClasses = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    indigo: "bg-indigo-50",
    cyan: "bg-cyan-50",
    amber: "bg-amber-50",
    orange: "bg-orange-50",
    pink: "bg-pink-50",
    teal: "bg-teal-50",
  };
  const textClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    cyan: "text-cyan-600",
    amber: "text-amber-600",
    orange: "text-orange-600",
    pink: "text-pink-600",
    teal: "text-teal-600",
  };

  return (
    <div
      className={`flex justify-between items-center p-3 ${bgClasses[variant]} rounded-lg`}
    >
      <span className="text-gray-700 text-sm">{label}:</span>
      <strong className={textClasses[variant]}>{value}%</strong>
    </div>
  );
}

// Stat item component
function StatItem({ value, label, variant }) {
  const textClasses = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    pink: "text-pink-600",
  };

  return (
    <div className="p-3 bg-gray-50 rounded-lg text-center">
      <div className={`text-2xl font-bold ${textClasses[variant]}`}>
        {value}
      </div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

// Industry insight section component
function InsightSection({ title, items, variant }) {
  if (!items?.length) return null;

  const bgClasses = {
    blue: "bg-blue-50",
    purple: "bg-purple-50",
    green: "bg-green-50",
    amber: "bg-amber-50",
  };
  const titleClasses = {
    blue: "text-blue-900",
    purple: "text-purple-900",
    green: "text-green-900",
    amber: "text-amber-900",
  };

  return (
    <div className={`p-3 ${bgClasses[variant]} rounded-lg`}>
      <div className={`font-semibold text-sm ${titleClasses[variant]} mb-2`}>
        {title}:
      </div>
      <BadgeList items={items} variant={variant} maxItems={null} />
    </div>
  );
}

const BREAKDOWN_CONFIG = [
  { key: "keywordMatch", label: "Keyword Match", variant: "blue" },
  { key: "sectionCompletion", label: "Section Completion", variant: "green" },
  { key: "skillsMatch", label: "Skills Match", variant: "purple" },
  { key: "technicalSkills", label: "Technical Skills", variant: "indigo" },
  { key: "toolsAndTech", label: "Tools & Tech", variant: "cyan" },
  { key: "actionVerbs", label: "Action Verbs", variant: "amber" },
  {
    key: "quantifiableMetrics",
    label: "Quantifiable Metrics",
    variant: "orange",
  },
  { key: "certifications", label: "Certifications", variant: "pink" },
  { key: "industryTerminology", label: "Industry Terms", variant: "teal" },
];

const DETAILS_CONFIG = [
  { key: "matchedSkills", label: "Matched Skills", variant: "green" },
  { key: "missingSkills", label: "Missing Skills", variant: "red" },
  { key: "actionVerbsFound", label: "Action Verbs", variant: "blue" },
  { key: "metricsFound", label: "Metrics Found", variant: "purple" },
  { key: "toolsFound", label: "Tools Found", variant: "indigo" },
  { key: "certificationsFound", label: "Certifications", variant: "pink" },
];

export default function ATSScoreCard({ score }) {
  if (!score) return null;

  const percentage = score.score;
  const breakdown = score.breakdown || {
    keywordMatch: score.keywordMatch,
    sectionCompletion: score.sectionCompletion,
  };
  const details = score.details || {
    matchedKeywords: score.matchedKeywords
      ? parseInt(score.matchedKeywords)
      : 0,
    totalKeywords: score.totalKeywords || 0,
  };
  const industryInsights = score.industryInsights;

  let status = "Needs Work";
  let statusClass = "text-red-800 bg-red-100";
  let bgColor = "#fee2e2";
  let scoreColor = "#ef4444";
  let barColor = "bg-red-500";

  if (percentage >= 80) {
    status = "Excellent Match";
    statusClass = "text-green-800 bg-green-100";
    bgColor = "#dcfce7";
    scoreColor = "#10b981";
    barColor = "bg-green-500";
  } else if (percentage >= 60) {
    status = "Good Match";
    statusClass = "text-amber-800 bg-amber-100";
    bgColor = "#fef3c7";
    scoreColor = "#f59e0b";
    barColor = "bg-amber-500";
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-2xl font-semibold mb-2">ATS Match Score</h3>
      <p className="text-gray-600 mb-4">
        How well your resume aligns with the job description
      </p>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: scoreColor }}>
                {percentage}%
              </div>
              <div
                className={`text-sm font-semibold ${statusClass} px-2 py-1 rounded mt-1`}
              >
                {status}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-300 ${barColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {percentage >= 80
              ? "Excellent alignment with the job requirements"
              : percentage >= 60
                ? "Good alignment, some areas can be improved"
                : "Significant gaps - consider revising to match job requirements"}
          </p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-3">Score Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BREAKDOWN_CONFIG.map(({ key, label, variant }) =>
            breakdown[key] !== undefined ? (
              <BreakdownItem
                key={key}
                label={label}
                value={breakdown[key]}
                variant={variant}
              />
            ) : null,
          )}
        </div>
      </div>

      {/* Detailed Stats */}
      {details && Object.keys(details).length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Detailed Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DETAILS_CONFIG.map(({ key, label, variant }) =>
              details[key] !== undefined ? (
                <StatItem
                  key={key}
                  value={details[key]}
                  label={label}
                  variant={variant}
                />
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* Industry Insights */}
      {industryInsights && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Industry Insights</h4>
          <div className="space-y-3">
            <InsightSection
              title="Required Technical Skills"
              items={industryInsights.requiredTechnicalSkills}
              variant="blue"
            />
            <InsightSection
              title="Required Tools"
              items={industryInsights.requiredTools}
              variant="purple"
            />
            <InsightSection
              title="Recommended Action Verbs"
              items={industryInsights.recommendedActionVerbs}
              variant="green"
            />
            <InsightSection
              title="Relevant Certifications"
              items={industryInsights.relevantCertifications}
              variant="amber"
            />
          </div>
        </div>
      )}
    </div>
  );
}
