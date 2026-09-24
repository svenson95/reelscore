const { cp, mkdir, writeFile } = require('node:fs/promises');

const outputDir = 'apps/api/.vercel/output';
const functionDir = `${outputDir}/functions/api.func`;

async function main() {
  await mkdir(functionDir, { recursive: true });

  await cp('dist/apps/api-vercel/index.cjs', `${functionDir}/index.cjs`);

  await writeFile(
    `${functionDir}/.vc-config.json`,
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
    `${outputDir}/config.json`,
    JSON.stringify(
      {
        version: 3,
        routes: [
          {
            src: '/.*',
            dest: '/api',
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
