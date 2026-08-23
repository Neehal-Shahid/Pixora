import Container from '../components/layout/Container';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO title="About" description="Learn about Pixora, a modern image discovery platform." />
      <section className="mt-8 mb-10">
      <Container>
        <div className="max-w-2xl mx-auto py-10">
          <h1 className="text-3xl font-bold text-text-primary mb-6">About Pixora</h1>

          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>
              <strong className="text-text-primary">Pixora</strong> is an image discovery platform
              that helps you find stunning, high-quality photography from talented creators around
              the world. Whether you're looking for inspiration, visual references, or the
              perfect image — Pixora makes it effortless.
            </p>

            <p>
              Search millions of images, explore curated topics, save your favorites, and
              download in full resolution — all in a clean, modern interface designed to
              let the images speak for themselves.
            </p>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Built With</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'React', 'Vite', 'Tailwind CSS', 'React Router',
                  'Unsplash API', 'Context API',
                ].map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-2 px-3 py-2 bg-surface-secondary rounded-lg text-sm text-text-primary"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 7l3 3 5-6"/>
                    </svg>
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Attribution</h2>
              <p>
                All images are provided by{' '}
                <a
                  href="https://unsplash.com/?utm_source=pixora&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
                >
                  Unsplash
                </a>{' '}
                and their amazing community of photographers. Pixora follows Unsplash API
                guidelines, including proper download tracking and photographer attribution.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
              >
                Start Exploring
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 2l5 5-5 5"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
    </>
  );
}
