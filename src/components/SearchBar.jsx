import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ initialValue, onSearch, loading }) {
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form className="search-container" onSubmit={handleSubmit} id="search-form">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Busque por um produto... (ex: iPhone 15, TV Samsung 55)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
      </div>
      <button
        id="search-button"
        type="submit"
        className="search-button"
        disabled={loading || !value.trim()}
      >
        <Search size={18} />
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
}
