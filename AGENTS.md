# Working on reelscore

These instructions apply to the entire repository. Explicit task instructions take precedence over these project defaults.

## Start with the project context

- Read the relevant code, tests, and documentation before making changes. Use the developer's manual changes as the reference for readability and formatting.
- Check `git status` before editing. Preserve existing staged, unstaged, and untracked work; do not overwrite unrelated changes.
- Keep changes focused on the requested task. Preserve existing behavior, API contracts, data formats, and user-facing workflows unless the task explicitly requires changing them.
- Use `package.json`, `package-lock.json`, `nx.json`, project configuration, and the resolved Nx targets as the source of truth. Documentation can lag behind the code.
- Consult official documentation when an API or framework behavior is uncertain. Check compatibility with the installed major version before applying advice from current documentation.
- Reuse installed dependencies and existing patterns. Avoid incidental dependency upgrades, framework migrations, or new tooling.

## Workspace and versions

reelscore is a football livescore application with match predictions and team form ratings.

The baseline checked on September 30, 2026 is Angular 21.2, Angular Material 21.2, NgRx 21.1, RxJS 7.8, Nx 22.7, TypeScript 5.9, Node.js 24, Express 4.22, and Mongoose 8. Recheck package files when these versions change.

| Location                        | Responsibility                                                      |
| ------------------------------- | ------------------------------------------------------------------- |
| `apps/client/src/app/features/` | Angular features such as overview, match, and competition           |
| `apps/client/src/app/core/`     | App shell and application-wide infrastructure                       |
| `apps/client/src/app/shared/`   | Reusable client components, services, pipes, and utilities          |
| `apps/api/src/`                 | Express routes, controllers, business services, and database access |
| `apps/api/src/app.ts`           | Express application and middleware composition                      |
| `apps/api/src/server.ts`        | Local server startup                                                |
| `apps/api/vercel/index.ts`      | Serverless entry point exporting the Express application            |
| `lib/models/`                   | Shared domain models and API DTOs                                   |
| `lib/shared/`                   | Shared domain helpers and constants                                 |
| `apps/client-e2e/`              | Playwright browser tests                                            |
| `apps/api-e2e/`                 | Jest API end-to-end tests                                           |
| `docs/`                         | Product documentation, architecture, and decisions                  |

Read [the documentation index](docs/README.md) and relevant existing decisions for architectural work. Record significant architectural decisions using the existing ADR process; routine fixes do not need an ADR.

## Readability and TypeScript

- Write clear, readable code suitable for developers at every level of experience.
- Use descriptive variable, function, and test names that communicate their purpose and domain meaning. Avoid unnecessary abbreviations.
- Separate logical steps with blank lines: setup, processing, and return statements; test setup, actions, and assertions.
- Prefer simple, explicit solutions. Avoid dense expressions, nested ternaries, and hard-to-follow chains. Use named intermediate values when they improve understanding.
- Introduce abstractions and helpers only when they improve readability or remove meaningful duplication.
- Comment on non-obvious business rules and decisions, explaining why the code behaves that way.
- Follow the surrounding formatting and `.prettierrc`, including single quotes. Format only files touched by the task.
- Respect existing TypeScript and Angular template strictness. Avoid `any`; narrow `unknown` at untrusted boundaries. Do not silence errors with unsafe casts, non-null assertions, or broad lint suppressions.
- Prefer inferred types for obvious local values and explicit types for contracts and boundaries. Use separate `import type` declarations as required by ESLint.
- Reuse the aliases declared in `tsconfig.base.json`: `@app/core`, `@app/shared`, `@lib/models`, and `@lib/shared`. Preserve existing public exports when adding shared code.

## Nx and dependency boundaries

