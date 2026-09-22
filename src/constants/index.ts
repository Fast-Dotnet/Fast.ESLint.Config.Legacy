/**
 * 配置创建器共用的文件匹配常量，通过 `@fast-china/eslint-config-legacy/constants` 公开导出。
 *
 * 所有 glob 都使用 ESLint 8 Legacy override 语义，以消费项目工作目录为匹配根。
 * 新增扩展名时必须同步检查环境、框架、声明文件和 CommonJS override。
 *
 * @packageDocumentation
 */

/** JavaScript 与 JSX 文件；扩展名列表与 Node.js ESM/CJS 约定保持一致。 */
export const GLOBS_JAVASCRIPT = ["**/*.{js,cjs,mjs,jsx}"] as const;

/** TypeScript 与 TSX 文件；包含 TypeScript 的 ESM/CJS 专用扩展名。 */
export const GLOBS_TYPESCRIPT = ["**/*.{ts,cts,mts,tsx}"] as const;

/** TypeScript 声明文件。 */
export const GLOB_DECLARATION = "**/*.d.{ts,cts,mts}";

/** Vue 2/3 单文件组件。 */
export const GLOB_VUE = "**/*.vue";

/** Angular 组件、指令、服务等框架源码。 */
export const GLOB_ANGULAR_TYPESCRIPT = "**/*.ts";

/** Angular 外部 HTML 模板；内联模板由 Angular processor 提取。 */
export const GLOB_ANGULAR_TEMPLATE = "**/*.html";

/** 严格 JSON 文件；JSONC 风格的 `.json` 工具配置会在配置层排除。 */
export const GLOB_JSON = "**/*.json";

/** 显式使用 `.jsonc` 扩展名的 JSON with Comments 文件。 */
export const GLOB_JSONC = "**/*.jsonc";

/** JSON5 文件。 */
export const GLOB_JSON5 = "**/*.json5";

/** Markdown 文档。 */
export const GLOB_MARKDOWN = "**/*.md";

/** YAML 文档。 */
export const GLOB_YAML = "**/*.{yaml,yml}";

/** 默认由 JavaScript、TypeScript 与 Vue 规则处理的全部代码文件。 */
export const GLOBS_CODE = [...GLOBS_JAVASCRIPT, ...GLOBS_TYPESCRIPT, GLOB_VUE] as const;

/**
 * 默认按照 Node.js 环境处理的工程文件。
 *
 * 根配置或消费项目决定应用源码环境，避免 browser/node 全局变量互相掩盖。
 */
export const GLOBS_NODE_TOOLING = [
	"**/*.{config,setup}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
	"**/.*rc.{js,cjs,mjs,ts,cts,mts}",
	"**/{scripts,bin}/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
	"**/{test,tests,__tests__}/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
	"**/*.{test,spec}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
	"**/cli.{js,cjs,mjs,ts,cts,mts}",
] as const;

/** TypeScript 配置文件。 */
export const GLOBS_TSCONFIG = ["**/tsconfig.json", "**/tsconfig.*.json"] as const;

/** 允许注释、但扩展名仍为 .json 的常见工具配置。 */
export const GLOBS_JSONC_AS_JSON = [...GLOBS_TSCONFIG, "**/.vscode/settings.json"] as const;

/** CommonJS 文件；这些文件允许显式 require()。 */
export const GLOBS_COMMONJS = ["**/*.cjs", "**/*.cts"] as const;
