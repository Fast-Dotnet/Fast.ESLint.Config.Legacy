<p align="left">
	<strong>简体中文</strong> | <a href="./README.md">English</a>
</p>

<p align="center">
	<img src="./Fast.png" alt="logo" width="160" />
</p>

# @fast-china/eslint-config-legacy

**[使用文档](http://docs.fastdotnet.cn/eslint-config-legacy/) · [官方网站](http://fastdotnet.com)**

面向 Vue Web 浏览器管理项目的生产级 ESLint 8 `.eslintrc` 配置。可复用创建器同时支持 Vue 2/3、React、Angular、Node.js、TypeScript、JavaScript、JSON、YAML、Markdown、Promise、RegExp 与 import 规则。

[![npm version](https://img.shields.io/npm/v/@fast-china/eslint-config-legacy?color=orange)](https://www.npmjs.com/package/@fast-china/eslint-config-legacy) [![Node.js](https://img.shields.io/badge/node-%5E22.18%20%7C%7C%20%5E24.18-brightgreen)](https://nodejs.org/) [![ESLint](https://img.shields.io/badge/eslint-%5E8.57-4b32c3)](https://eslint.org/) [![license](https://img.shields.io/npm/l/@fast-china/eslint-config-legacy)](./LICENSE)

## 版本定位

包提供一个合并配置入口、可直接继承的细粒度配置和三个编程入口：

- 包根：面向 Vue 3、TypeScript、Vite 浏览器后台管理项目。
- `/typescript`、`/vue`、`/vue2` 等顶层子路径：可直接写入 `extends` 的细粒度配置。
- `/configs`：可复用 Legacy Config 配置片段创建器，保留 Vue 2 与 Vue 3。
- `/constants`：共享文件 glob。
- `/rules`：带类型的本地规则记录与 `RuleOptions`。

项目不再包含 presets 目录或预置分发器。每个 `src/configs/<name>/index.ts` 都是可直接加载的默认 Legacy 配置，可复用创建器就近放在同目录的 `factory.ts` 中；`src/index.ts` 使用这些创建器组合包根配置。

## 环境要求

- Node.js `^22.18.0 || ^24.18.0`
- 仓库开发使用 pnpm `^11.0.0`
- ESLint `^8.57.0`
- TypeScript `^4.0.0 || ^5.0.0 || ^6.0.0`

## 安装

```sh
pnpm add -D eslint@^8.57.0 typescript @fast-china/eslint-config-legacy
```

插件与解析器都是本包的直接依赖。

## 默认配置

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

根入口默认启用 browser globals、JavaScript、TypeScript、Vue 3、import-x、Promise、RegExp、JSON 方言、YAML、Markdown、CommonJS/工程文件兼容与 Prettier 冲突处理。

2.1.9 在保留 ESLint 8、可选类型感知检查、Vue 2 及全部 Legacy 公开预设的同时，与 Fast.ESLint.Config 2.1.9 工作区同步可兼容的规则源码。Vue 单文件组件关闭 `switch-exhaustiveness-check`，普通 TypeScript 与 TSX 仍按 error 检查；仅 Vue 2 关闭 Vue 3 的 emits 契约。React 继续使用 ESLint 8 可同步加载的 CommonJS 插件，因为现代基准插件仅提供 ESM。

按需叠加的 `/type-aware` 使用 `recommended-type-checked`。Promise 是否等待由业务语义决定，因此关闭 `no-floating-promises` 与 `strict-void-return`，但继续检查 Promise 误用、错误的 `await`、unsafe 类型、冗余转换以及异常处理正确性所需的 `return-await`；Vue 模板与 TSX 属性允许 Promise 返回的事件处理函数。导出的 TypeScript 模块边界要求显式类型，内部函数、TSX 组件返回值及 Vue SFC 回调保留上下文推断。

纯类型导入和导出使用独立的 `import type` 与 `export type`，只在构造阶段赋值的私有成员使用 `readonly`。共享 JavaScript 规则禁止直接或间接动态执行字符串、Promise executor 返回值与 `void` 操作符，要求多行分支使用花括号，并将已有的 `default` 分支放在最后；Vue setup 禁止以丢失响应性的方式使用 props 或 ref。

## 细粒度 extends

[完整配置与示例](http://docs.fastdotnet.cn/eslint-config-legacy/guide)

## 可复用配置片段

[完整配置与示例](http://docs.fastdotnet.cn/eslint-config-legacy/guide)

## 类型安全的项目规则

[完整配置与示例](http://docs.fastdotnet.cn/eslint-config-legacy/guide)

## 文档

- [依赖兼容矩阵](http://docs.fastdotnet.cn/eslint-config-legacy/dependency-compatibility)
- [默认规则与风险指南](http://docs.fastdotnet.cn/eslint-config-legacy/rules-risk)
- [工程质量审查报告](./docs/engineering-audit.zh.md)
- [贡献指南](./CONTRIBUTING.md)
- [安全策略](./SECURITY.md)
- [更新日志](./CHANGELOG.md)

## 开发与发布检查

```sh
pnpm install --frozen-lockfile
pnpm typegen
pnpm check
pnpm --config.ignore-scripts=true pack --dry-run
```

修改源码时可使用 `pnpm dev` 启动长期运行的 tsdown 监听构建。

测试按照验证目标分为消费者类型、运行时配置和包契约。`pnpm test` 会先构建，再依次运行三组测试。

## 许可证

[Apache-2.0](./LICENSE)
