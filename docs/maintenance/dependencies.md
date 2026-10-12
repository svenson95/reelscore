# Dependency maintenance

Reviewed on October 12, 2026 for `reelscore`, using Node.js 24.21.0 and npm 11.19.0.

## Build and deployment evidence

The previous `main` commit, `7c77e639`, installed and built successfully in [Continuous Deployment #60](https://github.com/svenson95/reelscore/actions/runs/38260324923). Its client `npm ci` step reported 96 findings. Both Vercel deployments consumed prebuilt `.vercel/output` artifacts; their deploy logs do not contain the preceding installation or compilation steps.

The previously observed esbuild deadlock occurred in the restricted local execution environment. An unrestricted build with Node 24 succeeded. [esbuild issue #4503](https://github.com/evanw/esbuild/issues/4503) and [its fix](https://github.com/evanw/esbuild/pull/4506) are not a verified explanation of this workspace's failure: the restricted build also failed with esbuild 0.28.2. No esbuild override is used. Angular 21.2.26 continues to select esbuild 0.28.1 for the client.

## Dependency decisions

- Keep Angular 21, NgRx Signals 21 and TypeScript 5.9. Update the Nx packages together to 23.3.0, which supports Angular 21. This replaces vulnerable Nx dependencies and makes unused webpack, Rspack and Module Federation packages optional.
- Use the official `@angular/build` package for the existing application, development server and i18n targets. Keep their options, configurations, budgets and cache inputs. Remove the unused Nx webpack plugin and its direct dependency; this workspace has no webpack targets or configuration files. See [Angular's build migration guidance](https://angular.dev/tools/cli/build-system-migration).
- Use ESLint 9 and typescript-eslint 8, as required by Nx 23, with native flat configurations. Retain the workspace's import ordering and dependency boundary rules. Correct the newly reported accessibility issues and import ordering instead of suppressing them.
- Declare `@types/express` 4 directly. It previously arrived through Nx; the application's Express 4 types must not depend on a generator's transitive packages.
- Update Jest and its environments to 30.5.2. Jest's `jest-util` package is separately released at 30.5.1. Update the Vercel CLI to 63.1.2 and retain the deployment workflow's commands and flags.
- Remove unused classic NgRx Store, Effects, Entity, Router Store, Component Store, Operators and Store Devtools packages. The application uses `@ngrx/signals`. Remove unused `node-fetch` and `jasmine-marbles`; preserve transitive dependencies required by other tools.
- Apply compatible transitive audit fixes without `npm audit fix --force`. That command's proposed major changes include downgrades of Vercel and Jest; they are not a verified complete or compatible solution.

## Required override

```json
"overrides": {
  "@vercel/container": {
    "tar": "7.5.22"
  }
}
```

Vercel CLI 63.1.2 installs `@vercel/container` 18.0.1, which pins `tar` to 7.5.11. Even this current CLI version therefore retains [critical archive decompression/parse DoS](https://github.com/advisories/GHSA-23hp-3jrh-7fpw) and [high recursive archive filtering DoS](https://github.com/advisories/GHSA-r292-9mhp-454m). Version 7.5.22 is a patched release within the same major and minor version.

The override applies only to `tar` beneath `@vercel/container`. It does not change Angular's esbuild or other dependency families. The resolved lockfile contains only tar 7.5.22, and `npm ls tar --all --package-lock-only` must report no invalid versions.

Remove the override when the selected Vercel CLI resolves the container dependency to a patched tar version without it. At that point, regenerate the resolution, run a clean install and both audits, and verify the build/deployment commands. Reassess this override whenever Vercel changes its container or tar major version.

When first adding this override, npm retained the previous nested tar entry in the existing lockfile and reported it as invalid. A fresh npm resolution, followed by `npm ci`, produced the correct dependency graph. No postinstall patching or edited files inside `node_modules` are required.

## Installation scripts

`allowScripts` is the explicit npm installation policy. Each approval is bound to a package version, not a wildcard:

| Package                    | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `@parcel/watcher`          | Native filesystem watcher used by the client build tools     |
| `@swc/core`                | Native compiler initialization for Nx configuration loading  |
| `esbuild`                  | Platform binary selection for Angular, Nx and Vercel tooling |
| `fsevents`                 | Optional macOS filesystem events                             |
| `lmdb`, `msgpackr-extract` | Native build cache and serialization support                 |
| `nx`                       | Native task runner initialization                            |
| `unrs-resolver`            | Native module resolver used by Jest                          |

Several esbuild versions remain because upstream tools select different releases. This is an intentional transitive resolution, not an application dependency conflict. Preserve the exact approvals in `package.json` and update them whenever these versions change.

For an update, enumerate every lockfile entry with `hasInstallScript`, review the package's installation purpose, and compare its name and version with `allowScripts`. Check platform-specific optional packages as well as those installed on the current machine. A successful `npm ci` must not warn that required installation scripts were skipped.

## Audit results and priorities

The summary below records the reviewed audit results. Generated JSON reports are not committed because they describe a point-in-time dependency graph. Regenerate detailed reports with `npm audit --json` and `npm audit --omit=dev --json` when reviewing affected paths, advisory links or proposed fixes.

| Audit                                 | Critical | High | Moderate | Low | Total |
| ------------------------------------- | -------: | ---: | -------: | --: | ----: |
| Baseline, including development tools |        1 |   65 |       28 |   2 |    96 |
| Updated, including development tools  |        0 |   31 |       37 |   0 |    68 |
| Baseline, `--omit=dev`                |        0 |    0 |        0 |   0 |     0 |
| Updated, `--omit=dev`                 |        0 |    0 |        0 |   0 |     0 |

These counts include affected parent packages. They do not represent that many independent advisories. The added moderate records belong to the changed tool graph; a reduction in high findings does not imply that every remaining finding disappeared.

Prioritize critical findings first, then high findings in tools that process external input during development or deployment. A clean production audit does not establish that build tooling is safe, and the audit does not prove reachability of a particular vulnerable code path.

### Remaining upstream constraints

The updated audit's source findings, rather than all inherited parent records, are:

| Packages                                                        | Tool chain and constraint                                                                            | Follow-up                                                                              |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `braces`                                                        | Tailwind 3's glob/watch dependencies; the latest braces release is still affected                    | Review a separate Tailwind 4 migration, including CSS output and styling compatibility |
| `postcss-selector-parser`                                       | Tailwind 3 and its PostCSS nesting dependency retain the older parser major                          | Address alongside the Tailwind migration                                               |
| `js-yaml`                                                       | Jest's coverage dependencies retain v3; Vercel's Python analysis package pins an affected v4 release | Track compatible upstream releases; do not replace v3 with v4 across the whole tree    |
| `@fastify/busboy`, `undici`                                     | Fixed dependencies in the current Vercel CLI; Nx also pins an affected undici patch release          | Track Vercel/Nx updates and reassess the actual tool usage                             |
| `minimatch`, `path-to-regexp`, `smol-toml`, `sprintf-js`, `ajv` | Fixed dependencies in Vercel's language/framework analysis and build packages                        | Track upstream package updates; avoid a large collection of transitive overrides       |

Vercel 63.1.2 and Nx 23.3.0 are the current published stable versions checked for this change. Broadly replacing their internal dependency majors would require additional compatibility work. Tailwind 4 changes the stylesheet integration and generated CSS; that is a separate migration, not a patch update. Use `npm audit --json` to inspect every advisory and affected package path for these follow-ups.

## Verification

Run the repository's build, lint, typecheck and test targets before committing dependency changes. Include the client production/development builds, API build, serverless API build and both E2E suites. The CI workflows also require coverage and the SonarCloud quality gate.

The local SonarQube extension can review edited files without rerunning tests. A successful IDE review is separate from the SonarCloud analysis in CI. The full local scanner requires its own executable and project credentials; do not report that analysis as successful when those prerequisites are unavailable.

Local checks completed for this change:

- Clean `npm ci`, including the required native installation scripts; full and production audits summarized above.
- Workspace lint and available typecheck targets; explicit TypeScript checks for the API and Playwright project. Playwright declares its Node types and uses `esnext` modules with `bundler` resolution for typechecking, matching its transformation of TypeScript imports and SDK aliases. Playwright handles execution; this configuration does not emit application code.
- Client production and development builds, API build and serverless API build.
- Client unit tests (426), API unit tests (74), shared library tests and API E2E tests (2).
- All eight browser E2E scenarios passed across the verification runs. One timer-sensitive scenario passed on a focused retry with one worker; its assertion was unchanged. Local verification used a temporary client on the IPv4 loopback address with the normal origin, preserving the separately running development server.
- The reported SonarQube `String.raw` warnings were corrected without changing the import-order expressions.

The final small configuration and warning fixes were checked with TypeScript, ESLint and formatting checks, without repeating the successful test suites. The PR's SonarCloud analysis remains pending; a full local scan could not run because the scanner and project credentials are unavailable.
