// Usage: node resize-logos.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = './league';
const outputDir = './league-24x24';

async function processImages() {
  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    const stat = fs.statSync(inputPath);

    if (!stat.isFile()) continue;

    try {
      await sharp(inputPath)
        .resize(48, 48, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          kernel: sharp.kernel.lanczos3,
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ ${file}`);
    } catch (err) {
      console.error(`Error at ${file}:`, err.message);
    }
  }

  console.log('Done.');
}

processImages();
