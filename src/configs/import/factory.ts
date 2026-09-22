import { registerStyleAwareImportRules } from "../../plugins/import";
import { importRules } from "../../rules";
import type { Linter } from "eslint";

registerStyleAwareImportRules();

/**
 * 创建模块导入配置。
 *
 * 共享库不猜测项目的路径别名或 resolver，因此只启用 import-x 推荐规则和确定性排序；
 * resolver 相关规则由 `importRules` 明确关闭。
 *
 * @param files - 应用 import-x 规则的脚本和框架文件 glob。
 * @returns 单个限定文件范围的 override；文件集合为空时返回空数组。
 */
export const createImportConfigs = (files: readonly string[]): Linter.ConfigOverride[] =>
	files.length > 0
		? [
				{
					files: [...files],
					extends: ["plugin:import-x/recommended"],
					parserOptions: { ecmaVersion: "latest", sourceType: "module" },
					rules: {
						...importRules,
						// 样式导入必须形成最后一个连续分组；规则不提供修复，避免改变 CSS 层叠顺序。
						"import-x/style-imports-last": "error",
					},
				},
			]
		: [];
