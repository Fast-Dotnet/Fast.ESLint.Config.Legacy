<p align="left">
	<a href="./README.zh.md">简体中文</a> | <strong>English</strong>
</p>

<p align="center">
	<img src="./Fast.png" alt="logo" width="160" />
</p>

# @fast-china/eslint-config-legacy

**[Documentation](http://docs.fastdotnet.cn/eslint-config-legacy/) · [Official website](http://fastdotnet.com)**

Production ESLint 8 `.eslintrc` configuration for Vue web administration projects. Reusable creators also cover Vue 2/3, React, Angular, Node.js, TypeScript, JavaScript, JSON, YAML, Markdown, Promise, RegExp, and import rules.

[![npm version](https://img.shields.io/npm/v/@fast-china/eslint-config-legacy?color=orange)](https://www.npmjs.com/package/@fast-china/eslint-config-legacy) [![node](https://img.shields.io/badge/node-%5E22.18%20%7C%7C%20%5E24.18-brightgreen)](https://nodejs.org/) [![eslint](https://img.shields.io/badge/eslint-%5E8.57-4b32c3)](https://eslint.org/) [![license](https://img.shields.io/npm/l/@fast-china/eslint-config-legacy)](./LICENSE)

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

## Default configuration

```js
// .eslintrc.cjs
module.exports = {
	root: true,
	extends: ["@fast-china/eslint-config-legacy"],
	rules: {
		"no-console": "warn",
	},
};
```

The root enables browser globals, JavaScript, TypeScript, Vue 3, import-x, Promise, RegExp, JSON dialects, YAML, Markdown, CommonJS/tooling compatibility, and the Prettier conflict-disable layer.

Version 2.1.9 keeps ESLint 8, opt-in type-aware linting, Vue 2, and all public Legacy presets while synchronizing compatible rule sources with the Fast.ESLint.Config 2.1.9 workspace. Vue single-file components disable `switch-exhaustiveness-check`; regular TypeScript and TSX retain the error-level check. Vue 2 alone disables the Vue 3 emits contract. React continues to use CommonJS-loadable ESLint 8 plugins because the modern baseline plugin is ESM-only.

The opt-in `/type-aware` config uses `recommended-type-checked`. Promise waiting remains an application decision: `no-floating-promises` and `strict-void-return` are disabled, while Promise misuse, invalid `await`, unsafe types, redundant conversions, and correctness-only `return-await` remain checked; Promise-returning event handlers are allowed in Vue templates and TSX attributes. Exported TypeScript module boundaries require explicit types, while internal functions, TSX component returns, and Vue SFC callbacks keep contextual inference.

Type-only imports and exports use standalone `import type` and `export type`, constructor-only private members use `readonly`, and the shared JavaScript policy rejects direct or indirect dynamic string execution, Promise executor returns, and the `void` operator. Vue setup code cannot use props or refs in ways that lose reactivity.

## Direct granular extends

[Full configuration and examples](http://docs.fastdotnet.cn/eslint-config-legacy/guide.en)

## Reusable configuration fragments

[Full configuration and examples](http://docs.fastdotnet.cn/eslint-config-legacy/guide.en)

## Typed project rules

[Full configuration and examples](http://docs.fastdotnet.cn/eslint-config-legacy/guide.en)

## Documentation

- [Compatibility matrix](http://docs.fastdotnet.cn/eslint-config-legacy/dependency-compatibility.en)
- [Default rules and risk guide](http://docs.fastdotnet.cn/eslint-config-legacy/rules-risk.en)
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

## License

[Apache-2.0](./LICENSE)
