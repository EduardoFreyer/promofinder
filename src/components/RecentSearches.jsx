import { Clock, X } from 'lucide-react';

export default function RecentSearches({ searches, onSelect, onClear }) {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="recent-searches" id="recent-searches">
      <span className="recent-searches-label">
        <Clock size={14} /> Recentes:
      </span>
      {searches.map((search, idx) => (
        <button
          key={idx}
          className="recent-chip"
          onClick={() => onSelect(search)}
          id={`recent-chip-${idx}`}
        >
          {search}
        </button>
      ))}
      <button
        className="recent-clear-btn"
        onClick={onClear}
        title="Limpar histórico"
        id="clear-recent-btn"
      >
        <X size={14} />
      </button>
    </div>
  );
}
