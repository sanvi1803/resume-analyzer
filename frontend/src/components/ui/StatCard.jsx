/**
 * StatCard component for displaying statistics in analysis cards
 *
 * @param {string|number} value - The stat value
 * @param {string} label - The stat label
 * @param {string} variant - Color variant: 'blue', 'amber', 'green', 'red', 'purple'
 */
const valueColors = {
  blue: "text-blue-600",
  amber: "text-amber-600",
  green: "text-green-600",
  red: "text-red-600",
  purple: "text-purple-600",
};

export default function StatCard({ value, label, variant = "blue" }) {
  const valueColor = valueColors[variant] || valueColors.blue;

  return (
    <div className="text-center p-2.5 bg-gray-50 rounded-lg">
      <span className={`block text-lg font-bold ${valueColor}`}>{value}</span>
      <span className="block text-xs text-gray-600 mt-1">{label}</span>
    </div>
  );
}
