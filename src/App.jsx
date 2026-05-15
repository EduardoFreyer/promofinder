import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import RecentSearches from './components/RecentSearches';
import ProductCard from './components/ProductCard';
import PriceChart from './components/PriceChart';
import SkeletonGrid from './components/SkeletonGrid';
import './index.css';

const SOURCES = [
  { key: 'all', label: 'Todos' },
  { key: 'mercadolivre', label: '🟡 Mercado Livre' },
  { key: 'buscape', label: '🟠 Buscapé' },
  { key: 'zoom', label: '🟣 Zoom' },
];

function App() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sourceFilter, setSourceFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('promo_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches');
      }
    }
  }, []);

  const saveRecentSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    const term = searchQuery.trim();
    let updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())];
    updated = updated.slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('promo_recent_searches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('promo_recent_searches');
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    setLoading(true);
    setSearched(true);
    setSourceFilter('all');
    saveRecentSearch(searchQuery);

    try {
      const response = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar produtos. Verifique se o backend está rodando em localhost:8000.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = sourceFilter === 'all'
    ? products
    : products.filter(p => p.source === sourceFilter);

  const sourceCounts = products.reduce((acc, p) => {
    acc[p.source] = (acc[p.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <header>
        <h1>PromoFinder</h1>
        <p>Compare preços do Mercado Livre, Buscapé e Zoom em um só lugar.</p>
      </header>

      <main>
        <SearchBar initialValue={query} onSearch={handleSearch} loading={loading} />
        
        {recentSearches.length > 0 && !loading && (
          <RecentSearches 
            searches={recentSearches} 
            onSelect={handleSearch}
            onClear={clearRecentSearches}
          />
        )}

        {loading && <SkeletonGrid count={8} />}

        {!loading && searched && products.length === 0 && (
          <div className="empty-state">
            <h2>Nenhum produto encontrado</h2>
            <p>Tente buscar com termos diferentes ou mais genéricos.</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <>
            <div className="results-bar">
              <div className="results-count">
                <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
                {sourceFilter !== 'all' && (
                  <span> em {SOURCES.find(s => s.key === sourceFilter)?.label}</span>
                )}
              </div>
              <div className="source-filters">
                {SOURCES.map(s => (
                  (s.key === 'all' || sourceCounts[s.key]) && (
                    <button
                      key={s.key}
                      className={`source-filter-btn ${sourceFilter === s.key ? 'active' : ''}`}
                      onClick={() => setSourceFilter(s.key)}
                    >
                      {s.label} {s.key !== 'all' && `(${sourceCounts[s.key] || 0})`}
                    </button>
                  )
                ))}
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                  onViewHistory={() => setSelectedProduct(product)} 
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>PromoFinder © {new Date().getFullYear()} — Comparador de preços inteligente</p>
      </footer>

      {selectedProduct && (
        <PriceChart 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}

export default App;
