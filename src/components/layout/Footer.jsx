import { Link } from 'react-router-dom';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <Container>
        <div className="py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#7F1734"/>
              <path d="M8 12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-8z" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="13" cy="14" r="2" stroke="#fff" strokeWidth="1.5"/>
              <path d="M8 20l4.5-4.5a2 2 0 0 1 2.8 0L20 20" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-semibold text-text-primary">Pixora</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-text-secondary" aria-label="Footer navigation">
            <Link to="/explore" className="hover:text-text-primary transition-colors">Explore</Link>
            <Link to="/collections" className="hover:text-text-primary transition-colors">Collections</Link>
            <Link to="/saved" className="hover:text-text-primary transition-colors">Saved</Link>
            <Link to="/about" className="hover:text-text-primary transition-colors">About</Link>
          </nav>

          {/* Attribution */}
          <p className="text-xs text-text-muted">
            Powered by{' '}
            <a
              href="https://unsplash.com/?utm_source=pixora&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors underline underline-offset-2"
            >
              Unsplash
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
