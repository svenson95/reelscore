# Internal shared library

`internal-shared` is the non-buildable Nx library for code shared by the client
and API inside this repository. Its sources remain in `lib/models` and
`lib/shared`; application builds compile them directly.

```sh
npx nx test internal-shared
npx nx lint internal-shared
npx nx run internal-shared:typecheck
```

Existing consumers can keep `@lib/models` and `@lib/shared`. The combined entry
point is `@reelscore/internal-shared`.

Fixture contracts, competition codes and date helpers now come from the separate
`reelscore-sdk` package. Compatibility barrels retain the existing exports.
Change those contracts in the SDK's `openapi/fixtures.openapi.json`, regenerate
and test the SDK, then update the tarball described in `vendor/README.md`.

New code should import migrated symbols directly from `@reelscore-sdk/models`,
`@reelscore-sdk/constants` or `@reelscore-sdk/helpers`. Keep API-only code in the
API, client-only code in its feature, and cross-repository contracts in the SDK.
