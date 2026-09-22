/**
 * 面向 Vue 3、TypeScript、Vite 与浏览器后台管理项目的默认 ESLint 8 Legacy Config。
 * 配置创建函数、glob 常量和规则记录分别由 `./configs`、`./constants` 与 `./rules` 提供。
 *
 * @packageDocumentation
 */
import { createCommonConfigs } from "./configs/common/factory";
import { createCommonJsConfigs } from "./configs/commonjs/factory";
import { createEnvironmentConfigs, createNodeToolingConfigs } from "./configs/environment/factory";
import { createImportConfigs } from "./configs/import/factory";
import { createJavaScriptConfigs } from "./configs/javascript/factory";
import { createJsonConfigs } from "./configs/json/factory";
import { createMarkdownConfigs } from "./configs/markdown/factory";
import { createPrettierConfigs } from "./configs/prettier/factory";
import { createPromiseConfigs } from "./configs/promise/factory";
import { createRegexpConfigs } from "./configs/regexp/factory";
import { createTypeScriptConfigs, createTypeScriptDeclarationConfigs } from "./configs/typescript/factory";
import { createVueConfigs } from "./configs/vue/factory";
import { createYamlConfigs } from "./configs/yaml/factory";
import { GLOBS_CODE } from "./constants";
import type { Linter } from "eslint";

/** Markdown processor 需要根级 extends，虚拟代码块规则则合并到 overrides。 */
const markdownConfigs = createMarkdownConfigs();

/**
 * Vue 3 Web 浏览器管理项目的完整 ESLint 8 Legacy Config 配置。
 *
 * 该配置统一检查 JavaScript、TypeScript、Vue 3 单文件组件、JSON、YAML 与 Markdown，
 * 并启用 import、Promise、RegExp 和 Prettier 兼容规则。应用源码使用 browser 环境；
 * CommonJS、构建脚本、测试及其他工程文件会按文件范围获得 Node.js globals。
 *
 * Markdown processor 必须通过根级 `extends` 注册，其虚拟代码块规则则合并到
 * `overrides`。Vue 2、React、Angular、类型感知及排序规则不会默认启用，应通过对应
 * 子路径按需叠加。
 *
 * @example
 * ```js
 * module.exports = {
 *   root: true,
 *   extends: ["@fast-china/eslint-config-legacy"],
 * };
 * ```
 *
 * @public
 */
const config: Linter.Config = {
	extends: markdownConfigs.extends,
	// 与现代配置一致排除技能内容；Prettier 仍需独立配置忽略。
	ignorePatterns: ["**/.agents/**", "**/skills-lock.json"],
	reportUnusedDisableDirectives: true,
	overrides: [
		...createEnvironmentConfigs({ environment: "browser", files: GLOBS_CODE }),
		...createCommonConfigs(GLOBS_CODE),
		...createJavaScriptConfigs(),
		...createTypeScriptConfigs(),
		...createVueConfigs({ version: 3 }),
		...createImportConfigs(GLOBS_CODE),
		...createPromiseConfigs(GLOBS_CODE),
		...createRegexpConfigs(GLOBS_CODE),
		...createJsonConfigs(),
		...createYamlConfigs(),
		...createTypeScriptDeclarationConfigs(),
		...createCommonJsConfigs(),
		...createNodeToolingConfigs(),
		...markdownConfigs.overrides,
		...createPrettierConfigs(GLOBS_CODE),
	],
};

export default config;
