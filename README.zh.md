**简体中文** | [English](./README.md)

<p align="center">
	<img src="./Fast.png" width="128" alt="Fast.ESLint.Config.Legacy Logo" />
</p>

<h1 align="center">Fast.ESLint.Config.Legacy</h1>

<p align="center">
	<a href="https://www.npmjs.com/package/@fast-china/eslint-config-legacy"><img src="https://img.shields.io/npm/v/@fast-china/eslint-config-legacy?logo=npm" alt="npm version" /></a>
	<a href="https://www.npmjs.com/package/@fast-china/eslint-config-legacy"><img src="https://img.shields.io/npm/dm/@fast-china/eslint-config-legacy" alt="npm downloads" /></a>
	<a href="./LICENSE"><img src="https://img.shields.io/npm/l/@fast-china/eslint-config-legacy" alt="License" /></a>
</p>

面向 ESLint 8 的 Legacy 配置 SDK，保留 CommonJS、eslintrc 和按需配置入口。

**[使用文档](http://docs.fastdotnet.cn/zh-CN/frontend/eslint-config-legacy/) · [官方网站](http://fastdotnet.com)**

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

## 快速开始

```js
// .eslintrc.cjs
module.exports = {
	root: true,
	extends: ["@fast-china/eslint-config-legacy"],
};
```

根入口默认启用 browser globals、JavaScript、TypeScript、Vue 3、import-x、Promise、RegExp、JSON 方言、YAML、Markdown、CommonJS/工程文件兼容与 Prettier 冲突处理。

2.1.10 待发布源码延续 2.1.9 的 ESLint 8、可选类型感知检查、Vue 2 及全部 Legacy 公开预设，保留兼容规则策略，并同步 Fast.ESLint.Config 2.1.10 的技能文件默认忽略修复。Vue 单文件组件关闭 `switch-exhaustiveness-check`，普通 TypeScript 与 TSX 仍按 error 检查；仅 Vue 2 关闭 Vue 3 的 emits 契约。React 继续使用 ESLint 8 可同步加载的 CommonJS 插件，因为现代基准插件仅提供 ESM。

按需叠加的 `/type-aware` 使用 `recommended-type-checked`。Promise 是否等待由业务语义决定，因此关闭 `no-floating-promises` 与 `strict-void-return`，但继续检查 Promise 误用、错误的 `await`、unsafe 类型、冗余转换以及异常处理正确性所需的 `return-await`；Vue 模板与 TSX 属性允许 Promise 返回的事件处理函数。导出的 TypeScript 模块边界要求显式类型，内部函数、TSX 组件返回值及 Vue SFC 回调保留上下文推断。

纯类型导入和导出使用独立的 `import type` 与 `export type`，只在构造阶段赋值的私有成员使用 `readonly`。共享 JavaScript 规则禁止直接或间接动态执行字符串、Promise executor 返回值与 `void` 操作符，要求多行分支使用花括号，并将已有的 `default` 分支放在最后；Vue setup 禁止以丢失响应性的方式使用 props 或 ref。

## 常见用法

需要逐步接入时，可以只选择实际需要的细分配置：

```js
// .eslintrc.cjs
module.exports = {
	root: true,
	extends: ["@fast-china/eslint-config-legacy/javascript", "@fast-china/eslint-config-legacy/typescript"],
};
```

ESLint 8 配置不能直接使用 Flat Config API；框架、类型感知和格式化能力按公开子入口组合。

## 文档

- [依赖兼容矩阵](http://docs.fastdotnet.cn/zh-CN/frontend/eslint-config-legacy/dependency-compatibility)
- [默认规则与风险指南](http://docs.fastdotnet.cn/zh-CN/frontend/eslint-config-legacy/rules-risk)
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

## 版权、许可证与使用声明

版权所有 © 2018-Now 小方。本项目依据 [Apache License 2.0](./LICENSE) 开源；在遵守许可证的前提下，可以使用、修改和分发本软件，包括商业使用。

再分发时，应按许可证要求提供许可证副本、对修改的文件作出显著说明，并保留适用的版权和归属声明；包含需要保留的 NOTICE 信息时一并处理。本说明不替代正式许可证，也不额外要求在产品界面展示作者或项目标识。

使用者应就自身使用、二次开发、部署、数据处理及运营活动遵守适用法律和第三方合法权益，自行取得依法需要的授权。上述内容为合规提醒，不构成附加许可条件。

除适用法律另有规定或另有书面约定外，本软件按“原样”提供；保证排除与责任限制以许可证第 7、8 条为准。提供本项目不代表原作者为使用者的二次开发和运营活动背书，也不当然承担其对第三方作出的合同承诺。本说明不排除依法不得排除的责任。
