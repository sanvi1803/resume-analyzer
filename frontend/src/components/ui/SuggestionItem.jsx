import Badge from "./Badge";

/**
 * Reusable SuggestionItem component for displaying categorized suggestions
 *
 * @param {string} label - Category label (e.g., "Skills", "Verb", "Metrics")
 * @param {string} suggestion - The suggestion text
 * @param {string} variant - Color variant: 'blue', 'purple', 'green', 'amber'
 */
const borderColors = {
  blue: "border-blue-600",
  purple: "border-purple-600",
  green: "border-green-600",
  amber: "border-amber-500",
  red: "border-red-600",
};

export default function SuggestionItem({
  label,
  suggestion,
  variant = "blue",
}) {
  const borderColor = borderColors[variant] || borderColors.blue;

  return (
    <div
      className={`p-3 bg-gray-50 rounded-lg mb-2 border-l-4 ${borderColor} flex items-start gap-2`}
    >
      <Badge
        variant={variant}
        size="sm"
        solid
        className="whitespace-nowrap mt-0.5 font-semibold"
      >
        {label}
      </Badge>
      <p className="m-0 text-sm text-gray-700 flex-1">{suggestion}</p>
    </div>
  );
}
