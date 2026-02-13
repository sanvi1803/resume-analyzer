import { BadgeList, StatCard } from "../ui";

export default function SkillsAnalysis({ data = {} }) {
  const { detected = [], missing = [], coverage = 0 } = data;

  return (
    <div className="card">
      <h4>Skills Coverage</h4>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <StatCard value={coverage} label="Skills Found" variant="blue" />
        <StatCard
          value={missing.length}
          label="Opportunities"
          variant="amber"
        />
      </div>

      {detected.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            ✓ Detected Skills:
          </p>
          <BadgeList items={detected} variant="green" maxItems={5} />
        </div>
      )}

      {missing.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            ⚠ Consider Adding:
          </p>
          <BadgeList items={missing} variant="amber" maxItems={4} />
        </div>
      )}
    </div>
  );
}
