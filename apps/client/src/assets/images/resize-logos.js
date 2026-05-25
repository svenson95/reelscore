// Usage: node resize-logos.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = './team-logo';
const outputDir = './team-logo-responsive/14x14';

async function processImages() {
  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const parsed = path.parse(file);
    const outputFile = `${parsed.name}@1x.png`;
    const outputPath = path.join(outputDir, outputFile);
    const stat = fs.statSync(inputPath);

    if (!stat.isFile()) continue;

    try {
      await sharp(inputPath)
        .resize(14, 14, {
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
