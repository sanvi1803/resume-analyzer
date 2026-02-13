import { useEffect } from "react";

export default function KeywordGapsAnalysis({ data = {} }) {
  const { missing = [], present = [] } = data;
  useEffect(() => {
    console.log("Keyword Gaps Analysis Data:", data);
  }, [data]);

  return (
    <div className="card">
      <h4>Keyword Gaps</h4>

      <div className="p-3 bg-gray-50 rounded-lg text-center mb-4">
        <div>
          <span className="block text-2xl font-bold text-red-600">
            {missing.length}
          </span>
          <span className="block text-xs text-gray-600 mt-1">Missing</span>
        </div>
      </div>

      {missing.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            Add These Keywords:
          </p>
          <div className="flex flex-wrap gap-2">
            {missing.slice(0, 8).map((kw, idx) => (
              <span
                key={idx}
                className="inline-block bg-red-100 text-red-900 px-2.5 py-1 rounded text-xs font-medium"
              >
                {kw}
              </span>
            ))}
            {missing.length > 8 && (
              <span className="inline-block bg-red-100 text-red-900 px-2.5 py-1 rounded text-xs font-medium">
                +{missing.length - 8}
              </span>
            )}
          </div>
        </div>
      )}

      {present.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            Already Present:
          </p>
          <div className="flex flex-wrap gap-2">
            {present.slice(0, 4).map((kw, idx) => (
              <span
                key={idx}
                className="inline-block bg-green-100 text-green-900 px-2.5 py-1 rounded text-xs font-medium"
              >
                {kw}
              </span>
            ))}
            {present.length > 4 && (
              <span className="inline-block bg-gray-200 text-gray-700 px-2.5 py-1 rounded text-xs font-medium">
                +{present.length - 4}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
