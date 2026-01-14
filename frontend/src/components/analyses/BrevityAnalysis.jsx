export default function BrevityAnalysis({ data = {} }) {
  const { score = 0, improvements = [], totalBullets = 0 } = data;

  return (
    <div className="card">
      <h4 className="font-semibold text-lg mb-4">Brevity & Clarity</h4>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${score}%`,
                backgroundColor:
                  score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444",
              }}
            ></div>
          </div>
        </div>
        <span className="font-bold text-lg whitespace-nowrap">{score}/100</span>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <span className="font-medium text-gray-700">Total Bullets:</span>{" "}
          <span className="font-semibold">{totalBullets}</span>
        </p>
      </div>

      {improvements.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            Issues Found:
          </p>
          {improvements.slice(0, 2).map((imp, idx) => (
            <div
              key={idx}
              className="p-2 bg-gray-50 rounded-lg mb-2 border-l-3 border-amber-500"
            >
              <span className="inline-block bg-amber-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                {imp.issue}
              </span>
              <p className="text-xs text-gray-700 m-1 mt-1">{imp.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
