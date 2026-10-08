// Usage: node resize-logos.script.js

const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const baseSize = 14;
const maximumConcurrentFiles = 4;

const sizes = [
  { scale: 1, size: baseSize },
  { scale: 2, size: baseSize * 2 },
  { scale: 3, size: baseSize * 3 },
];

const inputDir = './team-logo';
const outputBaseDir = `./team-logo-responsive/${baseSize}x${baseSize}`;

const createOutputPath = (file, scale, outputDir) => {
  const parsed = path.parse(file);
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

async function processImages(
  sourceDirectory = inputDir,
  destinationDirectory = outputBaseDir
) {
  const files = fs.readdirSync(sourceDirectory);
  const fileBatches = [];

  for (
    let startIndex = 0;
    startIndex < files.length;
    startIndex += maximumConcurrentFiles
  ) {
    fileBatches.push(
      files.slice(startIndex, startIndex + maximumConcurrentFiles)
    );
  }

  const processFile = async (file) => {
    const inputPath = path.join(sourceDirectory, file);
    const stat = fs.statSync(inputPath);

    if (!stat.isFile()) return;

    try {
      await Promise.all(
        sizes.map(async ({ scale, size }) => {
          const { outputDir, outputPath } = createOutputPath(
            file,
            scale,
            destinationDirectory
          );

          fs.mkdirSync(outputDir, { recursive: true });

          await resizeLogo(inputPath, outputPath, size);
        })
      );

      console.log(`✓ ${file}`);
    } catch (err) {
      console.error(`Error at ${file}:`, err.message);
    }
  };

  const processBatches = async (batches) => {
    const [batch, ...remainingBatches] = batches;

    if (!batch) return;

    await Promise.all(batch.map(processFile));
    await processBatches(remainingBatches);
  };

  await processBatches(fileBatches);

  console.log('Done.');
}

const runCli = (run = processImages) =>
  run().catch((error) => {
    console.error('Failed to process logo images:', error);
    process.exitCode = 1;
  });

const runWhenInvokedAsScript = (
  isMain = require.main === module,
  run = processImages
) => (isMain ? runCli(run) : Promise.resolve());

void runWhenInvokedAsScript();

module.exports = { processImages, runCli, runWhenInvokedAsScript };
