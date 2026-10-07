import { packageJsonSortRules } from "../../rules";
import { createJsonExtends } from "../json/factory";
import type { Linter } from "eslint";

/**
 * `package.json` 排序 override 的组合选项
 */
export interface PackageJsonSortConfigOptions {
	/**
	 * JSON 基础配置是否已经由根配置或自定义组合启用
	 * @defaultValue `true`
	 */
	json?: boolean;
	/**
	 * 补建 JSON 基础配置时是否启用 Prettier 兼容层
	 * @defaultValue `true`
	 */
	prettier?: boolean;
}

/**
 * 创建显式启用的 `package.json` 排序 override。
 *
 * 当调用方没有加载 JSON 基础配置时，该函数会为 `package.json` 补充严格 JSON parser
 * 与推荐规则。实际字段顺序由 `packageJsonSortRules` 定义，并刻意避开条件导出对象。
 *
 * @param options - JSON 基础配置存在性及 Prettier 兼容层开关。
 * @returns 只匹配 `package.json` 的单个 override。
 */
export const createPackageJsonSortConfigs = ({ json = true, prettier = true }: PackageJsonSortConfigOptions = {}): Linter.ConfigOverride[] => [
	{
		files: ["**/package.json"],
		...(json ? {} : { extends: createJsonExtends("json", prettier) }),
		rules: packageJsonSortRules,
	},
];
