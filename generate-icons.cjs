const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateIcons() {
  const inputPath = 'C:/Users/boniv/.gemini/antigravity-ide/brain/8ed45b44-ad04-4f67-a3cd-c10c1ec6340a/antitrader_prohibition_logo_1791583880779.jpg';
  const srcAssetsPath = path.join(__dirname, 'src/assets/logo.png');
  const publicDir = path.join(__dirname, 'public');

  if (!fs.existsSync(inputPath)) {
    console.error('Input image not found:', inputPath);
    return;
  }

  try {
    // Generate src/assets/logo.png for React (hashed by Vite)
    await sharp(inputPath).resize(512, 512).toFile(srcAssetsPath);
    console.log('Created src/assets/logo.png');

    // Generate PWA icons in public/ with -v3 suffix
    const sizes = [
      { name: 'pwa-192x192-v3.png', size: 192 },
      { name: 'pwa-512x512-v3.png', size: 512 },
      { name: 'pwa-maskable-512x512-v3.png', size: 512 },
      { name: 'apple-touch-icon-v3.png', size: 180 },
      { name: 'favicon-v3.png', size: 32 },
    ];

    for (const img of sizes) {
      await sharp(inputPath).resize(img.size, img.size).toFile(path.join(publicDir, img.name));
      console.log(`Created ${img.name}`);
    }
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
