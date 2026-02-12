import { Routes, Route } from "react-router-dom";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { FiLoader } from "react-icons/fi";
import HomePage from "./components/HomePage";
import QualityAnalysisPage from "./pages/QualityAnalysisPage";
import JDMatchPage from "./pages/JDMatchPage";
import DashboardPage from "./pages/DashboardPage";
import ModeSelectorPage from "./pages/ModeSelectorPage";
import { useInitializeUser } from "./hooks/useInitializeUser";

function App() {
  // Sync Clerk user to Convex database on authentication
  useInitializeUser();
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <FiLoader
              size={48}
              className="animate-spin text-blue-600 mx-auto mb-4"
            />
            <p className="text-xl text-gray-700">Loading...</p>
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyse" element={<HomePage />} />
        </Routes>
      </Unauthenticated>

      <Authenticated>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyse" element={<ModeSelectorPage />} />
          <Route path="/analyse/quality" element={<QualityAnalysisPage />} />
          <Route path="/analyse/jd-match" element={<JDMatchPage />} />
          <Route path="/analyse/dashboard" element={<DashboardPage />} />
        </Routes>
      </Authenticated>
    </>
  );
}

export default App;
