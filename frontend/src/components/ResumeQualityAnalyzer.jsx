import { useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { FiChevronLeft, FiUploadCloud } from "react-icons/fi";
import ScoreCard from "./ScoreCard";
import RepeatedWordsAnalysis from "./analyses/RepeatedWordsAnalysis";
import ImpactWordsAnalysis from "./analyses/ImpactWordsAnalysis";
import BrevityAnalysis from "./analyses/BrevityAnalysis";
import SkillsAnalysis from "./analyses/SkillsAnalysis";

export default function ResumeQualityAnalyzer({ onBack }) {
  const { getToken } = useAuth();
  const [file, setFile] = useState(null);
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

    try {
      setLoading(true);
      setError("");

      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post("/api/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

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
          <h2 className="text-3xl font-bold mb-6">Resume Quality Analysis</h2>

          {/* Overall Score Card */}
          <ScoreCard
            title="Overall Resume Strength"
            score={analysis.overallScore}
            total={100}
            description="Based on repeated words, impact, brevity, and skills"
          />

          {/* Detailed Analyses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <RepeatedWordsAnalysis data={analysis.repeated} />
            <ImpactWordsAnalysis data={analysis.impact} />
            <BrevityAnalysis data={analysis.brevity} />
            <SkillsAnalysis data={analysis.skills} />
          </div>

          {analysis.aiInsights && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-2xl font-semibold mb-4">
                AI-Generated Suggestions
              </h3>
              <div className="space-y-4">
                {analysis.aiInsights.improvements?.map((imp, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <p className="mb-2">
                      <strong>Original:</strong> {imp.original}
                    </p>
                    <p className="mb-2">
                      <strong>Improved:</strong> {imp.improved}
                    </p>
                    <p>
                      <strong>Why:</strong> {imp.reason}
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
        <h2 className="text-3xl font-bold mb-2">Upload Your Resume</h2>
        <p className="text-gray-600 mb-4">
          Supported formats: PDF, DOCX, TXT (Max 10MB)
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
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

          <button
            type="submit"
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!file || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>{" "}
                Analyzing...
              </span>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
