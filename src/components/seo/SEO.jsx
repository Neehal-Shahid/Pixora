import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description }) {
  const defaultTitle = 'Pixora — Discover Beautiful Images';
  const defaultDescription = 'Explore millions of high-quality images from talented photographers around the world.';
  
  return (
    <Helmet>
      <title>{title ? `${title} | Pixora` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
    </Helmet>
  );
}
