export default function ScoreCard({ title, score, total = 100, description }) {
  const percentage = Math.round((score / total) * 100);
  let color = "#ef4444";

  if (percentage >= 80) color = "#10b981";
  else if (percentage >= 60) color = "#f59e0b";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-5">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      )}

      <div className="mb-4">
        <div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            ></div>
          </div>
          <div className="text-right font-bold text-gray-700">
            {score}/{total}
          </div>
        </div>
      </div>

      <div className="text-sm space-y-2">
        {percentage >= 80 && (
          <p className="text-green-900 bg-green-100 px-3 py-2 rounded">
            Excellent! Your resume is well-structured.
          </p>
        )}
        {percentage >= 60 && percentage < 80 && (
          <p className="text-amber-900 bg-amber-100 px-3 py-2 rounded">
            Good, but there's room for improvement.
          </p>
        )}
        {percentage < 60 && (
          <p className="text-red-900 bg-red-100 px-3 py-2 rounded">
            Consider the suggestions below to strengthen your resume.
          </p>
        )}
      </div>
    </div>
  );
}
