[简体中文](./README.zh.md) | **English**

<p align="center">
	<img src="./Fast.png" width="128" alt="Fast.ESLint.Config.Legacy Logo" />
</p>

<h1 align="center">Fast.ESLint.Config.Legacy</h1>

<p align="center">
	<a href="https://www.npmjs.com/package/@fast-china/eslint-config-legacy"><img src="https://img.shields.io/npm/v/@fast-china/eslint-config-legacy?logo=npm" alt="npm version" /></a>
	<a href="https://www.npmjs.com/package/@fast-china/eslint-config-legacy"><img src="https://img.shields.io/npm/dm/@fast-china/eslint-config-legacy" alt="npm downloads" /></a>
	<a href="./LICENSE"><img src="https://img.shields.io/npm/l/@fast-china/eslint-config-legacy" alt="License" /></a>
</p>

ESLint 8 Legacy configuration SDK with CommonJS, eslintrc and granular configuration entries.

**[Documentation](http://docs.fastdotnet.cn/en-US/frontend/eslint-config-legacy/) · [Official website](http://fastdotnet.com)**

## Scope

The package has one merged configuration entry, direct granular extends, and three programming entries:

- Package root: Vue 3, TypeScript, Vite, browser administration projects.
- Top-level subpaths such as `/typescript`, `/vue`, and `/vue2`: directly extendable granular configs.
- `/configs`: reusable Legacy Config fragment creators, including Vue 2 and Vue 3.
- `/constants`: shared file globs.
- `/rules`: typed local rule records and `RuleOptions`.

There is no preset directory or preset dispatcher. Each `src/configs/<name>/index.ts` is a directly loadable default Legacy config, while its reusable creator is colocated in `factory.ts`; `src/index.ts` composes the package root from those creators.

## Requirements

- Node.js `^22.18.0 || ^24.18.0`
- pnpm `^11.0.0` for repository development
- ESLint `^8.57.0`
- TypeScript `^4.0.0 || ^5.0.0 || ^6.0.0`

## Installation

```sh
pnpm add -D eslint@^8.57.0 typescript @fast-china/eslint-config-legacy
```

Plugins and parsers are direct package dependencies.

## Quick start

```js
// .eslintrc.cjs
module.exports = {
	root: true,
	extends: ["@fast-china/eslint-config-legacy"],
};
```

The root enables browser globals, JavaScript, TypeScript, Vue 3, import-x, Promise, RegExp, JSON dialects, YAML, Markdown, CommonJS/tooling compatibility, and the Prettier conflict-disable layer.

The unreleased 2.1.10 source retains the 2.1.9 ESLint 8, opt-in type-aware linting, Vue 2 and public Legacy policy, and synchronizes the skill-file default-ignore fix from Fast.ESLint.Config 2.1.10. Vue single-file components disable `switch-exhaustiveness-check`; regular TypeScript and TSX retain the error-level check. Vue 2 alone disables the Vue 3 emits contract. React continues to use CommonJS-loadable ESLint 8 plugins because the modern baseline plugin is ESM-only.

The opt-in `/type-aware` config uses `recommended-type-checked`. Promise waiting remains an application decision: `no-floating-promises` and `strict-void-return` are disabled, while Promise misuse, invalid `await`, unsafe types, redundant conversions, and correctness-only `return-await` remain checked; Promise-returning event handlers are allowed in Vue templates and TSX attributes. Exported TypeScript module boundaries require explicit types, while internal functions, TSX component returns, and Vue SFC callbacks keep contextual inference.

Type-only imports and exports use standalone `import type` and `export type`, constructor-only private members use `readonly`, and the shared JavaScript policy rejects direct or indirect dynamic string execution, Promise executor returns, and the `void` operator. Vue setup code cannot use props or refs in ways that lose reactivity.

## Common usage

For incremental adoption, extend only the granular configurations needed by the project:

```js
// .eslintrc.cjs
module.exports = {
	root: true,
	extends: ["@fast-china/eslint-config-legacy/javascript", "@fast-china/eslint-config-legacy/typescript"],
};
```

These ESLint 8 entries do not use Flat Config APIs. Compose framework, type-aware and formatting capabilities through their documented entries.

Use `vueRules` for the rule record; Vue 2/3 differences belong to the configuration factories.

## Documentation

- [Compatibility matrix](http://docs.fastdotnet.cn/en-US/frontend/eslint-config-legacy/dependency-compatibility)
- [Default rules and risk guide](http://docs.fastdotnet.cn/en-US/frontend/eslint-config-legacy/rules-risk)
- [Engineering audit (Chinese)](./docs/engineering-audit.zh.md)
- [Contributing guide](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)
- [Changelog](./CHANGELOG.md)

## Development checks

```sh
pnpm install --frozen-lockfile
pnpm typegen
pnpm check
pnpm --config.ignore-scripts=true pack --dry-run
```

Use `pnpm dev` for a long-running tsdown watch build while editing the package.

Tests are separated by verification target: consumer types, runtime configs, and package contracts. `pnpm test` builds the package before running all three suites.

## Copyright, license and use

Copyright © 2018-Now 小方. This project uses [Apache License 2.0](./LICENSE). Use, modification, distribution and commercial use are permitted subject to its terms.

When redistributing, provide the license, mark modified files and preserve applicable copyright, attribution and supplied NOTICE information as required. This summary does not replace the license or impose additional UI attribution.

Users are responsible for the legal compliance and authorization of their own modifications, deployment, data processing and operations. This reminder is not an additional license condition.

Except as required by applicable law or agreed in writing, the software is provided on an "AS IS" basis. Sections 7 and 8 govern warranty disclaimers and liability limits. Providing the project does not endorse downstream activities or assume users' contractual commitments. This statement does not exclude liability that cannot lawfully be excluded.
