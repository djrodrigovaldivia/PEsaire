import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp modern SVG: Sage background, warm white balance plate, delicate cat paw mark and clean dial
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5B8278"/>
      <stop offset="100%" stop-color="#3D5A53"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#1B2B27" flood-opacity="0.25"/>
    </filter>
  </defs>
  
  <!-- Base background rounded squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  
  <!-- Subtle inner ambient ring -->
  <circle cx="256" cy="256" r="190" stroke="#CAD8D3" stroke-opacity="0.2" stroke-width="2" fill="none"/>
  
  <!-- Scale Body / Weighing Platform -->
  <g filter="url(#shadow)">
    <!-- Platform base plate -->
    <rect x="116" y="324" width="280" height="42" rx="21" fill="#FAF7F2"/>
    <rect x="196" y="366" width="120" height="14" rx="7" fill="#E4DCD3"/>

    <!-- Pedestal pillar -->
    <rect x="244" y="220" width="24" height="104" rx="12" fill="#E4DCD3"/>

    <!-- Measurement Dial / Disc -->
    <circle cx="256" cy="210" r="82" fill="#FAF7F2"/>
    <circle cx="256" cy="210" r="72" stroke="#E4DCD3" stroke-width="2" fill="none"/>

    <!-- Subtle scale tick marks -->
    <path d="M 256 142 L 256 150" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>
    <path d="M 210 162 L 216 168" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>
    <path d="M 302 162 L 296 168" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>
    <path d="M 188 210 L 196 210" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>
    <path d="M 324 210 L 316 210" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>

    <!-- Cute delicate cat paw mark in center of scale dial -->
    <!-- Main pad -->
    <ellipse cx="256" cy="222" rx="20" ry="16" fill="#52796F"/>
    <!-- 4 Toe beans -->
    <ellipse cx="236" cy="196" rx="6" ry="8" transform="rotate(-18 236 196)" fill="#E07A5F"/>
    <ellipse cx="249" cy="190" rx="6" ry="8.5" transform="rotate(-6 249 190)" fill="#52796F"/>
    <ellipse cx="263" cy="190" rx="6" ry="8.5" transform="rotate(6 263 190)" fill="#52796F"/>
    <ellipse cx="276" cy="196" rx="6" ry="8" transform="rotate(18 276 196)" fill="#E07A5F"/>
  </g>
</svg>`;

// Maskable icon with 15% safe padding
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5B8278"/>
      <stop offset="100%" stop-color="#3D5A53"/>
    </linearGradient>
  </defs>
  <!-- Full bleed background -->
  <rect width="512" height="512" fill="url(#bgm)"/>
  
  <!-- Scaled down to safe zone (80% scale centered) -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <g>
      <!-- Platform base plate -->
      <rect x="116" y="324" width="280" height="42" rx="21" fill="#FAF7F2"/>
      <rect x="196" y="366" width="120" height="14" rx="7" fill="#E4DCD3"/>

      <!-- Pedestal pillar -->
      <rect x="244" y="220" width="24" height="104" rx="12" fill="#E4DCD3"/>

      <!-- Measurement Dial / Disc -->
      <circle cx="256" cy="210" r="82" fill="#FAF7F2"/>
      <circle cx="256" cy="210" r="72" stroke="#E4DCD3" stroke-width="2" fill="none"/>

      <!-- Scale tick marks -->
      <path d="M 256 142 L 256 150" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>
      <path d="M 210 162 L 216 168" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>
      <path d="M 302 162 L 296 168" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>
      <path d="M 188 210 L 196 210" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>
      <path d="M 324 210 L 316 210" stroke="#718E86" stroke-width="3" stroke-linecap="round"/>

      <!-- Cat paw mark -->
      <ellipse cx="256" cy="222" rx="20" ry="16" fill="#52796F"/>
      <ellipse cx="236" cy="196" rx="6" ry="8" transform="rotate(-18 236 196)" fill="#E07A5F"/>
      <ellipse cx="249" cy="190" rx="6" ry="8.5" transform="rotate(-6 249 190)" fill="#52796F"/>
      <ellipse cx="263" cy="190" rx="6" ry="8.5" transform="rotate(6 263 190)" fill="#52796F"/>
      <ellipse cx="276" cy="196" rx="6" ry="8" transform="rotate(18 276 196)" fill="#E07A5F"/>
    </g>
  </g>
</svg>`;

async function main() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon);

  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(Buffer.from(svgMaskable))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('Successfully generated all PWA icons.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
