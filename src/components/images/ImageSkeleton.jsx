export default function ImageSkeleton({ count = 8 }) {
  // Vary aspect ratios to mimic real masonry content
  const ratios = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-[1/1]', 'aspect-[3/2]', 'aspect-[2/3]', 'aspect-[4/5]', 'aspect-[16/9]', 'aspect-[3/4]'];

  const skeletons = Array.from({ length: count }, (_, i) => ({
    id: i,
    ratio: ratios[i % ratios.length],
  }));

  // Distribute into columns (simplified)
  const columnCount = typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4;
  const columns = Array.from({ length: columnCount }, () => []);
  skeletons.forEach((sk, i) => {
    columns[i % columnCount].push(sk);
  });

  return (
    <div className="flex gap-4" aria-hidden="true" role="presentation">
      {columns.map((col, colIndex) => (
        <div key={colIndex} className="flex-1 min-w-0">
          {col.map((sk) => (
            <div
              key={sk.id}
              className={`skeleton rounded-lg mb-4 ${sk.ratio}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
