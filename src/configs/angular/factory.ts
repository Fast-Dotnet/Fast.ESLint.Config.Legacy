import { GLOB_ANGULAR_TEMPLATE, GLOB_ANGULAR_TYPESCRIPT } from "../../constants";
import { angularRules, angularTemplateAccessibilityRules, angularTemplateRules } from "../../rules";
import { createTypeScriptConfig } from "../typescript/factory";
import type { Linter } from "eslint";
import type { TypeScriptConfigOptions } from "../typescript/factory";

/**
 * Angular TypeScript 源码、外部模板和内联模板的配置选项。
 *
 * 根入口默认不启用 Angular；消费项目需要 Angular、特殊 selector、文件范围
 * 或模板策略时，可通过 {@link createAngularConfigs} 自定义组合，或在自己的 `.eslintrc` override 中配置。
 */
export interface AngularConfigOptions {
	/**
	 * Angular TypeScript 文件范围；monorepo 应显式限定到 Angular 应用目录。
	 * @defaultValue 包含 {@link GLOB_ANGULAR_TYPESCRIPT} 的单元素数组
	 */
	typescriptFiles?: string[];
	/**
	 * Angular 外部模板文件范围
	 * @defaultValue 包含 {@link GLOB_ANGULAR_TEMPLATE} 的单元素数组
	 */
	templateFiles?: string[];
	/**
	 * 是否从 `@Component()` 元数据中抽取并检查内联模板
	 * @defaultValue `true`
	 */
	inlineTemplates?: boolean;
	/**
	 * 是否启用 angular-eslint 官方模板无障碍预置
	 * @defaultValue `true`
	 */
	templateAccessibility?: boolean;
}

/**
 * 创建 Angular TypeScript、外部模板与内联模板 Legacy overrides。
 *
 * TypeScript override 先继承 typescript-eslint，再追加 Angular 推荐规则；启用内联模板时
 * 同一个 override 会注册 Angular template processor。外部模板始终使用专用 template parser。
 * 空文件范围不会创建对应 override。
 *
 * @param options - Angular 文件范围、processor 与模板无障碍选项。
 * @param typeScriptOptions - 传递给 TypeScript 配置层的 parser 与类型感知选项。
 * @returns 按 TypeScript 源码、外部模板顺序排列的 ESLint 8 overrides。
 */
export const createAngularConfigs = (
	{
		inlineTemplates = true,
		templateAccessibility = true,
		templateFiles = [GLOB_ANGULAR_TEMPLATE],
		typescriptFiles = [GLOB_ANGULAR_TYPESCRIPT],
	}: AngularConfigOptions = {},
	typeScriptOptions: TypeScriptConfigOptions = {}
): Linter.ConfigOverride[] => {
	const typeScriptConfig = createTypeScriptConfig(typeScriptOptions, typescriptFiles);

	return [
		...(typescriptFiles.length > 0
			? [
					{
						...typeScriptConfig,
						files: typescriptFiles,
						extends: typeScriptConfig.extends,
						plugins: ["@angular-eslint", ...(inlineTemplates ? ["@angular-eslint/template"] : [])],
						...(inlineTemplates
							? {
									processor: "@angular-eslint/template/extract-inline-html",
								}
							: {}),
						rules: { ...typeScriptConfig.rules, ...angularRules },
					},
				]
			: []),
		...(templateFiles.length > 0
			? [
					{
						files: templateFiles,
						parser: "@angular-eslint/template-parser",
						plugins: ["@angular-eslint/template"],
						rules: {
							...angularTemplateRules,
							...(templateAccessibility ? angularTemplateAccessibilityRules : {}),
						},
					},
				]
			: []),
	];
};
