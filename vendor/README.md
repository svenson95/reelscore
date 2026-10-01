# Local SDK pilot

`reelscore-sdk-0.2.0.tgz` is built from the sibling `reelscore-sdk` repository.
It contains all former `lib/models` contracts as domain-specific OpenAPI schemas,
generated TypeScript models, status/realtime constants and date/event helpers.
`reelscore-sdk/openapi` exports the generated standalone schema for other languages. The archive is deliberately committed for
reproducible installation before the SDK has a published registry release.

`npm ci` uses this archive and its lockfile integrity; it does not need access to
the SDK checkout. No source files should be edited inside the archive.

To deliver a later SDK change, generate and test it in the SDK repository, assign
a new package version, then pack and install that version:

```sh
# In reelscore-sdk (update the version before packing):
npm pack --pack-destination ../reelscore/vendor

# In reelscore, replacing <version> with the new SDK version:
npm install ./vendor/reelscore-sdk-<version>.tgz
npx nx run-many -t test lint -p internal-shared client api
npx nx run internal-shared:typecheck
npx nx run-many -t build -p client api
npx nx run api:build-vercel
```

Review the SDK source diff, the new archive and the consumer lockfile together.
Once the new version is installed, remove the superseded archive. This pilot
has not published a registry package or migrated reelscore-controller/iOS.
