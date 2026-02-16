import { BadgeSection, BadgeList } from "../components/ui";

/**
 * Section Types:
 * - badgeSection: Simple badge list
 * - badgeGroup: Multiple badge sub-sections under one title
 * - listItems: Items with word/suggestion/meta
 * - statsBox: Stats with optional list
 * - suggestionList: Suggestion cards
 * - objectBadges: Iterate object, show arrays as badge groups
 */

// Helper to get nested value from path like "skills.detected"
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

// Badge Section Renderer
const BadgeSectionRenderer = ({ config, results }) => {
  const items = getNestedValue(results, config.dataPath);
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <BadgeSection
      title={config.title}
      items={items}
      variant={config.variant || "green"}
      rounded={config.rounded}
      showCount={config.showCount ?? true}
      headingSize={config.headingSize || "sm"}
      getLabel={config.getLabel}
      className={config.className || "mb-4"}
    />
  );
};

// Badge Group Renderer (multiple sub-sections under one title)
const BadgeGroupRenderer = ({ config, results }) => {
  const parentData = getNestedValue(results, config.dataPath);
  if (!parentData) return null;

  const hasData = config.sections.some((section) => {
    const items = getNestedValue(results, section.dataPath);
    return Array.isArray(items) && items.length > 0;
  });

  if (!hasData) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {config.title}
      </h2>
      {config.stats && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          {config.stats.map((stat, idx) => (
            <p key={idx} className="text-gray-700">
              {stat.label}:{" "}
              <span className="font-semibold text-blue-600">
                {getNestedValue(results, stat.dataPath)}
                {stat.suffix || ""}
              </span>
            </p>
          ))}
        </div>
      )}
      {config.sections.map((section, idx) => (
        <BadgeSectionRenderer key={idx} config={section} results={results} />
      ))}
    </div>
  );
};

