import Badge from "./Badge";

/**
 * Reusable BadgeList component for displaying a list of tags/skills/keywords
 *
 * @param {Array} items - Array of strings or objects to display
 * @param {string} variant - Color variant for badges
 * @param {string} size - Size of badges
 * @param {number} maxItems - Maximum items to show before "more" indicator
 * @param {boolean} solid - If true, uses solid background
 * @param {boolean} rounded - If true, uses pill style
 * @param {string} moreVariant - Color variant for the "more" badge
 * @param {Function} getLabel - Function to extract label from item (for objects)
 * @param {string} className - Additional CSS classes for container
 */
export default function BadgeList({
  items = [],
  variant = "green",
  size = "sm",
  maxItems = 5,
  solid = false,
  rounded = false,
  moreVariant = "gray",
  getLabel = (item) =>
    typeof item === "string"
      ? item
      : item?.name || item?.word || item?.keyword || "",
  className = "",
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const visibleItems = maxItems ? items.slice(0, maxItems) : items;
  const remainingCount = maxItems ? items.length - maxItems : 0;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {visibleItems.map((item, idx) => (
        <Badge
          key={idx}
          variant={variant}
          size={size}
          solid={solid}
          rounded={rounded}
        >
          {getLabel(item)}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant={moreVariant} size={size} rounded={rounded}>
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}
