import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";
import { FiCheckCircle, FiZap, FiTarget } from "react-icons/fi";
import Header from "./Header";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/analyse", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">
              Resume Analyzer
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your resume with AI-powered insights and get matched with
            job opportunities in seconds
          </p>
          <SignInButton mode="modal">
            <button
              onClick={() => setTimeout(() => navigate("/analyse"), 500)}
              className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
            >
              Get Started Free
            </button>
          </SignInButton>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Card 1 - Quality Analysis */}
          <div
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 border-t-4 border-gray-500 animate-slide-up"
            style={{ animationDelay: "0s" }}
          >
            <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-lg mb-4 group-hover:bg-gray-600 group-hover:scale-110 transition-all duration-300">
              <FiCheckCircle className="w-8 h-8 text-gray-600 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Quality Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Detect repeated words, weak verbs, and structural issues. Get
              actionable improvements for better clarity and impact.
            </p>
            <div className="flex items-center gap-2 text-gray-600 font-semibold group-hover:gap-3 transition-all">
              Learn more <span>→</span>
            </div>
          </div>

          {/* Card 2 - ATS Matching */}
          <div
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 border-t-4 border-gray-600 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-lg mb-4 group-hover:bg-gray-700 group-hover:scale-110 transition-all duration-300">
              <FiTarget className="w-8 h-8 text-gray-700 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              ATS Matching
            </h3>
            <p className="text-gray-600 mb-4">
              Match your resume against job descriptions. Identify keyword gaps
              and increase your chances of passing through ATS systems.
            </p>
            <div className="flex items-center gap-2 text-gray-700 font-semibold group-hover:gap-3 transition-all">
              Learn more <span>→</span>
            </div>
          </div>

          {/* Card 3 - AI Insights */}
          <div
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8 border-t-4 border-gray-700 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-lg mb-4 group-hover:bg-gray-800 group-hover:scale-110 transition-all duration-300">
              <FiZap className="w-8 h-8 text-gray-800 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              AI-Powered Insights
            </h3>
            <p className="text-gray-600 mb-4">
              Get intelligent recommendations powered by AI. Receive tailored
              suggestions for skills, metrics, and action verbs.
            </p>
            <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
              Learn more <span>→</span>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <section
          className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl p-12 mb-20 text-white shadow-xl animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Choose Resume Analyzer?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 animate-pulse">98%</div>
              <p className="text-gray-200">ATS Pass Rate</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 animate-pulse">15+</div>
              <p className="text-gray-200">Analysis Metrics</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 animate-pulse">2min</div>
              <p className="text-gray-200">Analysis Time</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 animate-pulse">100%</div>
              <p className="text-gray-200">Free Analysis</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div
                className="flex flex-col items-center animate-slide-up"
                style={{ animationDelay: "0s" }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-700 text-white rounded-full font-bold text-2xl shadow-lg hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="h-20 w-1 bg-gradient-to-b from-gray-700 to-transparent my-2"></div>
                <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-gray-700 w-full">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    Upload Resume
                  </h4>
                  <p className="text-gray-600">
                    Upload your resume in PDF, DOCX, or TXT format in seconds
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div
                className="flex flex-col items-center animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-600 text-white rounded-full font-bold text-2xl shadow-lg hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="h-20 w-1 bg-gradient-to-b from-gray-600 to-transparent my-2"></div>
                <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-gray-600 w-full">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    Get Analysis
                  </h4>
                  <p className="text-gray-600">
                    Receive detailed insights about your resume quality and
                    improvements
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div
                className="flex flex-col items-center animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-full font-bold text-2xl shadow-lg hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="h-20 w-1 bg-gradient-to-b from-gray-800 to-transparent my-2"></div>
                <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-gray-800 w-full">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    Improve & Apply
                  </h4>
                  <p className="text-gray-600">
                    Implement suggestions and apply to your dream jobs with
                    confidence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="text-center py-12 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Resume?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of job seekers who improved their resumes with our
            AI-powered platform
          </p>
          <SignInButton mode="modal">
            <button
              onClick={() => setTimeout(() => navigate("/analyse"), 500)}
              className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
            >
              Start Free Now
            </button>
          </SignInButton>
        </section>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Resume Analyzer. All rights reserved. | Powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
}
