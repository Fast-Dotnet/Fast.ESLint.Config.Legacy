import { GLOB_YAML } from "../../constants";
import type { Linter } from "eslint";

/**
 * YAML 配置的选项。
 */
export interface YamlConfigOptions {
	/**
	 * 是否追加 eslint-plugin-yml 的 Prettier 兼容预置
	 * @defaultValue `true`
	 */
	prettier?: boolean;
}

/**
 * 创建 YAML 解析、推荐规则与可选 Prettier 兼容配置。
 *
 * @param options - Prettier 兼容层开关。
 * @returns 匹配 `.yaml` 与 `.yml` 的单个 override。
 */
export const createYamlConfigs = ({ prettier = true }: YamlConfigOptions = {}): Linter.ConfigOverride[] => [
	{
		files: [GLOB_YAML],
		parser: "yaml-eslint-parser",
		extends: ["plugin:yml/recommended", ...(prettier ? ["plugin:yml/prettier"] : [])],
	},
];
