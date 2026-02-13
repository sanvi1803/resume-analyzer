export default function ATSScoreCard({ score }) {
  if (!score) return null;

  const percentage = score.score;
  // Support both new format (with breakdown) and old format (top-level fields)
  const breakdown = score.breakdown || {
    keywordMatch: score.keywordMatch,
    sectionCompletion: score.sectionCompletion,
  };
  const details = score.details || {
    matchedKeywords: score.matchedKeywords ? parseInt(score.matchedKeywords) : 0,
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
              <div className="text-4xl font-bold" style={{ color: scoreColor }}>
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
            ></div>
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
          {breakdown.keywordMatch !== undefined && (
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 text-sm">Keyword Match:</span>
              <strong className="text-blue-600">
                {breakdown.keywordMatch}%
              </strong>
            </div>
          )}
          {breakdown.sectionCompletion !== undefined && (
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700 text-sm">Section Completion:</span>
              <strong className="text-green-600">
                {breakdown.sectionCompletion}%
              </strong>
            </div>
          )}
          {breakdown.skillsMatch !== undefined && (
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700 text-sm">Skills Match:</span>
              <strong className="text-purple-600">
                {breakdown.skillsMatch}%
              </strong>
            </div>
          )}
          {breakdown.technicalSkills !== undefined && (
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
              <span className="text-gray-700 text-sm">Technical Skills:</span>
              <strong className="text-indigo-600">
                {breakdown.technicalSkills}%
              </strong>
            </div>
          )}
          {breakdown.toolsAndTech !== undefined && (
            <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
              <span className="text-gray-700 text-sm">Tools & Tech:</span>
              <strong className="text-cyan-600">
                {breakdown.toolsAndTech}%
              </strong>
            </div>
          )}
          {breakdown.actionVerbs !== undefined && (
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-gray-700 text-sm">Action Verbs:</span>
              <strong className="text-amber-600">
                {breakdown.actionVerbs}%
              </strong>
            </div>
          )}
          {breakdown.quantifiableMetrics !== undefined && (
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700 text-sm">
                Quantifiable Metrics:
              </span>
              <strong className="text-orange-600">
                {breakdown.quantifiableMetrics}%
              </strong>
            </div>
          )}
          {breakdown.certifications !== undefined && (
            <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
              <span className="text-gray-700 text-sm">Certifications:</span>
              <strong className="text-pink-600">
                {breakdown.certifications}%
              </strong>
            </div>
          )}
          {breakdown.industryTerminology !== undefined && (
            <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
              <span className="text-gray-700 text-sm">Industry Terms:</span>
              <strong className="text-teal-600">
                {breakdown.industryTerminology}%
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats */}
      {details && Object.keys(details).length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Detailed Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {details.matchedSkills !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {details.matchedSkills}
                </div>
                <div className="text-xs text-gray-600">Matched Skills</div>
              </div>
            )}
            {details.missingSkills !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {details.missingSkills}
                </div>
                <div className="text-xs text-gray-600">Missing Skills</div>
              </div>
            )}
            {details.actionVerbsFound !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {details.actionVerbsFound}
                </div>
                <div className="text-xs text-gray-600">Action Verbs</div>
              </div>
            )}
            {details.metricsFound !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {details.metricsFound}
                </div>
                <div className="text-xs text-gray-600">Metrics Found</div>
              </div>
            )}
            {details.toolsFound !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {details.toolsFound}
                </div>
                <div className="text-xs text-gray-600">Tools Found</div>
              </div>
            )}
            {details.certificationsFound !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {details.certificationsFound}
                </div>
                <div className="text-xs text-gray-600">Certifications</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Industry Insights */}
      {industryInsights && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Industry Insights</h4>
          <div className="space-y-3">
            {industryInsights.requiredTechnicalSkills?.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-sm text-blue-900 mb-2">
                  Required Technical Skills:
                </div>
                <div className="flex flex-wrap gap-2">
                  {industryInsights.requiredTechnicalSkills.map(
                    (skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
            {industryInsights.requiredTools?.length > 0 && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-sm text-purple-900 mb-2">
                  Required Tools:
                </div>
                <div className="flex flex-wrap gap-2">
                  {industryInsights.requiredTools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {industryInsights.recommendedActionVerbs?.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-sm text-green-900 mb-2">
                  Recommended Action Verbs:
                </div>
                <div className="flex flex-wrap gap-2">
                  {industryInsights.recommendedActionVerbs.map((verb, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {industryInsights.relevantCertifications?.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="font-semibold text-sm text-amber-900 mb-2">
                  Relevant Certifications:
                </div>
                <div className="flex flex-wrap gap-2">
                  {industryInsights.relevantCertifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
