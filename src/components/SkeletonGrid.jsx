export default function SkeletonGrid({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i} style={{ animationDelay: `${i * 80}ms` }}>
          <div className="skeleton-thumbnail" />
          <div className="skeleton-body">
            <div className="skeleton-line w-full" />
            <div className="skeleton-line w-3-4" />
            <div className="skeleton-line w-1-2" />
            <div className="skeleton-line w-2-3" style={{ marginTop: '0.5rem' }} />
            <div className="skeleton-price" />
          </div>
        </div>
      ))}
    </div>
  );
}
