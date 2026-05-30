// Usage: node resize-logos.script.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseSize = 14;

const sizes = [
  { scale: 1, size: baseSize },
  { scale: 2, size: baseSize * 2 },
  { scale: 3, size: baseSize * 3 },
];

const inputDir = './team-logo';
const outputBaseDir = `./team-logo-responsive/${baseSize}x${baseSize}`;

const createOutputPath = (file, scale) => {
  const parsed = path.parse(file);
  const outputDir = outputBaseDir;
  const outputFile = `${parsed.name}@${scale}x.png`;

  return {
    outputDir,
    outputPath: path.join(outputDir, outputFile),
  };
};

const resizeLogo = async (inputPath, outputPath, size) => {
  await sharp(inputPath)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(outputPath);
};

async function processImages() {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const stat = fs.statSync(inputPath);

    if (!stat.isFile()) continue;

    try {
      for (const { scale, size } of sizes) {
        const { outputDir, outputPath } = createOutputPath(file, scale);

        fs.mkdirSync(outputDir, { recursive: true });

        await resizeLogo(inputPath, outputPath, size);
      }

      console.log(`✓ ${file}`);
    } catch (err) {
      console.error(`Error at ${file}:`, err.message);
    }
  }

  console.log('Done.');
}

processImages();
