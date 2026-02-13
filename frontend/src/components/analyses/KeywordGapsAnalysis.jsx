import { BadgeList, StatCard } from "../ui";

export default function KeywordGapsAnalysis({ data = {} }) {
  const { missing = [], present = [] } = data;

  return (
    <div className="card">
      <h4>Keyword Gaps</h4>

      <div className="p-3 bg-gray-50 rounded-lg text-center mb-4">
        <StatCard value={missing.length} label="Missing" variant="red" />
      </div>

      {missing.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            Add These Keywords:
          </p>
          <BadgeList
            items={missing}
            variant="red"
            maxItems={8}
            moreVariant="red"
          />
        </div>
      )}

      {present.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 m-0 mb-2">
            Already Present:
          </p>
          <BadgeList items={present} variant="green" maxItems={4} />
        </div>
      )}
    </div>
  );
}