- Use npm and the repository's local Nx CLI through `npx nx`; preserve `package-lock.json`. Use `npm ci` when a clean dependency installation is needed.
- Discover projects with `npx nx show projects` and inspect resolved targets with `npx nx show project <project> --json`. Plugins infer some targets, including API lint and client E2E; an absent entry in `project.json` does not mean a target is unavailable.
- Run build, lint, test, and serve tasks through Nx so dependency ordering and caching remain effective.
- For scaffolding, inspect the installed generator with `npx nx generate <generator> --help`, then preview its changes with `--dry-run`. Use workspace generator defaults and review generated code.
- Respect the dependency graph and ESLint module boundaries. Client code must not import API internals. Shared `lib/` code must not depend on either application's implementation or runtime handles.
- `lib/` is the non-buildable Nx project `internal-shared`, with test, lint, and typecheck targets. Validate shared changes through this library and the affected client/API consumers. Migrated contracts are generated in the separate `reelscore-sdk` repository; update its packaged artifact instead of duplicating definitions locally.
- `nx.json` disables Nx Cloud connections and analytics. Preserve this choice. AI setup commands can write rules, MCP configuration, and skills; run them only as part of a requested tooling setup.
- For changes spanning projects, use `run-many` or `affected`. When using `affected`, specify a verified base and head for the intended changes; do not guess the comparison range.
- Preserve target inputs, outputs, and caching configuration. If Nx infrastructure fails, investigate the actual error before changing workspace configuration or resetting caches.

## Angular frontend

### Feature organization and types

- The target client structure is domain- and feature-oriented. Group files by the business capability they support, and colocate related components, services, stores, facades, templates, styles, and tests. Use subfolders for meaningful subfeatures rather than technical categories such as `components/`, `services/`, or `stores/`.
- Apply this structure to new features and explicitly requested structural refactorings. Existing technical subdivisions are legacy organization, not the preferred design; keep unrelated file moves out of routine fixes.
- Keep presentation, orchestration, state management, and transport responsibilities separate even when their files share a feature folder. Domain-oriented folders alone do not establish full Domain-Driven Design; introduce additional domain boundaries or abstractions when the task and business model justify them.
- Retain feature-local `types/` folders for TypeScript interfaces, type aliases, union types, and related contracts.
- Name files containing these declarations `<domain-name>.model.ts`, including files inside `types/`. For example, use `types/match-timeline-item.model.ts` for `MatchTimelineItem`. The `.model.ts` suffix applies to both interfaces and type aliases, including union types.
- Keep types near the feature or subfeature that owns them. Promote them to a shared location only when they are meaningfully reused across features. Preserve `lib/models/` as the existing location for shared client/API contracts.
- Client `types/` folders contain TypeScript contracts, not database schemas. Mongoose models under `apps/api/src/database/` have a separate persistence responsibility; these client conventions do not rename or restructure them.

### Components and templates

- Preserve descriptive suffixes such as `.component.ts`, `.service.ts`, `.store.ts`, and `.facade.ts`; the Nx generator defaults intentionally keep them. Colocate unit tests as `.spec.ts` and related templates/styles with the implementation.
- Prefer one primary responsibility per file. Components render UI; move independent domain calculations and orchestration into the appropriate helper, facade, or service.
- Use standalone components for new UI. Angular 21 defaults to standalone, so omit redundant `standalone: true`. Set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly for new components; it is not the default in Angular 21.
- Prefer `inject()`, signal inputs with `input()` / `input.required()`, and `output()` for new component APIs. Preserve existing bindings when modifying components.
- Group dependencies and Angular properties before methods. Mark stable references `readonly`, use `private` for implementation details, and `protected` for template-only members.
- Keep event handler names focused on the action they perform.
- Keep templates easy to read. Prefer `@if`, `@for`, and `@switch`; track lists by stable domain identity. Use direct class/style bindings and move complex transformations out of templates.
- Keep lifecycle hooks short and implement the corresponding lifecycle interfaces. Prefer decorator `host` metadata for new host bindings and listeners.
- Keep feature routes lazy using the existing router setup. Preserve URL parameters, route reuse, and navigation behavior.
- Follow neighboring components for inline versus external templates/styles. Reuse Angular Material, Tailwind utilities, and existing `rs-*` design tokens.
- Prefer typed Reactive Forms for new forms. Do not introduce APIs described as stable only in a newer Angular release, such as Angular 22 Signal Forms or `@Service`.
- Use semantic HTML, keyboard interaction, meaningful accessible names, and appropriate focus management. Preserve visible focus, contrast, and reduced-motion support when changing interactive UI.
- Prefer `NgOptimizedImage` for compatible image sources, with appropriate dimensions and loading priority; preserve existing responsive logo variants.

