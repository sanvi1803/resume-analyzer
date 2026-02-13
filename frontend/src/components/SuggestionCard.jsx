const SuggestionCard = ({ item, renderContent }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      {renderContent(item)}
    </div>
  );
};

export default SuggestionCard;