// List Items Renderer (word + suggestion + meta)
const ListItemsRenderer = ({ config, results }) => {
  const items = getNestedValue(results, config.dataPath);
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {config.title} ({items.length})
      </h2>
      <div className="space-y-2">
        {items.map((item, idx) => {
          const label =
            typeof item === "string"
              ? item
              : item[config.labelKey] || item.word || item.keyword;
          const suggestion =
            typeof item === "object" ? item[config.suggestionKey] : null;
          const meta =
            typeof item === "object" && config.metaKey
              ? item[config.metaKey]
              : null;

          return (
            <div
              key={idx}
              className={`${config.itemStyle || "bg-gray-50 border border-gray-200 rounded-lg p-3"} flex justify-between items-center`}
            >
              <div className="flex-1">
                <span className="font-medium text-gray-900">{label}</span>
                {suggestion && (
                  <p className="text-sm text-gray-600 mt-1">{suggestion}</p>
                )}
              </div>
              {meta !== null && meta !== undefined && (
                <span
                  className={`text-sm font-semibold ${config.metaColor || "text-red-600"} ml-4`}
                >
                  {config.metaFormat ? config.metaFormat(meta) : meta}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// List Items with Border (like Missing Keywords)
const BorderedListRenderer = ({ config, results }) => {
  const items = getNestedValue(results, config.dataPath);
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className={config.className || ""}>
      <h3 className="font-semibold text-gray-900 mb-2">{config.title}</h3>
      <div className="space-y-2">
        {items.map((item, idx) => {
          const label =
            typeof item === "string"
              ? item
              : item[config.labelKey] || item.keyword;
          const suggestion =
            typeof item === "object" ? item[config.suggestionKey] : null;

          return (
            <div
              key={idx}
              className={`border-l-4 ${config.borderColor || "border-orange-400"} pl-3 py-1`}
            >
              <p className="text-gray-700 text-sm font-medium">{label}</p>
              {suggestion && (
                <p className="text-gray-600 text-sm">{suggestion}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Stats Box Renderer (score + bullets + improvements list)
const StatsBoxRenderer = ({ config, results }) => {
  const data = getNestedValue(results, config.dataPath);
  if (!data) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {config.title}
      </h2>
      <div
        className={`${config.boxStyle || "bg-blue-50 border border-blue-200"} rounded-lg p-4`}
      >
        {config.stats.map((stat, idx) => (
          <p key={idx} className="text-gray-700 mb-2">
            {stat.label}:{" "}
            <span className={`font-semibold ${stat.color || "text-blue-600"}`}>
              {getNestedValue(results, stat.dataPath)}
              {stat.suffix || ""}
            </span>
          </p>
        ))}
        {config.listPath && (
          <ListSection
            items={getNestedValue(results, config.listPath)}
            title={config.listTitle}
          />
        )}
      </div>
    </div>
  );
};

// Helper for stats box list
const ListSection = ({ items, title }) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="font-semibold text-gray-900 mb-2">{title}:</p>
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="text-gray-700 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Suggestion List Renderer
const SuggestionListRenderer = ({ config, results, SuggestionCard }) => {
  const items = getNestedValue(results, config.dataPath);
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {config.title} ({items.length})
      </h2>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <SuggestionCard
            key={idx}
            item={item}
            renderContent={(item) => (
              <>
                <p className="text-gray-700">
                  {typeof item === "string"
                    ? item
                    : item[config.suggestionKey] || item.suggestion}
                </p>
                {typeof item === "object" && item[config.labelKey] && (
                  <p className="text-sm text-gray-600 mt-2">
                    {config.labelDisplay || "Word"}:{" "}
                    <span className="font-medium">{item[config.labelKey]}</span>
                  </p>
                )}
              </>
            )}
          />
        ))}
      </div>
    </div>
  );
};

// Object Badges Renderer (Industry Insights style)
const ObjectBadgesRenderer = ({ config, results }) => {
  const data = getNestedValue(results, config.dataPath);
  if (!data || Object.keys(data).length === 0) return null;

  const hasValidData = Object.values(data).some(
    (v) => Array.isArray(v) && v.length > 0,
  );
  if (!hasValidData) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {config.title}
      </h2>
      <div className="space-y-4">
        {Object.entries(data).map(
          ([key, value]) =>
            Array.isArray(value) &&
            value.length > 0 && (
              <div
                key={key}
                className={`${config.itemStyle || "bg-purple-50 border border-purple-200"} rounded-lg p-4`}
              >
                <p className="font-semibold text-gray-900 capitalize mb-2">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <BadgeList
                  items={value}
                  variant={config.variant || "purple"}
                  rounded={config.rounded}
                  size={config.size || "sm"}
                />
              </div>
            ),
        )}
      </div>
    </div>
  );
};

// Main Section Renderer
export const SectionRenderer = ({ config, results, SuggestionCard }) => {
  switch (config.type) {
    case "badgeSection":
      return <BadgeSectionRenderer config={config} results={results} />;
    case "badgeGroup":
      return <BadgeGroupRenderer config={config} results={results} />;
    case "listItems":
      return <ListItemsRenderer config={config} results={results} />;
    case "borderedList":
      return <BorderedListRenderer config={config} results={results} />;
    case "statsBox":
      return <StatsBoxRenderer config={config} results={results} />;
    case "suggestionList":
      return (
        <SuggestionListRenderer
          config={config}
          results={results}
          SuggestionCard={SuggestionCard}
        />
      );
    case "objectBadges":
      return <ObjectBadgesRenderer config={config} results={results} />;
    default:
      return null;
  }
};

// Export individual renderers for custom use
export {
  BadgeSectionRenderer,
  BadgeGroupRenderer,
  ListItemsRenderer,
  BorderedListRenderer,
  StatsBoxRenderer,
  SuggestionListRenderer,
  ObjectBadgesRenderer,
  getNestedValue,
};
