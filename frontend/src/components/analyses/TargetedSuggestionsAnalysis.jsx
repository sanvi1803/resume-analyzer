export default function TargetedSuggestionsAnalysis({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3>Targeted Improvement Suggestions</h3>
        <p className="text-gray-600 text-center p-5 bg-green-50 rounded-lg">
          No suggestions at this time.
        </p>
      </div>
    );
  }

  const skillSuggestions = data.filter((s) => s.type === "skill");
  const verbSuggestions = data.filter((s) => s.type === "verb");
  const metricSuggestions = data.filter((s) => s.type === "metrics");

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">
        Targeted Improvement Suggestions
      </h3>

      {skillSuggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wide">
            Skills to Add
          </h4>
          {skillSuggestions.map((sugg, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-lg mb-2 border-l-4 border-blue-600 flex items-start gap-2"
            >
              <span className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap mt-0.5">
                Skills
              </span>
              <p className="m-0 text-sm text-gray-700 flex-1">
                {sugg.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}

      {verbSuggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-purple-600 mb-3 uppercase tracking-wide">
            Action Verbs
          </h4>
          {verbSuggestions.map((sugg, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-lg mb-2 border-l-4 border-purple-600 flex items-start gap-2"
            >
              <span className="inline-block bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap mt-0.5">
                Verb
              </span>
              <p className="m-0 text-sm text-gray-700 flex-1">
                {sugg.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}

      {metricSuggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-green-600 mb-3 uppercase tracking-wide">
            Metrics & Impact
          </h4>
          {metricSuggestions.map((sugg, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-lg mb-2 border-l-4 border-green-600 flex items-start gap-2"
            >
              <span className="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap mt-0.5">
                Metrics
              </span>
              <p className="m-0 text-sm text-gray-700 flex-1">
                {sugg.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
