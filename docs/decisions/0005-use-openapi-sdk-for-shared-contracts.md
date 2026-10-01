# Use an OpenAPI SDK for shared contracts

## Status

Accepted

## Context

reelscore and reelscore-controller maintain separate copies of shared models,
constants and helpers. The copies have diverged. reelscore-ios-app will also
need Swift models describing the same wire data.

## Decision

The separate reelscore-sdk repository owns shared OpenAPI 3.1 contracts and
generates TypeScript models from them. The first migration covers the complete
fixture model and its required team, league, status and event definitions.
Prediction value arrays are generated from schema enums to keep runtime values
and type declarations synchronized. Competition codes and date helpers are
ordinary TypeScript source in the SDK.

The remaining `lib/` tree is the non-buildable Nx project `internal-shared`,
with test, lint and typecheck targets. Existing `@lib/models` and `@lib/shared`
imports remain available for project-specific definitions. Migrated SDK symbols
are imported directly from `@reelscore-sdk/models`, `@reelscore-sdk/constants`
or `@reelscore-sdk/helpers` and are not re-exported by local barrels.

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
