const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const sharp = require('sharp');

jest.mock('sharp', () => jest.fn());

const {
  processImages,
  runCli,
  runWhenInvokedAsScript,
} = require('./resize-logos.script');

describe('processImages', () => {
  let temporaryDirectory;
  let inputDirectory;
  let outputDirectory;
  let consoleLog;
  let consoleError;
  let previousWorkingDirectory;

  beforeEach(() => {
    previousWorkingDirectory = process.cwd();
    temporaryDirectory = fs.mkdtempSync(
      path.join(os.tmpdir(), 'resize-logos-')
    );
    inputDirectory = path.join(temporaryDirectory, 'input');
    outputDirectory = path.join(temporaryDirectory, 'output');
    fs.mkdirSync(inputDirectory);
    consoleLog = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    sharp.kernel = { lanczos3: 'lanczos3' };

    sharp.mockImplementation((inputPath) => ({
      resize: jest.fn().mockReturnThis(),
      png: jest.fn().mockReturnThis(),
      toFile: jest.fn(async (outputPath) => {
        if (path.basename(inputPath) === 'broken.png') {
          throw new Error('invalid image');
        }

        await fs.promises.writeFile(outputPath, 'resized image');
      }),
    }));
  });

  afterEach(() => {
    process.chdir(previousWorkingDirectory);
    jest.restoreAllMocks();
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it('resizes files in bounded batches and skips directories', async () => {
    for (let index = 0; index < 5; index += 1) {
      fs.writeFileSync(
        path.join(inputDirectory, `logo-${index}.png`),
        'source'
      );
    }
    fs.mkdirSync(path.join(inputDirectory, 'nested'));

    await processImages(inputDirectory, outputDirectory);

    expect(sharp).toHaveBeenCalledTimes(15);
    expect(fs.existsSync(path.join(outputDirectory, 'logo-0@1x.png'))).toBe(
      true
    );
    expect(fs.existsSync(path.join(outputDirectory, 'logo-0@2x.png'))).toBe(
      true
    );
    expect(fs.existsSync(path.join(outputDirectory, 'logo-0@3x.png'))).toBe(
      true
    );
    expect(consoleLog).toHaveBeenCalledWith('Done.');
  });

  it('logs an image processing error and continues with other files', async () => {
    fs.writeFileSync(path.join(inputDirectory, 'broken.png'), 'invalid');
    fs.writeFileSync(path.join(inputDirectory, 'working.png'), 'source');

    await processImages(inputDirectory, outputDirectory);

    expect(consoleError).toHaveBeenCalledWith(
      'Error at broken.png:',
      'invalid image'
    );
    expect(fs.existsSync(path.join(outputDirectory, 'working@1x.png'))).toBe(
      true
    );
    expect(consoleLog).toHaveBeenCalledWith('Done.');
  });

  it('reports an unexpected top-level processing failure', async () => {
    const previousExitCode = process.exitCode;
    const processingError = new Error('input folder is unavailable');

    await runCli(() => Promise.reject(processingError));

    expect(consoleError).toHaveBeenCalledWith(
      'Failed to process logo images:',
      processingError
    );
    expect(process.exitCode).toBe(1);
    process.exitCode = previousExitCode;
  });

  it('runs the processor when called as a command-line script', async () => {
    const run = jest.fn().mockResolvedValue(undefined);

    await runWhenInvokedAsScript(true, run);

    expect(run).toHaveBeenCalledTimes(1);
  });

  it('uses the default asset paths when no paths are provided', async () => {
    const defaultInputDirectory = path.join(temporaryDirectory, 'team-logo');
    const defaultOutputDirectory = path.join(
      temporaryDirectory,
      'team-logo-responsive',
      '14x14'
    );
    fs.mkdirSync(defaultInputDirectory);
    fs.writeFileSync(path.join(defaultInputDirectory, 'default.png'), 'source');
    process.chdir(temporaryDirectory);

    await runCli();

    expect(
      fs.existsSync(path.join(defaultOutputDirectory, 'default@1x.png'))
    ).toBe(true);
    expect(consoleLog).toHaveBeenCalledWith('Done.');
  });
});
