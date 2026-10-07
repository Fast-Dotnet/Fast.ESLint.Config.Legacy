import { GLOB_VUE } from "../../constants";
import { javascriptRules, typescriptRules, typescriptTypeCheckedRules, vueRules } from "../../rules";
import { createTypeScriptExtends, createTypeScriptParserOptions } from "../typescript/factory";
import type { Linter } from "eslint";
import type { TypeAwareOptions } from "../typescript/factory";

/**
 * Vue 2/3 单文件组件的配置选项
 */
export interface VueConfigOptions extends TypeAwareOptions {
	/**
	 * 决定 upstream Vue preset 与主版本专属规则。
	 * @defaultValue `3`
	 */
	version?: 2 | 3;
	/**
	 * Vue 单文件组件范围
	 * @defaultValue 包含 {@link GLOB_VUE} 的单元素数组
	 */
	files?: string[];
	/**
	 * 是否在 Vue script 中启用 TypeScript parser 与规则
	 * @defaultValue `true`
	 */
	typescript?: boolean;
}

/**
 * 创建 Vue 2/3 单文件组件配置。
 *
 * `vue-eslint-parser` 始终负责模板；TypeScript 启用时再通过 `parserOptions.parser` 解析
 * script，并应用 TypeScript 核心替代规则。Vue common 规则在 upstream preset 之后应用，
 * 最后追加 Vue 主版本专属规则。
 *
 * @param options - Vue 主版本、文件范围、TypeScript 与类型感知选项。
 * @returns 匹配 Vue SFC 的单个 Legacy override。
 */
export const createVueConfigs = ({
	files = [GLOB_VUE],
	typeChecked = false,
	tsconfigRootDir,
	typescript = true,
	version = 3,
}: VueConfigOptions = {}): Linter.ConfigOverride[] => {
	const typeScriptOptions = { typeChecked, tsconfigRootDir };

	return [
		{
			files,
			extends: [
				...(typescript ? createTypeScriptExtends(typeScriptOptions) : []),
				version === 3 ? "plugin:vue/recommended" : "plugin:vue/vue2-recommended",
			],
			parser: "vue-eslint-parser",
			parserOptions: {
				...(typescript ? createTypeScriptParserOptions(typeScriptOptions) : { ecmaVersion: "latest", sourceType: "module" }),
				...(typescript ? { parser: "@typescript-eslint/parser" } : {}),
				ecmaFeatures: { jsx: true },
			},
			rules: {
				...javascriptRules,
				...(typescript ? typescriptRules : {}),
				...(typescript && typeScriptOptions.typeChecked ? typescriptTypeCheckedRules : {}),
				...(typescript
					? {
							// Vue SFC 允许按模板与运行时兜底处理未穷尽的联合类型或枚举。
							"@typescript-eslint/switch-exhaustiveness-check": "off",
							// SFC 以模板上下文和快速迭代为主，不强制补写函数返回类型或模块边界类型。
							"@typescript-eslint/explicit-function-return-type": "off",
							"@typescript-eslint/explicit-module-boundary-types": "off",
							// Vue 模板事件由框架接管异步结果；其余 Promise 误用继续检查。
							...(typeScriptOptions.typeChecked
								? { "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }] }
								: {}),
							// defineEmits 校验器和框架回调的形参可用于声明契约而不读取；普通未使用变量和导入仍然报错。
							"@typescript-eslint/no-unused-vars": ["error", { args: "none", caughtErrors: "none", ignoreRestSiblings: true }],
						}
					: {}),
				...vueRules,
				...(version === 2
					? {
							// Vue 2.6 及以下没有稳定的 emits 选项；仅在 Vue 2 兼容预设中关闭该 Vue 3 契约规则。
							"vue/require-explicit-emits": "off" as const,
						}
					: {}),
			},
		},
	];
};