### State, async work, and lifecycle

- Follow the existing NgRx Signal Store and facade boundaries. Components should consume state and trigger actions; HTTP services handle transport; stores and facades coordinate loading, refreshes, and domain state.
- Use signals for local reactive state and `computed()` for derived values. Keep computations pure. Use `effect()` for side effects rather than copying derived state between signals.
- Update state immutably. Do not mutate store DTOs, signal arrays, maps, or sets in place.
- Retain RxJS for asynchronous streams. Prefer `AsyncPipe` for template consumption and `takeUntilDestroyed()` for lifecycle-bound subscriptions; pass a `DestroyRef` when outside an injection context. Avoid nested subscriptions.
- Keep provider scope deliberate. Use root providers for application singletons and feature/component providers for local state; do not make a feature store global merely for convenience.
- Preserve the distinction between initial loading and background refreshing, including existing data, skeletons, empty states, and errors.
- Prevent stale responses from overwriting a newer fixture, date, or competition selection. Keep retries bounded and preserve existing refresh cooldowns.
- Clean up timers, observers, listeners, subscriptions, and connections on teardown. Use effect cleanup for resources created by an effect.
- Keep sockets, DOM elements, observers, timer identifiers, and other runtime handles outside persisted domain state.

## Node.js and Express backend

### Layers and HTTP behavior

- Keep Express application composition in `app.ts`, local listening in `server.ts`, and the serverless export in `vercel/index.ts`. Importing the application for tests or serverless execution must not start a listener.
- Keep responsibilities distinct: routes handle HTTP parsing and responses, controllers coordinate use cases, services implement business rules, and database services own persistence queries.
- Use explicit interfaces and adapters for MongoDB, Redis, and other integrations where this separates business logic or enables focused tests. Follow existing injectable constructor dependencies; avoid adding a dependency-injection framework.
- Validate query parameters, route parameters, and request bodies before using them. TypeScript casts are not runtime validation. Build allowlisted database filters rather than passing request objects directly to Mongoose.
- Every request path must send/end a response or delegate with `next()`. Invalid input must not leave a connection hanging. Preserve established response shapes and status codes unless the task changes that contract.
- This repository uses Express 4: rejected promises from async handlers are not automatically forwarded as in Express 5. Catch asynchronous failures and pass them to `next(error)`, or use an existing equivalent adapter.
- Keep error middleware after routes, with all four arguments. Delegate when `res.headersSent`; never send a second response. Keep internal errors and credentials out of client responses.
- Preserve Helmet, the CORS origin allowlist, and request body limits. Add security behavior appropriate to the endpoint without weakening existing protections.

### Performance and resources

- Keep request handling asynchronous. Avoid synchronous I/O and expensive CPU work on the event loop. For genuinely heavy processing, choose bounded background work rather than spawning a worker for every request.
- Bound concurrent external operations, retries, result sizes, and caches. Use `Promise.all` for small, known independent groups; avoid unbounded fan-out over user-controlled collections.
- Reuse the existing MongoDB connection helper and its connection promise, pool limits, and timeouts. Do not reconnect per request, duplicate connection listeners, or close the shared pool after each response.
- Preserve current Mongoose schemas and DTO serialization. Use projections and `lean()` for read-only queries where document methods are unnecessary. Address query size and indexes when relevant to the task.
- Use timeouts and cancellation for external operations. Propagate client disconnects to pending stream work and honor backpressure when `res.write()` returns `false`.
- Release stream readers, timers, and listeners on success, failure, and disconnect. Reuse existing streaming adapters rather than duplicating lifecycle logic.
- Serverless instances may be reused or discarded. Keep durable data in the existing persistence layer; do not depend on process memory or local files for cross-request correctness. Keep reusable clients and runtime handles in memory, never in persisted DTOs.
- Read configuration from the existing environment mechanisms. Never commit secrets or log credential-bearing connection strings.

## reelscore domain rules

