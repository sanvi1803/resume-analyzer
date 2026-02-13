export default function MatchedSkillsAnalysis({ data = [] }) {
  const { matched = [], missing = [] } = data;

  return (
    <div className="card">
      <h4>Matched Skills</h4>

      <div className="p-3 bg-gray-50 rounded-lg text-center mb-4">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-green-600">
            {data.length}
          </span>
          <span className="text-xs text-gray-600 mt-1">Matched</span>
        </div>
      </div>

      {data.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            Your Resume Has:
          </p>
          <div className="flex flex-wrap gap-2">
            {data.slice(0, 8).map((skill, idx) => (
              <span
                key={idx}
                className="inline-block bg-green-100 text-green-900 px-2.5 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {data.length > 8 && (
              <span className="inline-block bg-gray-200 text-gray-700 px-2.5 py-1 rounded text-xs font-medium">
                +{data.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {data.length === 0 && (
        <p className="text-gray-600 text-sm p-3 bg-amber-50 rounded-lg">
          No matched skills found. Review the missing skills section.
        </p>
      )}
    </div>
  );
}
