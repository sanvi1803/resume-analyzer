/**
 * Reusable Badge component for displaying tags, skills, keywords, etc.
 *
 * @param {string} children - The text content of the badge
 * @param {string} variant - Color variant: 'green', 'amber', 'red', 'blue', 'purple', 'gray'
 * @param {string} size - Size: 'xs', 'sm', 'md'
 * @param {boolean} solid - If true, uses solid background color instead of light
 * @param {boolean} rounded - If true, uses fully rounded (pill) style
 * @param {string} className - Additional CSS classes
 */
const colorVariants = {
  green: {
    light: "bg-green-100 text-green-900",
    solid: "bg-green-600 text-white",
  },
  amber: {
    light: "bg-amber-100 text-amber-900",
    solid: "bg-amber-500 text-white",
  },
  red: {
    light: "bg-red-100 text-red-900",
    solid: "bg-red-600 text-white",
  },
  blue: {
    light: "bg-blue-100 text-blue-700",
    solid: "bg-blue-600 text-white",
  },
  purple: {
    light: "bg-purple-100 text-purple-700",
    solid: "bg-purple-600 text-white",
  },
  gray: {
    light: "bg-gray-200 text-gray-700",
    solid: "bg-gray-600 text-white",
  },
};

const sizeVariants = {
  xs: "px-2 py-0.5 text-xs",
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-sm",
};

export default function Badge({
  children,
  variant = "green",
  size = "sm",
  solid = false,
  rounded = false,
  className = "",
}) {
  const colorClass =
    colorVariants[variant]?.[solid ? "solid" : "light"] ||
    colorVariants.gray.light;
  const sizeClass = sizeVariants[size] || sizeVariants.sm;
  const roundedClass = rounded ? "rounded-full" : "rounded";

  return (
    <span
      className={`inline-block font-medium ${colorClass} ${sizeClass} ${roundedClass} ${className}`}
    >
      {children}
    </span>
  );
}
