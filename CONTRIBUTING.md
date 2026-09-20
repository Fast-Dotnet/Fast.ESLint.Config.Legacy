# Contributing

Thank you for improving `@fast-china/eslint-config-legacy`.

## Prerequisites

- A supported Node.js version from `package.json` (`.nvmrc` selects the repository baseline)
- pnpm `11.x`

## Local workflow

```sh
pnpm install
pnpm typegen
pnpm check
pnpm audit
```

Use `pnpm dev` when a long-running tsdown watch build is useful during implementation.

`pnpm test` first builds the package, then runs consumer-type, runtime-config, and package-contract suites. TypeScript 6 and tsdown target Node 22; publint and Are the Types Wrong verify the built package exports and declaration contracts.

`pnpm check` regenerates no source files. It type-checks source, lints every supported file type, runs the complete build and test workflow, and checks formatting.

Use `pnpm lint:fix` and `pnpm format` only for intentional mechanical changes. Inspect their diffs before committing.

## Changing dependencies, configs, or rules

1. Keep this package on ESLint 8.57 Legacy Config. ESLint 9/10 and Flat Config work belongs in `@fast-china/eslint-config`.
2. Scope each parser, config, plugin, processor, environment, and rule group to the file types it supports.
3. Keep browser and Node.js globals separate; add narrow tooling overrides instead of making globals universal.
4. Prefer upstream recommended configs, then document every local override immediately above the rule.
5. Mark high-impact defaults with `[高影响]`; verify the locked rule's `meta.fixable` before adding `[可自动修复]`.
6. Keep [rules-risk](http://docs.fastdotnet.cn/eslint-config-legacy/rules-risk) and [rules-risk.en](http://docs.fastdotnet.cn/eslint-config-legacy/rules-risk.en) synchronized with high-impact defaults.
7. Never sort a map whose key order has semantics, including `package.json#exports` condition objects.
8. Keep organization-specific dependency restrictions out of complete configs; expose them as explicit overlay configs or rule records.
9. Keep framework and language plugins on release lines whose peer range still includes ESLint 8.57; never bypass an incompatible peer range.
10. Run `pnpm outdated --format json` and update both dependency compatibility documents whenever direct versions change. “Latest” means the newest release still loadable by ESLint 8 Legacy Config.
11. Review dependency build scripts before adding an entry to `pnpm-workspace.yaml#allowBuilds`; never approve an unrelated package.
12. After changing ESLint or a bundled plugin, run `pnpm typegen` and commit `src/typegen.d.ts`.
13. Add or update an integration test for every parser, plugin, processor, scope, auto-fix, generated type, config, or public export change.
14. Update both README files and `CHANGELOG.md` for user-visible behavior changes.
15. Keep rule records and `defineRules` under `src/rules`; colocate each directly loadable default config in `src/configs/<name>/index.ts` with its reusable creator in `factory.ts`; keep the single deterministic package-root composition in `src/index.ts`.
16. Standalone configs must work alone; overlays such as `/type-aware` and sorting must document that they follow a complete config.

The repository does not permit bulk deletion. Remove obsolete files only by explicit path, one file at a time.

## Pull requests

Keep changes focused and describe compatibility effects. Do not commit credentials or publish from a pull request. Node.js, ESLint, TypeScript, Vue, React, Angular, Prettier, module-format, or default-rule changes are release-significant.

## Release check

```sh
pnpm check
pnpm audit
pnpm --config.ignore-scripts=true pack --dry-run
```

Inspect the archive and verify that `/rules` plus every standalone and overlay config contain JavaScript and declarations. The package root and direct configs must not require `.default`, and the build must report zero publint and Are the Types Wrong problems. Publishing remains maintainer-controlled.
