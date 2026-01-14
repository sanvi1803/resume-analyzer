import { FiZap, FiTarget } from "react-icons/fi";

export default function ModeSelector({ setMode }) {
  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold mb-2">Choose Analysis Mode</h2>
      <p className="text-base text-gray-600 mb-10">
        Select how you want to improve your resume
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div
          className="bg-white rounded-lg shadow-md p-8 text-left cursor-pointer transition-all hover:shadow-lg hover:border-blue-600 hover:-translate-y-1 border-2 border-transparent"
          onClick={() => setMode("quality")}
        >
          <FiZap className="text-4xl text-blue-600 mb-4" />
          <h3 className="text-2xl font-semibold mb-3 text-gray-900">
            Resume Quality Analyzer
          </h3>
          <p className="text-gray-600 mb-5 text-sm">
            Analyze your resume independently for:
          </p>
          <ul className="list-none mb-6">
            <li className="text-gray-700 mb-2 text-sm">
              ✓ Repeated words & phrases
            </li>
            <li className="text-gray-700 mb-2 text-sm">
              ✓ Impact verb analysis
            </li>
            <li className="text-gray-700 mb-2 text-sm">
              ✓ Brevity & clarity score
            </li>
            <li className="text-gray-700 mb-2 text-sm">✓ Skills coverage</li>
            <li className="text-gray-700 text-sm">✓ Overall strength score</li>
          </ul>
          <button className="btn btn-primary">Start Analyzing</button>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-8 text-left cursor-pointer transition-all hover:shadow-lg hover:border-blue-600 hover:-translate-y-1 border-2 border-transparent"
          onClick={() => setMode("jd-match")}
        >
          <FiTarget className="text-4xl text-blue-600 mb-4" />
          <h3 className="text-2xl font-semibold mb-3 text-gray-900">
            Resume vs Job Description
          </h3>
          <p className="text-gray-600 mb-5 text-sm">
            Match your resume against a job description to:
          </p>
          <ul className="list-none mb-6">
            <li className="text-gray-700 mb-2 text-sm">
              ✓ Get ATS match score
            </li>
            <li className="text-gray-700 mb-2 text-sm">✓ Find skill gaps</li>
            <li className="text-gray-700 mb-2 text-sm">
              ✓ Identify missing keywords
            </li>
            <li className="text-gray-700 mb-2 text-sm">
              ✓ Get targeted improvements
            </li>
            <li className="text-gray-700 text-sm">
              ✓ Optimize for specific roles
            </li>
          </ul>
          <button className="btn btn-primary">Match with JD</button>
        </div>
      </div>
    </section>
  );
}
