import { useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { FiChevronLeft, FiUploadCloud } from "react-icons/fi";
import ATSScoreCard from "./ATSScoreCard";
import MatchedSkillsAnalysis from "./analyses/MatchedSkillsAnalysis";
import KeywordGapsAnalysis from "./analyses/KeywordGapsAnalysis";
import TargetedSuggestionsAnalysis from "./analyses/TargetedSuggestionsAnalysis";

export default function JDMatcher({ onBack }) {
  const { getToken } = useAuth();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a PDF, DOCX, or TXT file");
        setFile(null);
      }
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a resume file");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await axios.post(
        "/api/resume/analyze-with-jd",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(
        err.response?.data?.message || "Analysis failed. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (analysis) {
    return (
      <div className="max-w-6xl mx-auto px-5">
        <button
          onClick={() => {
            onBack();
            setAnalysis(null);
          }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <FiChevronLeft /> Back to Mode Selection
        </button>

        <div>
          <h2 className="text-3xl font-bold mb-6">
            Resume vs Job Description Analysis
          </h2>

          {/* ATS Score */}
          <ATSScoreCard score={analysis.atsScore} />

          {/* Matched Skills and Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <MatchedSkillsAnalysis data={analysis.matchedSkills} />
            <KeywordGapsAnalysis data={analysis.keywordGaps} />
          </div>

          {/* Targeted Suggestions */}
          <TargetedSuggestionsAnalysis data={analysis.targetedSuggestions} />

          {/* AI Recommendations */}
          {analysis.aiRecommendations && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-2xl font-semibold mb-4">
                AI-Generated Targeted Improvements
              </h3>
              <div className="space-y-4">
                {analysis.aiRecommendations.improvements?.map((imp, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <p className="mb-2">
                      <strong>Current:</strong> {imp.original}
                    </p>
                    <p className="mb-2">
                      <strong>Suggested:</strong> {imp.improved}
                    </p>
                    <p>
                      <strong>Impact:</strong> {imp.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
      >
        <FiChevronLeft /> Back to Mode Selection
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6">
          Match Resume with Job Description
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="label">Upload Your Resume *</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
              <div>
                <p className="text-gray-700">
                  Click to upload or drag and drop
                </p>
                {file && (
                  <p className="text-sm text-blue-600 mt-1">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="label">Job Description *</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              className="input-field"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary bg-gray-500 hover:bg-gray-600 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!file || !jobDescription.trim() || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>{" "}
                Analyzing...
              </span>
            ) : (
              "Analyze & Match"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
