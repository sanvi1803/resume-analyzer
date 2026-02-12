export default function RepeatedWordsAnalysis({ data = [] }) {
  return (
    <div className="card">
      <h4>Repeated Words & Phrases</h4>

      {data.length === 0 ? (
        <p className="no-data">Great! No overused words detected.</p>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 5).map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-lg border-l-4 border-amber-500"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold capitalize text-gray-900">
                  {item.word}
                </span>
                <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  ×{item.frequency}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-gray-600 m-0 mb-2">Try instead:</p>
                <div className="flex flex-wrap gap-2">
                  {item.suggestions?.length > 0 &&
                    item.suggestions?.map((sugg, i) => (
                      <span
                        key={i}
                        className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      >
                        {sugg}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
