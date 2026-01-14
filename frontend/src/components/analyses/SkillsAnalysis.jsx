export default function SkillsAnalysis({ data = {} }) {
  const { detected = [], missing = [], coverage = 0 } = data;

  return (
    <div className="card">
      <h4>Skills Coverage</h4>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="text-center p-2.5 bg-gray-50 rounded-lg">
          <span className="block text-lg font-bold text-blue-600">
            {coverage}
          </span>
          <span className="block text-xs text-gray-600 mt-1">Skills Found</span>
        </div>
        <div className="text-center p-2.5 bg-gray-50 rounded-lg">
          <span className="block text-lg font-bold text-amber-600">
            {missing.length}
          </span>
          <span className="block text-xs text-gray-600 mt-1">
            Opportunities
          </span>
        </div>
      </div>

      {detected.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            ✓ Detected Skills:
          </p>
          <div className="flex flex-wrap gap-2">
            {detected.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="inline-block bg-green-100 text-green-900 px-2 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {detected.length > 5 && (
              <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                +{detected.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            ⚠ Consider Adding:
          </p>
          <div className="flex flex-wrap gap-2">
            {missing.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="inline-block bg-amber-100 text-amber-900 px-2 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
