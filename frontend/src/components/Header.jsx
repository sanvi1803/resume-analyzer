import { FiFileText } from "react-icons/fi";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 mb-10 shadow-lg">
      <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-3">
          <FiFileText size={28} />
          <h1 className="text-4xl font-bold">Resume Analyzer</h1>
        </div>
        <p className="text-base opacity-90 flex-grow text-center md:text-left">
          AI-Powered Resume Improvement & ATS Matching
        </p>

        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="bg-white text-blue-600 px-5 py-2 rounded font-semibold cursor-pointer hover:shadow-md transition-all">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-95 whitespace-nowrap">
                Welcome, {user?.firstName}!
              </span>
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
