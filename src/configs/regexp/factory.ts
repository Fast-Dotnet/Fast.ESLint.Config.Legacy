import { regexpRules } from "../../rules";
import type { Linter } from "eslint";

/**
 * 创建正则表达式正确性与安全配置。
 *
 * 显式启用与现代配置一致的无效结构、潜在错误和灾难性回溯规则，不继承包含
 * 样式偏好的完整 recommended 预置。部分规则支持自动修复，修复后仍需验证真实匹配行为。
 *
 * @param files - 应用 RegExp 规则的代码文件 glob。
 * @returns 单个推荐规则 override；文件集合为空时返回空数组。
 */
export const createRegexpConfigs = (files: readonly string[]): Linter.ConfigOverride[] =>
	files.length > 0
		? [
				{
					files: [...files],
					plugins: ["regexp"],
					parserOptions: { ecmaVersion: "latest", sourceType: "module" },
					rules: regexpRules,
				},
			]
		: [];
