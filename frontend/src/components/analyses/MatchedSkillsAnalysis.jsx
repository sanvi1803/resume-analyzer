import { BadgeList, StatCard } from "../ui";

export default function MatchedSkillsAnalysis({ data = [] }) {
  return (
    <div className="card">
      <h4>Matched Skills</h4>

      <div className="p-3 bg-gray-50 rounded-lg text-center mb-4">
        <StatCard value={data.length} label="Matched" variant="green" />
      </div>

      {data.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            Your Resume Has:
          </p>
          <BadgeList items={data} variant="green" maxItems={8} />
        </div>
      )}

      {data.length === 0 && (
        <p className="text-gray-600 text-sm p-3 bg-amber-50 rounded-lg">
          No matched skills found. Review the missing skills section.
        </p>
      )}
    </div>
  );
}
