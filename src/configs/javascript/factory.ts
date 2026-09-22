import { GLOBS_JAVASCRIPT } from "../../constants";
import { javascriptRules } from "../../rules";
import type { Linter } from "eslint";

interface JavaScriptConfigOverride extends Linter.ConfigOverride {
	rules: Linter.RulesRecord;
}

/**
 * 创建 JavaScript 与 JSX 配置。
 *
 * JSX 解析在这里显式开启；基础正确性和公共规则由更早的 `createCommonConfigs()` 提供。
 *
 * @param files - 由该 override 接管的 JavaScript 文件 glob，默认使用 {@link GLOBS_JAVASCRIPT}。
 * @returns 包含 parserOptions 与本地 JavaScript 规则的单个 override。
 */
export const createJavaScriptConfig = (files: readonly string[] = GLOBS_JAVASCRIPT): JavaScriptConfigOverride => ({
	files: [...files],
	parserOptions: {
		ecmaVersion: "latest",
		ecmaFeatures: { jsx: true },
		sourceType: "module",
	},
	rules: javascriptRules,
});

/**
 * 将 {@link createJavaScriptConfig} 包装为组合器使用的 override 数组。
 *
 * @param files - 由 JavaScript 配置接管的文件 glob，默认使用 {@link GLOBS_JAVASCRIPT}。
 * @returns 始终包含一个 JavaScript override 的数组。
 */
export const createJavaScriptConfigs = (files: readonly string[] = GLOBS_JAVASCRIPT): Linter.ConfigOverride[] => [createJavaScriptConfig(files)];
