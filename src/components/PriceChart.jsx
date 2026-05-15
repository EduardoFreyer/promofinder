import { useEffect, useState, useMemo } from 'react';
import { X, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceChart({ product, onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const encodedUrl = encodeURIComponent(product.url || '');
        const source = encodeURIComponent(product.source || '');
        const response = await fetch(
          `http://localhost:8000/api/history/${product.id}?months=6&url=${encodedUrl}&source=${source}`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const historyData = await response.json();

        const formatted = historyData.map(item => {
          const date = new Date(item.date);
          return {
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            fullDate: date.toLocaleDateString('pt-BR'),
            price: item.price,
          };
        });

        // Add current price if new
        if (formatted.length === 0 || formatted[formatted.length - 1].price !== product.price) {
          formatted.push({
            date: 'Hoje',
            fullDate: new Date().toLocaleDateString('pt-BR'),
            price: product.price,
          });
        }

        setData(formatted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [product]);

  // Compute stats
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const trend = prices.length >= 2
      ? prices[prices.length - 1] - prices[0]
      : 0;
    return { min, max, avg, trend };
  }, [data]);

  const formatBRL = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '10px 14px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          color: 'var(--text-primary)',
        }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {payload[0].payload.fullDate}
          </p>
          <p style={{ margin: '4px 0 0', fontWeight: 700, color: 'var(--accent-light)', fontSize: '1.05rem' }}>
            {formatBRL(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const TrendIcon = () => {
    if (!stats) return null;
    if (stats.trend < -1) return <TrendingDown size={16} style={{ color: 'var(--success)' }} />;
    if (stats.trend > 1) return <TrendingUp size={16} style={{ color: 'var(--danger)' }} />;
    return <Minus size={16} style={{ color: 'var(--text-muted)' }} />;
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} id="price-chart-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} id="modal-close-btn">
          <X size={20} />
        </button>

        <h2 className="modal-title">
          Histórico de Preços <TrendIcon />
        </h2>
        <p className="modal-subtitle">{product.title}</p>

        {/* Stats Row */}
        {!loading && stats && data.length > 1 && (
          <div className="price-stats">
            <div className="price-stat">
              <div className="price-stat-label">Mínimo</div>
              <div className="price-stat-value min">{formatBRL(stats.min)}</div>
            </div>
            <div className="price-stat">
              <div className="price-stat-label">Médio</div>
              <div className="price-stat-value avg">{formatBRL(stats.avg)}</div>
            </div>
            <div className="price-stat">
              <div className="price-stat-label">Máximo</div>
              <div className="price-stat-value max">{formatBRL(stats.max)}</div>
            </div>
          </div>
        )}

        <div className="chart-container">
          {loading ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
              <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
              </svg>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Carregando histórico...</p>
            </div>
          ) : data.length <= 1 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.95rem' }}>Poucos dados registrados ainda.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                O gráfico será construído com suas buscas futuras.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#4b5563"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#4b5563"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `R$${val}`}
                  domain={['auto', 'auto']}
                  width={72}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#a78bfa"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  activeDot={{ r: 5, fill: '#c084fc', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
