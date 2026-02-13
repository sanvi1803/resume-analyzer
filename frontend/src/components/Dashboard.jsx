import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [user, isLoaded]);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();

      // Fetch analysis history
      const historyRes = await axios.get("/api/resume/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Dashboard analysis history response:", historyRes.data);
      setAnalyses(historyRes.data.analyses || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // If no history, that's okay - just show empty state
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="max-w-6xl mx-auto px-5">
        Please sign in to view your dashboard
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Your Dashboard</h2>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-semibold mb-5 text-gray-900">
          Recent Analyses
        </h3>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : analyses.length === 0 ? (
          <p className="text-gray-600">
            No analyses yet. Start by uploading a resume!
          </p>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div
                key={analysis._id}
                onClick={() =>
                  navigate(`/analyse/analysis/${analysis._id}`, {
                    state: { analysis },
                  })
                }
                className="cursor-pointer border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                    {analysis.analysisType}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {new Date(analysis.analyzedAt).toLocaleDateString()}
                  </span>
                </div>
                {analysis.results.overallScore && (
                  <div className="text-gray-700 text-sm">
                    Score:{" "}
                    <span className="font-semibold text-blue-600">
                      {analysis.results.overallScore}/100
                    </span>
                  </div>
                )}
                {analysis.results.atsScore && (
                  <div className="text-gray-700 text-sm">
                    ATS Score:{" "}
                    <span className="font-semibold text-blue-600">
                      {analysis.results.atsScore.score}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
