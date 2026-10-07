import { GLOBS_TSCONFIG } from "../../constants";
import { tsconfigJsonSortRules } from "../../rules";
import { createJsonExtends } from "../json/factory";
import type { Linter } from "eslint";

/**
 * `tsconfig*.json` 排序 override 的组合选项
 */
export interface TsconfigSortConfigOptions {
	/**
	 * JSON 基础配置是否已经由根配置或自定义组合启用
	 * @defaultValue `true`
	 */
	json?: boolean;
	/**
	 * 补建 JSONC 基础配置时是否启用 Prettier 兼容层
	 * @defaultValue `true`
	 */
	prettier?: boolean;
}

/**
 * 创建显式启用的 `tsconfig*.json` 排序 override。
 *
 * 当调用方没有加载 JSON 基础配置时，该函数会补充 JSONC parser 与推荐规则，确保注释
 * 合法且被保留。排序只改变字段顺序，不改变编译器选项、文件列表或项目引用值。
 *
 * @param options - JSON 基础配置存在性及 Prettier 兼容层开关。
 * @returns 匹配根和派生 tsconfig 文件的单个 override。
 */
export const createTsconfigSortConfigs = ({ json = true, prettier = true }: TsconfigSortConfigOptions = {}): Linter.ConfigOverride[] => [
	{
		files: [...GLOBS_TSCONFIG],
		...(json ? {} : { extends: createJsonExtends("jsonc", prettier) }),
		rules: tsconfigJsonSortRules,
	},
];
