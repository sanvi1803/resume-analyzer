import { FiFileText } from "react-icons/fi";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
export default function Header() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <header className="bg-linear-to-r from-gray-700 to-gray-900 text-white py-5 mb-8 shadow-lg">
      <div className="max-w-6xl mx-auto px-3 flex flex-col md:flex-row items-center justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-bold">
            <FiFileText size={28} />
          </Link>
          <h1 className="text-4xl font-bold">Resume Analyzer</h1>
        </div>
        <p className="text-base opacity-90 grow text-center md:text-left mt-2">
          AI-Powered Resume Improvement & ATS Matching
        </p>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="text-sm opacity-75">Loading...</div>
          ) : !isAuthenticated ? (
            <SignInButton mode="modal">
              <button className="bg-white text-gray-700 px-5 py-2 rounded font-semibold cursor-pointer hover:shadow-md transition-all">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-95 whitespace-nowrap">
                Welcome!
              </span>
              <UserButton />
              <Link
                to="/analyse/dashboard"
                className="bg-gray-600 text-white px-2 py-2 rounded font-medium hover:bg-gray-700 transition-colors"
              >
                <MdDashboard />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
