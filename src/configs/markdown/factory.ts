import { GLOB_MARKDOWN } from "../../constants";
import type { Linter } from "eslint";

/**
 * Markdown 根级 processor 与虚拟代码块 override 的组合结果
 */
export interface MarkdownConfigs {
	/** 必须放在 Legacy 根配置的 Markdown processor 预置。 */
	extends: string[];
	/** 只作用于 processor 从 fenced code block 生成的虚拟文件。 */
	overrides: Linter.ConfigOverride[];
}

/**
 * 创建 Markdown processor 与虚拟代码块配置。
 *
 * 示例代码缺少完整工程上下文，因此关闭 resolver、未使用符号和控制台等高噪声检查。
 * processor 的根级 extends 与虚拟文件 override 分开返回，调用方必须保留两部分和顺序。
 *
 * @returns 根级 Markdown extends 与代码块 override 的组合结果。
 */
export const createMarkdownConfigs = (): MarkdownConfigs => ({
	extends: ["plugin:markdown/recommended-legacy"],
	overrides: [
		{
			files: [`${GLOB_MARKDOWN}/**`],
			rules: {
				"@typescript-eslint/no-unused-vars": "off",
				"import-x/no-duplicates": "off",
				"import-x/no-unresolved": "off",
				"no-console": "off",
				"no-undef": "off",
				"promise/catch-or-return": "off",
			},
		},
	],
});