- The application reads football data from its own database. Do not introduce direct API-Football/RapidAPI calls into client or API request flows.
- Changes to `lib/models/` or `lib/shared/` may need matching changes in the separately maintained admin repository. Preserve compatibility and explicitly report any required admin follow-up; do not claim synchronization without checking that repository.
- Keep fixture status values, event contracts, prediction rules, and missing-data fallbacks consistent with shared models and existing tests. Missing scores or statistics are not automatically zero.
- Reuse shared date helpers. Calendar dates use `Europe/Berlin`; fixture timestamps are Unix seconds and require explicit conversion to JavaScript milliseconds. Preserve existing ISO-week and timezone behavior.
- Read [the live-update decision](docs/decisions/0001-use-sse-for-live-updates.md) before changing realtime logic. Production currently uses 20-second polling; SSE is disabled in the production client and returns HTTP 204 in Vercel Production. Preserve visibility refreshes, retry limits, cooldowns, and the polling fallback unless explicitly requested otherwise.
- Respect asset-processing instructions in `README.md`. Review generated logos and images before replacing existing assets.

## Verification

Choose checks according to the changed behavior. Start with focused tests, then run the relevant project's lint/build or broader workflow checks when warranted. Documentation-only changes need link/content and formatting checks, not application test runs.

| Purpose                        | Command                                                  |
| ------------------------------ | -------------------------------------------------------- |
| Start client and API           | `npm run dev`                                            |
| Client unit/component tests    | `npx nx test client`                                     |
| API unit/component tests       | `npx nx test api`                                        |
| Client lint                    | `npx nx lint client`                                     |
| API lint                       | `npx nx lint api`                                        |
| Client build                   | `npx nx build client`                                    |
| API build                      | `npx nx build api`                                       |
| Serverless API build           | `npx nx run api:build-vercel`                            |
| Browser E2E                    | `API_PORT=3333 npx nx e2e client-e2e --project=chromium` |
| API E2E                        | `npx nx e2e api-e2e`                                     |
| Format check for touched files | `npx prettier --check <files>`                           |

- Jest is the configured unit/component runner; Playwright covers browser workflows and Supertest is available for HTTP behavior. Reuse existing test setup, factories, and page objects.
- Prefer a small number of tests for observable behavior, business rules, and critical failures or lifecycle cases. Do not mirror private implementation details or add brittle snapshots to inflate coverage.
- For regressions, cover the failing behavior. For stream/subscription changes, cover relevant disconnect, cancellation, teardown, or fallback scenarios.
- Mock external boundaries in unit/component tests. Existing E2E suites require the documented environment and database configuration; do not substitute production writes or invent missing secrets.
- The Playwright configuration starts both servers and expects the API at port 3333; local API startup otherwise defaults to port 3000. Chromium must be installed for browser E2E.
- Shared `lib/` changes require checks of the affected client/API consumers. Serverless entry or bundling changes require the serverless build as well.
- Do not disable strictness, lint rules, build budgets, or assertions to make checks pass. Distinguish existing failures from regressions introduced by the task.
- Review the final diff for scope and accidental generated files. Report what changed, which checks ran, and any checks blocked by missing prerequisites. Do not imply unrun checks passed.

## Official references

Reviewed September 30, 2026. Use version-matched documentation where available; live documentation may describe newer releases.

- [Angular style guide](https://angular.dev/style-guide)
- [Angular 21 instructions for AI tools](https://v21.angular.dev/ai/develop-with-ai)
- [Angular signals](https://angular.dev/guide/signals)
- [Angular subscription cleanup](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed)
- [Nx AI setup](https://nx.dev/docs/getting-started/ai-setup)
- [Nx task execution](https://nx.dev/docs/features/run-tasks)
- [Nx module boundaries](https://nx.dev/docs/features/enforce-module-boundaries)
- [Express error handling](https://expressjs.com/en/guide/error-handling/)
- [Express production security](https://expressjs.com/en/advanced/best-practice-security/)
- [Express performance and reliability](https://expressjs.com/en/advanced/best-practice-performance/)
- [Node.js event loop guidance](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
- [Node.js stream backpressure](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
