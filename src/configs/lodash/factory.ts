import { preferLodashRules, preferLodashUnifiedRules } from "../../rules";
import type { Linter } from "eslint";

/**
 * Lodash 静态导入来源策略
 */
export type LodashPreference = "lodash" | "lodash-unified";

/**
 * 创建 Lodash 静态导入来源约束。
 *
 * @param preference - 唯一允许使用的 Lodash 包入口。
 * @param files - 应用该组织策略的代码文件 glob。
 * @returns 单个规则 override；文件集合为空时返回空数组。
 */
export const createLodashConfigs = (preference: LodashPreference, files: readonly string[]): Linter.ConfigOverride[] =>
	files.length > 0
		? [
				{
					files: [...files],
					rules: preference === "lodash" ? preferLodashRules : preferLodashUnifiedRules,
				},
			]
		: [];
