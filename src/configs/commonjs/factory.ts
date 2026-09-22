import { GLOBS_COMMONJS } from "../../constants";
import type { Linter } from "eslint";

/**
 * 创建 CommonJS 扩展名兼容 override。
 *
 * `.cjs` 与 `.cts` 已明确表达模块格式，因此关闭禁止 `require()` 的 TypeScript 规则；
 * 该 override 不改变 parser、env 或其他模块规则。
 *
 * @returns `.cjs` 与 `.cts` 文件共用的单个规则 override。
 */
export const createCommonJsConfigs = (): Linter.ConfigOverride[] => [
	{
		files: [...GLOBS_COMMONJS],
		rules: { "@typescript-eslint/no-require-imports": "off" },
	},
];
