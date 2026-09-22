import { GLOBS_TYPESCRIPT, GLOB_DECLARATION, GLOB_VUE } from "../../constants";
import { javascriptRules, typescriptRules, typescriptTypeCheckedRules } from "../../rules";
import type { Linter } from "eslint";

interface TypeScriptConfigOverride extends Linter.ConfigOverride {
	extends: string[];
	rules: Linter.RulesRecord;
}

/**
 * TypeScript parser 与 Project Service 的配置选项。
 */
export interface TypeAwareOptions {
	/**
	 * 启用 typescript-eslint 类型感知预置与 Project Service。
	 * @defaultValue `false`
	 */
	typeChecked?: boolean;
	/** Project Service 查找 tsconfig 的根目录；未提供时由 typescript-eslint 推断。 */
	tsconfigRootDir?: string;
}

/**
 * 普通 TypeScript 文件的配置选项。
 */
export interface TypeScriptConfigOptions extends TypeAwareOptions {
	/**
	 * TypeScript/TSX 文件范围
	 * @defaultValue {@link GLOBS_TYPESCRIPT}
	 */
	files?: string[];
}

/**
 * 创建 TypeScript 与 Vue TypeScript 共用的 parserOptions。
 *
 * 非类型感知模式只声明现代 ECMAScript module 语义；类型感知模式另外启动 Project
 * Service，统一声明 Vue 与 NVue 扩展名，并只在调用方明确提供时写入 `tsconfigRootDir`。
 * 所有类型感知文件必须保持相同的 `extraFileExtensions`，避免 TypeScript Server 在混合
 * 检查 TypeScript 与 Vue 文件时反复重载项目。
 *
 * @param options - 类型感知开关及可选 tsconfig 根目录。
 * @returns 可用于 `@typescript-eslint/parser` 或 Vue 子 parser 的新 parserOptions 对象。
 */
export const createTypeScriptParserOptions = (options: TypeAwareOptions = {}): Linter.ParserOptions => ({
	ecmaVersion: "latest",
	sourceType: "module",
	...(options.typeChecked
		? {
				projectService: true,
				extraFileExtensions: [".vue", ".nvue"],
				...(options.tsconfigRootDir ? { tsconfigRootDir: options.tsconfigRootDir } : {}),
			}
		: {}),
});

/**
 * 返回与类型感知模式对应的 typescript-eslint Legacy 推荐预置。
 *
 * @param options - 类型感知开关。
 * @returns 与现代基准的 recommendedTypeChecked 对应的 Legacy extends 名称。
 */
export const createTypeScriptExtends = (options: TypeAwareOptions = {}): string[] =>
	options.typeChecked ? ["plugin:@typescript-eslint/recommended-type-checked"] : ["plugin:@typescript-eslint/recommended"];

/**
 * 创建 TypeScript 配置。
 *
 * 本地 JavaScript 规则继续覆盖 TS 文件，再由 typescript-eslint 替代规则关闭不理解类型语法的核心实现。
 *
 * @param options - TypeScript 文件范围与类型感知 parser 选项。
 * @param files - 显式文件范围，优先于 `options.files`；省略时使用 `options.files`，后者未提供时使用 {@link GLOBS_TYPESCRIPT}。
 * @returns 包含 parser、extends、parserOptions 与完整本地规则记录的单个 override。
 */
export const createTypeScriptConfig = (
	options: TypeScriptConfigOptions = {},
	files: readonly string[] = options.files ?? GLOBS_TYPESCRIPT
): TypeScriptConfigOverride => ({
	files: [...files],
	extends: createTypeScriptExtends(options),
	parser: "@typescript-eslint/parser",
	parserOptions: {
		...createTypeScriptParserOptions(options),
		ecmaFeatures: { jsx: true },
	},
	rules: {
		...javascriptRules,
		...typescriptRules,
		...(options.typeChecked ? typescriptTypeCheckedRules : {}),
	},
});

/**
 * 将 {@link createTypeScriptConfig} 包装为组合器使用的 override 数组。
 *
 * @param options - TypeScript 文件范围与 parser 选项。
 * @returns 始终包含一个 TypeScript override 的数组。
 */
export const createTypeScriptConfigs = (options: TypeScriptConfigOptions = {}): Linter.ConfigOverride[] => [createTypeScriptConfig(options)];

/**
 * 创建 TypeScript 声明文件兼容 override。
 *
 * 声明文件允许未使用的公共符号和仅用于全局扩展的类型导入，因此关闭普通源码中用于
 * 清理实现细节的 unused 与 type-import 规则。该 override 应位于普通 TypeScript 配置之后。
 *
 * @returns 匹配 `.d.ts`、`.d.cts` 与 `.d.mts` 的单个 override。
 */
export const createTypeScriptDeclarationConfigs = (): Linter.ConfigOverride[] => [
	{
		files: [GLOB_DECLARATION],
		rules: {
			"@typescript-eslint/consistent-type-imports": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
];

/**
 * 创建可叠加在任意 TypeScript、React、Angular 或 Vue 配置之后的类型感知片段。
 *
 * Project Service 会从被检查文件向上寻找最近的 tsconfig；复杂 monorepo 可以在自己的
 * `.eslintrc` override 中补充 `parserOptions.tsconfigRootDir`。
 * TypeScript/TSX 与 Vue SFC 使用独立 parser 链，避免 Vue 模板被 TypeScript parser 误读。
 *
 * @returns 依次覆盖 TypeScript 方言与 Vue SFC 的两个类型感知 overrides。
 */
export const createTypeAwareConfigs = (): Linter.ConfigOverride[] => {
	const typeAwareOptions = { typeChecked: true } as const;
	const typeAwareExtends = createTypeScriptExtends(typeAwareOptions);

	return [
		{
			files: [...GLOBS_TYPESCRIPT],
			extends: typeAwareExtends,
			parser: "@typescript-eslint/parser",
			parserOptions: {
				...createTypeScriptParserOptions(typeAwareOptions),
				ecmaFeatures: { jsx: true },
			},
			rules: typescriptTypeCheckedRules,
		},
		{
			files: [GLOB_VUE],
			extends: typeAwareExtends,
			parser: "vue-eslint-parser",
			parserOptions: {
				...createTypeScriptParserOptions(typeAwareOptions),
				parser: "@typescript-eslint/parser",
				ecmaFeatures: { jsx: true },
			},
			rules: {
				...typescriptTypeCheckedRules,
				// Vue SFC 允许按模板与运行时兜底处理未穷尽的联合类型或枚举。
				"@typescript-eslint/switch-exhaustiveness-check": "off",
				// SFC 以模板上下文和快速迭代为主，不强制补写函数返回类型或模块边界类型。
				"@typescript-eslint/explicit-function-return-type": "off",
				"@typescript-eslint/explicit-module-boundary-types": "off",
				// Vue 模板事件由框架接管异步结果；其余 Promise 误用继续检查。
				"@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],
				// 声明型框架回调可保留未使用形参；普通未使用变量和导入仍然报错。
				"@typescript-eslint/no-unused-vars": ["error", { args: "none", caughtErrors: "none", ignoreRestSiblings: true }],
			},
		},
	];
};
