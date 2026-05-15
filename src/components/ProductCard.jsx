import { Star, Truck, ExternalLink, Activity, TrendingDown, Tag, Package, Heart } from 'lucide-react';

const SOURCE_MAP = {
  mercadolivre: { label: 'Mercado Livre', class: 'source-mercadolivre' },
  buscape: { label: 'Buscapé', class: 'source-buscape' },
  zoom: { label: 'Zoom', class: 'source-zoom' },
};

export default function ProductCard({ product, onViewHistory, index = 0 }) {
  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const hasPriceDrop = product.previous_price && product.price < product.previous_price;
  const isNewPromotion = !product.previous_price && product.discount_pct && product.discount_pct > 10;
  const sourceInfo = SOURCE_MAP[product.source] || { label: 'Loja', class: '' };
  const isAffiliate = product.source === 'mercadolivre';

  const dropPct = hasPriceDrop
    ? Math.round((1 - product.price / product.previous_price) * 100)
    : 0;

  return (
    <div
      className="product-card"
      style={{ animationDelay: `${index * 60}ms` }}
      id={`product-card-${product.id}`}
    >
      {/* Thumbnail */}
      <div className="product-thumbnail-wrapper">
        {product.thumbnail ? (
          <img
            className="product-thumbnail"
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="product-thumbnail-fallback"
          style={{ display: product.thumbnail ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
        >
          <Package size={48} />
        </div>

        {/* Source badge */}
        <span className={`product-source-badge ${sourceInfo.class}`}>
          {sourceInfo.label}
        </span>

        {/* Promo badges */}
        <div className="product-badge-container">
          {hasPriceDrop && (
            <div className="badge badge-drop">
              <TrendingDown size={11} />
              -{dropPct}%
            </div>
          )}
          {isNewPromotion && (
            <div className="badge badge-new">
              <Tag size={11} />
              Promo
            </div>
          )}
          {product.discount_pct > 0 && !hasPriceDrop && (
            <div className="badge badge-discount">
              {Math.round(product.discount_pct)}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="product-body">
        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>

        <div className="product-seller">
          <span>
            Vendido por <strong>{product.seller_name}</strong>
          </span>
          {product.shipping_free && (
            <span className="free-shipping-tag">
              <Truck size={13} /> Frete Grátis
            </span>
          )}
        </div>

        <div className="product-rating">
          <Star size={13} fill="#fbbf24" color="#fbbf24" />
          <span className="star-value">{product.seller_rating}</span>
        </div>

        {/* Price */}
        <div className="product-price-section">
          {product.original_price && product.original_price > product.price && (
            <div className="product-old-price">{formatPrice(product.original_price)}</div>
          )}
          {hasPriceDrop && !product.original_price && (
            <div className="product-old-price">De: {formatPrice(product.previous_price)}</div>
          )}
          <div className="product-price">{formatPrice(product.price)}</div>
          {product.installments && (
            <div className="product-installments">{product.installments}</div>
          )}
        </div>

        {/* Actions */}
        <div className="product-actions">
          <a
            href={product.url}
            target="_blank"
            rel={isAffiliate ? 'noreferrer sponsored' : 'noreferrer'}
            className="btn-primary"
            id={`view-offer-${product.id}`}
          >
            Ver Oferta <ExternalLink size={14} />
          </a>
          <button
            className="btn-secondary"
            onClick={onViewHistory}
            title="Ver histórico de preços"
            id={`view-history-${product.id}`}
          >
            <Activity size={16} />
          </button>
        </div>
        {isAffiliate && (
          <div className="affiliate-badge" title="Este é um link de afiliado. Ao comprar por este link, você nos ajuda sem custo adicional.">
            <Heart size={10} />
            Link de afiliado
          </div>
        )}
      </div>
    </div>
  );
}
