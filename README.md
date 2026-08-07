# reelscore

Football livescore web application with a focus on match predictions and team form ratings.

The project is organized as an [Nx](https://nx.dev) monorepo and contains the reelscore frontend and API.

## Tech Stack

### Client

- Angular
- Angular Material
- Tailwind

### API

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

### Tooling

- Nx
- GitHub Actions

## Data Source

Football data is provided by [API-Football](https://www.api-football.com/) through RapidAPI.

This project does not fetch data directly from API-Football and only reads data from its own database.

## Project Structure

The main applications are located under `apps/`:

```text
apps/
├── api/
└── client/
```

Shared models, helper and constants are stored under `lib/`:

```text
lib/
├── models/
└── shared/
```

Additional project documentation and architectural decisions are stored under:

```text
docs/
└── decisions/
```

Reusable libraries and shared models are managed within the Nx workspace.

## Hosting

The client and API are both hosted on Vercel.

The Angular client is built and deployed as a static web application. The Node.js/Express API is deployed as Vercel Serverless Functions and provides access to the reelscore database for the client.

## Requirements

- Node.js
- npm

Install all dependencies:

```bash
npm install
```

## Development

### Start client and API

To start both applications in parallel:

```bash
npm run dev
```

Alternatively:

```bash
npx nx run-many --parallel --target=serve --projects=api,client
```

### Start client

```bash
npx nx serve client
```

The exact local URL depends on the configured Angular development server.

### Start API

```bash
npx nx serve api
```

## Build

### Build client

```bash
npx nx build client
```

### Build API

```bash
npx nx build api
```

Build artifacts are written to the Nx output directory, usually:

```text
dist/
```

### Build all applications

```bash
npx nx run-many -t build -p client api
```

## Testing

Run tests for a specific project:

```bash
npx nx test <project>
```

Example:

```bash
npx nx test client
```

Run tests for multiple projects:

```bash
npx nx run-many -t test
```

### End-to-End Tests

> Add the final E2E commands here once the Playwright setup has been finalized.

Example:

```bash
npx nx e2e <project>
```

## Environment Variables

The applications require environment-specific configuration.

```env
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_CLUSTER=
MONGODB_DATABASE=
```

## Scripts

Project-specific utility scripts are used for maintenance tasks such as downloading and processing team and competition logos.

Scripts should be executed deliberately and their generated output should be reviewed before replacing existing assets.

### Resize new/updated team and competition logos

We use responsive logo variants for team and competition images.

The logo resize script creates multiple PNG variants of every source image.

Example sizes for 14x14 images:

| Variant | Size       |
| ------- | ---------- |
| `@1x`   | 14 × 14 px |
| `@2x`   | 28 × 28 px |
| `@3x`   | 42 × 42 px |

The generated images preserve their aspect ratio and are placed inside a transparent square canvas.

Run inside `apps/client/src/assets/images`:

```bash
node resize-logos.script.js
```

The script expects the source images in:

```text
./team-logo/
```

or

```text
./competition/
```

Generated files are written to, for example:

```text
./team-logo-responsive/14x14/
```

The images are resized using `sharp` with `fit: contain` and a transparent background.

#### Usage resize-logos

1. Download the team & competition logos and move them to the expected input directory.

2. Run the logo processing script.

3. Move the approved generated files from the output directory into the appropriate asset directory, for example the team-logo-responsive/14x14/ directory.

4. Inspect the git changes & compare updated logos with the currently used assets.

5. Keep the existing logo when it has better visual quality.

   For example, an older logo may have a proper transparent background while a newly provided version does not.

Generated files should therefore **not automatically replace existing assets**.

### Generate Xcode Assets

The `generate_xcassets.py` script converts prepared PNG images into Xcode-compatible `.imageset` directories.

Each generated image set contains the available `1x`, `2x` and `3x` variants as well as the required `Contents.json` file.

#### Script requirements

- Python 3
- Prepared PNG files following the Xcode scale naming convention:

```text
1@1x.png
1@2x.png
1@3x.png
```

The part before `@` is used as the team or asset ID.

#### Usage generate_xcassets

```bash
python3 generate_xcassets.py <input_dir> <output_dir> [prefix]
```

Example:

```bash
python3 generate_xcassets.py \
  ./team-logo-responsive/14x14 \
  ./output \
  team_logo_14x14
```

The `prefix` argument is optional and defaults to `team`.

For the example above, files such as:

```text
1@1x.png
1@2x.png
1@3x.png
```

are converted into:

```text
output/
└── team_logo_14x14_1.imageset/
    ├── team_logo_14x14_1.png
    ├── team_logo_14x14_1@2x.png
    ├── team_logo_14x14_1@3x.png
    └── Contents.json
```

The generated `.imageset` directories can then be copied into the corresponding Xcode `Assets.xcassets` asset catalog.

> [!NOTE]
> The script recursively searches the input directory for `.png` files. Files that do not follow the `<id>@<scale>.png` naming convention are skipped.
> [!WARNING]
> If an `.imageset` with the same generated name already exists in the output directory, it is deleted and recreated.

The script also reports missing `1x`, `2x` or `3x` variants in the console. Review these warnings before copying the generated assets into Xcode.

## Nx Commands

Nx tasks follow this general syntax:

```bash
npx nx <target> <project> <options>
```

Examples:

```bash
npx nx serve client
npx nx build client
npx nx test client
```

Run a target for multiple projects:

```bash
npx nx run-many -t <target> -p <project1> <project2>
```

Example:

```bash
npx nx run-many -t build -p client api
```

## Project Graph

Nx can visualize dependencies between applications and libraries:

```bash
npx nx graph
```

This opens the interactive Nx project graph in the browser.

## Code Quality

Run linting:

```bash
npx nx lint <project>
```

Or for multiple projects:

```bash
npx nx run-many -t lint
```

Formatting and linting should be checked before creating a pull request.

## Versions (as of August 7, 2026)

| Technology       | Version |
| ---------------- | ------- |
| Node.js          | `22.x`  |
| Nx               | `22.x`  |
| Angular          | `21.x`  |
| Angular Material | `21.x`  |
| NgRx             | `21.x`  |
| Tailwind CSS     | `3.x`   |
| Express          | `4.x`   |
| Mongoose         | `8.x`   |
| TypeScript       | `5.x`   |

## Documentation

Technical decisions that affect the architecture or long-term development of ReelScore are documented under:

```text
docs/decisions/
```

These documents should explain significant decisions and their reasoning rather than implementation tasks or temporary development notes.
