export default function ATSScoreCard({ score }) {
  const percentage = score.score;

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

      <div className="space-y-2 mt-6">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-700">Keyword Match:</span>
          <strong className="text-blue-600">{score.keywordMatch}%</strong>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-700">Section Completion:</span>
          <strong className="text-blue-600">{score.sectionCompletion}%</strong>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-700">Matched Keywords:</span>
          <strong className="text-blue-600">
            {score.matchedKeywords} / {score.totalKeywords}
          </strong>
        </div>
      </div>
    </div>
  );
}
