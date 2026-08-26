// One-off/regenerate script for favicons, app icons, and the social share (OG) image.
// Run with: node scripts/generate-assets.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

const ACCENT = '#7F1734';

const faviconSvg = readFileSync(path.join(publicDir, 'favicon.svg'));

const iconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#7F1734"/>
      <stop offset="1" stop-color="#5A1025"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative rings -->
  <circle cx="1080" cy="90" r="220" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>
  <circle cx="1080" cy="90" r="320" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="2"/>
  <circle cx="60" cy="600" r="180" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>

  <!-- Logo mark -->
  <rect x="100" y="120" width="120" height="120" rx="28" fill="#ffffff"/>
  <path d="M130 175a15 15 0 0 1 15-15h30a15 15 0 0 1 15 15v30a15 15 0 0 1-15 15h-30a15 15 0 0 1-15-15v-30z" stroke="#7F1734" stroke-width="5" fill="none"/>
  <circle cx="148.75" cy="167.5" r="7.5" stroke="#7F1734" stroke-width="5" fill="none"/>
  <path d="M130 197.5l16.9-16.9a7.5 7.5 0 0 1 10.6 0L175 197.5" stroke="#7F1734" stroke-width="5" fill="none" stroke-linecap="round"/>

  <!-- Wordmark -->
  <text x="100" y="330" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="700" fill="#ffffff">Pixora</text>

  <!-- Tagline -->
  <text x="100" y="390" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="400" fill="#f4d9e0">Discover images that inspire</text>

  <!-- URL -->
  <text x="100" y="560" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="500" fill="#ffffff" fill-opacity="0.85">pixora.workwithneehal.com</text>
</svg>
`;

async function run() {
  for (const { size, name } of iconSizes) {
    await sharp(faviconSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`✓ ${name}`);
  }

  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✓ og-image.png');

  console.log(`\nBrand color used: ${ACCENT}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
