import { SuggestionItem } from "../ui";

const SUGGESTION_CONFIG = {
  skill: { label: "Skills", variant: "blue", title: "Skills to Add" },
  verb: { label: "Verb", variant: "purple", title: "Action Verbs" },
  metrics: { label: "Metrics", variant: "green", title: "Metrics & Impact" },
  positioning: {
    label: "Positioning",
    variant: "purple",
    title: "Positioning & Impact",
  },
};

function SuggestionGroup({ suggestions, type }) {
  if (!suggestions || suggestions.length === 0) return null;
  const config = SUGGESTION_CONFIG[type];

  return (
    <div className="mb-6">
      <h4
        className={`text-xs font-semibold text-${config.variant}-600 mb-3 uppercase tracking-wide`}
      >
        {config.title}
      </h4>
      {suggestions.map((sugg, idx) => (
        <SuggestionItem
          key={idx}
          label={config.label}
          suggestion={sugg.suggestion}
          variant={config.variant}
        />
      ))}
    </div>
  );
}

export default function TargetedSuggestionsAnalysis({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3>Targeted Improvement Suggestions</h3>
        <p className="text-gray-600 text-center p-5 bg-green-50 rounded-lg">
          No suggestions at this time.
        </p>
      </div>
    );
  }

  const grouped = {
    skill: data.filter((s) => s.type === "skill"),
    verb: data.filter((s) => s.type === "verb"),
    metrics: data.filter((s) => s.type === "metrics"),
    positioning: data.filter((s) => s.type === "positioning"),
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">
        Targeted Improvement Suggestions
      </h3>
      {Object.entries(grouped).map(([type, suggestions]) => (
        <SuggestionGroup key={type} suggestions={suggestions} type={type} />
      ))}
    </div>
  );
}
