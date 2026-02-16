import BadgeList from "./BadgeList";

/**
 * Reusable section component with heading (with count) and badge list
 *
 * @param {string} title - Section heading text
 * @param {Array} items - Array of items to display as badges
 * @param {string} variant - Badge color variant
 * @param {string} size - Badge size
 * @param {boolean} rounded - Use pill style
 * @param {boolean} solid - Use solid background
 * @param {boolean} showCount - Show item count in heading
 * @param {number} maxItems - Max items to show (null for all)
 * @param {Function} getLabel - Function to extract label from item
 * @param {string} headingSize - Heading size: sm (h3), md (h3 larger), lg (h2)
 * @param {string} className - Additional container classes
 */
export default function BadgeSection({
  title,
  items = [],
  variant = "green",
  size = "sm",
  rounded = false,
  solid = false,
  showCount = true,
  maxItems = null,
  getLabel,
  headingSize = "sm",
  className = "",
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const headingConfig = {
    sm: { tag: "h3", className: "font-semibold text-gray-900 mb-2" },
    md: { tag: "h3", className: "text-lg font-semibold text-gray-900 mb-3" },
    lg: { tag: "h2", className: "text-2xl font-semibold text-gray-900 mb-4" },
  };

  const config = headingConfig[headingSize] || headingConfig.sm;
  const HeadingTag = config.tag;
  const headingText = showCount ? `${title} (${items.length})` : title;

  return (
    <div className={className}>
      <HeadingTag className={config.className}>{headingText}</HeadingTag>
      <BadgeList
        items={items}
        variant={variant}
        size={size}
        rounded={rounded}
        solid={solid}
        maxItems={maxItems}
        getLabel={getLabel}
      />
    </div>
  );
}
