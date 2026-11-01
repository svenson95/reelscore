const { cp, mkdir, rm, writeFile } = require('node:fs/promises');
const { resolve } = require('node:path');

const repositoryRoot = resolve(__dirname, '../../..');
const projectRoot = resolve(__dirname, '..');
const clientDistDir = resolve(repositoryRoot, 'dist/apps/client');
const outputDir = resolve(repositoryRoot, '.vercel/output');
const functionDir = resolve(outputDir, 'functions/ssr.func');

const responseHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://media.api-sports.io; font-src 'self' data:; connect-src 'self' https://reelscore-api.vercel.app https://media.api-sports.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
};

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(functionDir, { recursive: true });

  await cp(resolve(clientDistDir, 'browser'), resolve(outputDir, 'static'), {
    recursive: true,
  });
  await cp(resolve(clientDistDir, 'server'), resolve(functionDir, 'server'), {
    recursive: true,
  });
  await cp(resolve(clientDistDir, 'browser'), resolve(functionDir, 'browser'), {
    recursive: true,
  });
  await cp(
    resolve(projectRoot, 'vercel/ssr-handler.cjs'),
    resolve(functionDir, 'index.cjs')
  );

  await writeFile(
    resolve(functionDir, '.vc-config.json'),
    JSON.stringify(
      {
        runtime: 'nodejs24.x',
        handler: 'index.cjs',
        launcherType: 'Nodejs',
      },
      null,
      2
    )
  );

  await writeFile(
    resolve(outputDir, 'config.json'),
    JSON.stringify(
      {
        version: 3,
        routes: [
          {
            src: '/(.*)',
            headers: responseHeaders,
            continue: true,
          },
          {
            src: '^/ngsw-worker\\.js$',
            headers: {
              'Cache-Control': 'public, max-age=0, must-revalidate',
            },
            continue: true,
          },
          {
            src: '^/ngsw\\.json$',
            headers: {
              'Cache-Control': 'public, max-age=0, must-revalidate',
            },
            continue: true,
          },
          {
            src: '^/manifest\\.webmanifest$',
            headers: {
              'Cache-Control': 'public, max-age=0, must-revalidate',
            },
            continue: true,
          },
          {
            src: '^/$',
            dest: '/ssr',
          },
          {
            src: '/(.*)',
            dest: '/ssr',
            check: true,
          },
        ],
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
