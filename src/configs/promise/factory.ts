import type { Linter } from "eslint";

/**
 * 创建 Promise 控制流与异常处理推荐配置。
 *
 * 该配置应用 `plugin:promise/recommended`，不启动类型服务；需要类型信息的 Promise
 * 检查由 `/type-aware` 中的 typescript-eslint 预置提供。
 *
 * @param files - 应用 Promise 规则的代码文件 glob。
 * @returns 单个推荐规则 override；文件集合为空时返回空数组。
 */
export const createPromiseConfigs = (files: readonly string[]): Linter.ConfigOverride[] =>
	files.length > 0
		? [
				{
					files: [...files],
					extends: ["plugin:promise/recommended"],
					parserOptions: { ecmaVersion: "latest", sourceType: "module" },
				},
			]
		: [];
