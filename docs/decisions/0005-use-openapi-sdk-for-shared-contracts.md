# Use an OpenAPI SDK for shared contracts

## Status

Accepted

## Context

reelscore and reelscore-controller maintain separate copies of shared models,
constants and helpers. The copies have diverged. reelscore-ios-app will also
need Swift models describing the same wire data.

## Decision

The separate reelscore-sdk repository owns shared OpenAPI 3.1 contracts and
generates TypeScript models from them. All contracts formerly in `lib/models` are migrated into domain-specific schemas
for competitions, teams, coaches, players, standings, fixtures, events, statistics,
analyses, evaluations, search, responses, live updates and week data.
`openapi/reelscore.openapi.json` references these sources; generation also produces
a standalone bundled document. The fixture schemas reference team and competition
definitions owned by their respective domains.
Prediction value arrays are generated from schema enums to keep runtime values
and type declarations synchronized. Competition codes, status groups, realtime event names, date helpers and the
`timeTotal` event helper are ordinary TypeScript source in the SDK.

The remaining `lib/` tree is the non-buildable Nx project `internal-shared`,
with test, lint and typecheck targets. `@lib/shared` remains available for local
helpers and constants. `lib/models` and its `@lib/models` alias are removed. Migrated SDK symbols
are imported directly from `@reelscore-sdk/models`, `@reelscore-sdk/constants`
or `@reelscore-sdk/helpers` and are not re-exported by local barrels.

The generator preserves existing TypeScript `Date` declarations with an explicit
schema marker, while OpenAPI describes their JSON date-time serialization.
Generation does not add runtime parsing. Generic response payloads and numeric
record keys are preserved through narrowly scoped TypeScript generation markers;
concrete OpenAPI payloads remain fully described for validation and other languages.
Compiler tests verify these boundaries.

During this pilot, reelscore installs a versioned npm tarball from `vendor/`.
The artifact contains compiled ESM/CommonJS, declarations and OpenAPI source.
This keeps a fresh checkout reproducible without requiring sibling repositories
or an unpublished registry version. SDK source changes require a newly packed
artifact and an updated package lock. Registry publication is a later step.

The SDK currently preserves reelscore's contract. The controller migration is
separate: its league standings flag and event fields differ. No controller files
are modified as part of this pilot.

## Consequences

- Shared contracts have one editable source in the SDK's OpenAPI document.
- Payload tests preserve nullability, optional properties, string/number IDs,
  the `qoute` field and prediction values. SDK generation does not rename fields
  or introduce API response validation in application request paths.
- Existing application tests and builds verify integration of the packed SDK.
- Swift models can later be generated from the versioned OpenAPI document;
  Swift generation and decoding compatibility have not yet been implemented.
- TypeScript helpers remain JavaScript code and require a separate Swift
  implementation if iOS needs the same behavior.
- The temporary tarball is a generated artifact. Changes are made in SDK source
  and repacked, never edited inside the archive.

## Alternatives

Keeping duplicated TypeScript definitions preserves the synchronization problem
and provides no language-independent contract for iOS. Migrating every model at
once would combine unrelated compatibility changes. This pilot exercises one
complete fixture contract before migrating further domains.
