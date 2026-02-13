import { useEffect } from "react";

export default function ImpactWordsAnalysis({ data = {} }) {
  useEffect(() => {
    console.log("ImpactWordsAnalysis data:", data);
  }, []);
  return (
    <div className="card">
      <h4>Impact Verb Analysis</h4>

      <div className="flex gap-3 mb-4">
        {data.weak && data.weak.length > 0 && (
          <div className="flex-1 p-3 bg-amber-50 border border-amber-300 rounded-lg text-center">
            <span className="block text-xl font-bold text-amber-900">
              {data.weak.length}
            </span>
            <span className="block text-xs text-amber-800 mt-1">
              Weak Verbs Found
            </span>
          </div>
        )}

        {data.strong && data.strong.length > 0 && (
          <div className="flex-1 p-3 bg-green-50 border border-green-300 rounded-lg text-center">
            <span className="block text-xl font-bold text-green-900">
              {data.strong.length}
            </span>
            <span className="block text-xs text-green-800 mt-1">
              Strong Verbs Used
            </span>
          </div>
        )}
      </div>

      {data.weak && data.weak.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            Weak Verbs to Replace:
          </p>
          {data.weak.slice(0, 5 ).map((item, idx) => (
            <div
              key={idx}
              className="p-2 bg-gray-50 rounded-lg mb-2 border-l-3 border-red-500"
            >
              <p className="text-xs text-gray-700 italic m-0 mb-1">
                {item.line.substring(0, 50)}...
              </p>
              <p className="text-xs text-blue-600 m-0">
                Replace "{item.word}" with: {item.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
