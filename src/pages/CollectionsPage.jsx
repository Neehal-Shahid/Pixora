import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import CategoryCard from '../components/ui/CategoryCard';
import { CATEGORIES } from '../constants';
import { getRandomPhotos } from '../api/unsplash';
import SEO from '../components/seo/SEO';

export default function CollectionsPage() {
  const [coverImages, setCoverImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCovers() {
      setLoading(true);
      try {
        // Fetch one random image for each category
        const results = await Promise.all(
          CATEGORIES.map(async (cat) => {
            try {
              const photos = await getRandomPhotos(1, cat.query);
              return { slug: cat.slug, url: photos[0]?.urls?.small };
            } catch {
              return { slug: cat.slug, url: null };
            }
          })
        );

        if (!cancelled) {
          const map = {};
          results.forEach(({ slug, url }) => { map[slug] = url; });
          setCoverImages(map);
        }
      } catch {
        // Non-critical — categories show without images
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCovers();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <SEO title="Collections" description="Explore images by category. Find exactly what inspires you." />
      <section className="mt-8 mb-10">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Collections</h1>
          <p className="text-text-secondary">
            Explore images by category. Find exactly what inspires you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              coverUrl={coverImages[category.slug] || null}
            />
          ))}
        </div>
      </Container>
    </section>
    </>
  );
}
