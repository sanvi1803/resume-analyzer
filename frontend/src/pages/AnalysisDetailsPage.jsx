import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SuggestionCard from "../components/SuggestionCard";
import {
  SectionRenderer,
  getNestedValue,
} from "../components/SectionRenderers";
import {
  ANALYSIS_SECTIONS_CONFIG,
  ATS_SCORE_CONFIG,
} from "../config/analysisConfig";

const AnalysisDetailsPage = () => {
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

  const atsScore = getNestedValue(analysis.results, ATS_SCORE_CONFIG.dataPath);

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

        {/* ATS Score - Special Section */}
        {atsScore && (
          <div className="bg-linear-to-r from-green-50 to-green-100 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              ATS Compatibility Score
            </h2>
            <div className="text-5xl font-bold text-green-600">
              {atsScore[ATS_SCORE_CONFIG.scoreKey]}
              <span className="text-2xl text-gray-600">%</span>
            </div>

            {/* ATS Breakdown */}
            {atsScore[ATS_SCORE_CONFIG.breakdownKey] &&
              Object.keys(atsScore[ATS_SCORE_CONFIG.breakdownKey]).length >
                0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {Object.entries(atsScore[ATS_SCORE_CONFIG.breakdownKey]).map(
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
            {atsScore[ATS_SCORE_CONFIG.detailsKey] &&
              Object.keys(atsScore[ATS_SCORE_CONFIG.detailsKey]).length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold text-gray-900 mb-2">Details:</p>
                  <div className="space-y-2">
                    {Object.entries(atsScore[ATS_SCORE_CONFIG.detailsKey]).map(
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

        {/* Config-driven Sections */}
        {ANALYSIS_SECTIONS_CONFIG.map((config, idx) => (
          <SectionRenderer
            key={idx}
            config={config}
            results={analysis.results}
            SuggestionCard={SuggestionCard}
          />
        ))}

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
