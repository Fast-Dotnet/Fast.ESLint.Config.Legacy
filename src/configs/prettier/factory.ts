import eslintConfigPrettier from "eslint-config-prettier";
import type { Linter } from "eslint";

// 这些规则与 Prettier 输出兼容，并承载项目约定，无需由兼容层关闭。
const prettierRules = { ...eslintConfigPrettier.rules };
delete prettierRules.curly;

/**
 * 创建 Prettier 兼容层。
 *
 * 它只关闭冲突规则，不在 ESLint 中执行 Prettier；项目规则仍在它之后生效。
 *
 * @param files - 需要关闭格式冲突规则的代码文件 glob。
 * @returns 单个 Prettier 兼容规则 override；文件集合为空时返回空数组。
 */
export const createPrettierConfigs = (files: readonly string[]): Linter.ConfigOverride[] =>
	files.length > 0 ? [{ files: [...files], rules: prettierRules }] : [];
