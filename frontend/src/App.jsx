import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import Header from "./components/Header";
import ModeSelector from "./components/ModeSelector";
import ResumeQualityAnalyzer from "./components/ResumeQualityAnalyzer";
import JDMatcher from "./components/JDMatcher";
import Dashboard from "./components/Dashboard";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const [mode, setMode] = useState(null); // 'quality', 'jd-match', or 'dashboard'

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold mb-2">
              Welcome to Resume Analyzer
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in to analyze your resume and track your progress
            </p>
            <div className="text-gray-700 space-y-2">
              <p>✓ Analyze resume quality</p>
              <p>✓ Match against job descriptions</p>
              <p>✓ Get AI-powered suggestions</p>
              <p>✓ Track analysis history</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {!mode && <ModeSelector setMode={setMode} />}

        {mode === "quality" && (
          <ResumeQualityAnalyzer onBack={() => setMode(null)} />
        )}

        {mode === "jd-match" && <JDMatcher onBack={() => setMode(null)} />}

        {mode === "dashboard" && <Dashboard />}
      </main>
    </div>
  );
}

export default App;
