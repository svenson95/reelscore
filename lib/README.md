# Internal shared library

`internal-shared` is the non-buildable Nx library for project-specific helpers
and constants shared by the client and API. It retains fixture highlight helpers shared by the client and API in `lib/shared`;
application builds compile them directly.

```sh
npx nx test internal-shared
npx nx lint internal-shared
npx nx run internal-shared:typecheck
```

Local helpers and constants use `@lib/shared`. All models formerly in `lib/models` are generated
by the separate `reelscore-sdk` package; `@lib/models` has been removed.

```ts
import type { CompetitionDTO, TeamDTO, FixtureDTO } from '@reelscore-sdk/models';
import { STATUS_VALUES_FINISHED, REALTIME_EVENT } from '@reelscore-sdk/constants';
import { timeTotal, getTodayDateString } from '@reelscore-sdk/helpers';
```

Edit the SDK's domain schemas under `openapi/`, referenced by
`openapi/reelscore.openapi.json`, then regenerate, test and update the archive
as described in `vendor/README.md`. The generated bundled schema is available
for consumers that prefer one OpenAPI file.

No local SDK re-exports or independent model copies are retained. Keep API-only
implementation in the API and client-only implementation in its feature.

Competition IDs, URL slugs, display labels, season rules and round data/helpers
are imported directly from the SDK. `COMPETITION_LABEL` preserves reelscore’s
existing display names; some controller labels currently differ.
