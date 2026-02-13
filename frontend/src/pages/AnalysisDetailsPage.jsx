import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SuggestionCard from "../components/SuggestionCard";

const AnalysisDetailsPage = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!location.state?.analysis);

  useEffect(() => {
    if (analysis) {
      setLoading(false);
    }
  }, [analysis]);

  if (!analysis && loading) {
    return (
      <div className="max-w-6xl mx-auto px-5">
        <p className="text-gray-600">No analysis data provided</p>
        <button
          onClick={() => navigate("/analyse/dashboard")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <button
        onClick={() => navigate("/analyse/dashboard")}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Resume Analysis
            </h1>
            <p className="text-gray-600">
              Analyzed on {new Date(analysis.analyzedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ATS Score */}
        {analysis.results.atsScore && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              ATS Compatibility Score
            </h2>
            <div className="text-5xl font-bold text-green-600">
              {analysis.results.atsScore.score}
              <span className="text-2xl text-gray-600">%</span>
            </div>

            {/* ATS Breakdown */}
            {analysis.results.atsScore.breakdown &&
              Object.keys(analysis.results.atsScore.breakdown).length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {Object.entries(analysis.results.atsScore.breakdown).map(
                    ([key, value]) => (
                      <div key={key} className="bg-white p-3 rounded">
                        <p className="text-gray-600 text-sm capitalize">
                          {key}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {value}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}

            {/* ATS Details */}
            {analysis.results.atsScore.details &&
              Object.keys(analysis.results.atsScore.details).length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold text-gray-900 mb-2">Details:</p>
                  <div className="space-y-2">
                    {Object.entries(analysis.results.atsScore.details).map(
                      ([key, value]) => (
                        <p key={key} className="text-sm text-gray-700">
                          <span className="font-medium capitalize">{key}:</span>{" "}
                          {value}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Skills Coverage */}
        {analysis.results.skills && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Skills Analysis
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700">
                Coverage:{" "}
                <span className="font-semibold text-blue-600">
                  {analysis.results.skills.coverage}%
                </span>
              </p>
            </div>

            {/* Detected Skills */}
            {Array.isArray(analysis.results.skills.detected) &&
              analysis.results.skills.detected.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Detected Skills ({analysis.results.skills.detected.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.results.skills.detected.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Missing Skills */}
            {Array.isArray(analysis.results.skills.missing) &&
              analysis.results.skills.missing.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Missing Skills ({analysis.results.skills.missing.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.results.skills.missing.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-full font-medium text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Matched Skills */}
        {Array.isArray(analysis.results.matchedSkills) &&
          analysis.results.matchedSkills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Matched Skills ({analysis.results.matchedSkills.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.results.matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Keyword Gaps */}
        {analysis.results.keywordGaps && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Keyword Analysis
            </h2>

            {/* Present Keywords */}
            {Array.isArray(analysis.results.keywordGaps.present) &&
              analysis.results.keywordGaps.present.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Present Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.results.keywordGaps.present.map(
                      (keyword, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Missing Keywords */}
            {Array.isArray(analysis.results.keywordGaps.missing) &&
              analysis.results.keywordGaps.missing.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Missing Keywords
                  </h3>
                  <div className="space-y-2">
                    {analysis.results.keywordGaps.missing.map((item, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 border-orange-400 pl-3 py-1"
                      >
                        <p className="text-gray-700 text-sm font-medium">
                          {typeof item === "string" ? item : item.keyword}
                        </p>
                        {typeof item === "object" && item.suggestion && (
                          <p className="text-gray-600 text-sm">
                            {item.suggestion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Impact Words */}
        {analysis.results.impact && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Impact Words Analysis
            </h2>

            {/* Strong Words */}
            {Array.isArray(analysis.results.impact.strong) &&
              analysis.results.impact.strong.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Strong Words ({analysis.results.impact.strong.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.results.impact.strong.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm"
                      >
                        {typeof item === "string" ? item : item.strongWord}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Weak Words */}
            {Array.isArray(analysis.results.impact.weak) &&
              analysis.results.impact.weak.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Weak Words ({analysis.results.impact.weak.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.results.impact.weak.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                      >
                        {typeof item === "string" ? item : item.word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Repeated Words */}
        {Array.isArray(analysis.results.repeated) &&
          analysis.results.repeated.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Repeated Words ({analysis.results.repeated.length})
              </h2>
              <div className="space-y-2">
                {analysis.results.repeated.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {typeof item === "string" ? item : item.word}
                      </span>
                      {typeof item === "object" && item.suggestion && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.suggestion}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-red-600 ml-4">
                      {typeof item === "string"
                        ? "Repeated"
                        : `${item.frequency} times`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Brevity Score */}
        {analysis.results.brevity && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Brevity Analysis
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700 mb-2">
                Score:{" "}
                <span className="font-semibold text-blue-600">
                  {analysis.results.brevity.score}/100
                </span>
              </p>
              <p className="text-gray-700">
                Total Bullets:{" "}
                <span className="font-semibold">
                  {analysis.results.brevity.totalBullets}
                </span>
              </p>
              {Array.isArray(analysis.results.brevity.improvements) &&
                analysis.results.brevity.improvements.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-gray-900 mb-2">
                      Improvements:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.results.brevity.improvements.map((imp, idx) => (
                        <li key={idx} className="text-gray-700 text-sm">
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Targeted Suggestions */}
        {Array.isArray(analysis.results.targetedSuggestions) &&
          analysis.results.targetedSuggestions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Targeted Suggestions (
                {analysis.results.targetedSuggestions.length})
              </h2>
              <div className="space-y-3">
                {analysis.results.targetedSuggestions.map((item, idx) => (
                  <SuggestionCard
                    key={idx}
                    item={item}
                    renderContent={(item) => (
                      <>
                        <p className="text-gray-700">
                          {typeof item === "string" ? item : item.suggestion}
                        </p>
                        {typeof item === "object" && item.word && (
                          <p className="text-sm text-gray-600 mt-2">
                            Word:{" "}
                            <span className="font-medium">{item.word}</span>
                          </p>
                        )}
                      </>
                    )}
                  />
                ))}
              </div>
            </div>
          )}

        {/* Industry Insights */}
        {analysis.results.atsScore?.industryInsights &&
          Object.keys(analysis.results.atsScore.industryInsights).length >
            0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Industry Insights
              </h2>
              <div className="space-y-3">
                {Object.entries(analysis.results.atsScore.industryInsights).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                    >
                      <p className="font-semibold text-gray-900 capitalize mb-1">
                        {key}
                      </p>
                      <p className="text-gray-700">{value}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        {/* Full Results JSON */}
        <details className="mt-12 pt-8 border-t border-gray-200">
          <summary className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600">
            View Full Results JSON
          </summary>
          <pre className="mt-4 bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(analysis.results, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default AnalysisDetailsPage;
