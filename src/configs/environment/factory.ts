import { GLOBS_NODE_TOOLING } from "../../constants";
import type { Linter } from "eslint";

/**
 * 根配置与自定义组合支持的应用源码运行环境。
 *
 * `universal` 同时提供 browser 和 Node.js globals，适用于明确共享同一源码的 SSR 场景。
 */
export type RuntimeEnvironment = "browser" | "node" | "universal";

/**
 * 应用源码环境 override 的创建选项。
 */
export interface EnvironmentConfigOptions {
	/**
	 * 应用源码实际运行的环境
	 * @defaultValue `"browser"`
	 */
	environment?: RuntimeEnvironment;
	/**
	 * 需要获得运行时环境 globals 的代码文件；空数组表示不生成 override。
	 * @defaultValue `[]`
	 */
	files?: readonly string[];
}

/** 将运行时选择转换为 ESLint 8 Legacy Config 的 env 映射。 */
const createRuntimeEnvironment = (environment: RuntimeEnvironment): NonNullable<Linter.ConfigOverride["env"]> => ({
	es2022: true,
	browser: environment !== "node",
	node: environment !== "browser",
});

/**
 * 创建应用源码运行时环境配置。
 *
 * @param options - 运行环境和目标文件范围。
 * @returns 一个限定文件范围的 env override；文件范围为空时返回空数组。
 */
export const createEnvironmentConfigs = ({ environment = "browser", files = [] }: EnvironmentConfigOptions = {}): Linter.ConfigOverride[] =>
	files.length > 0 ? [{ files: [...files], env: createRuntimeEnvironment(environment) }] : [];

/**
 * 创建 Node.js 工程文件环境配置。
 *
 * 配置仅匹配 config、setup、scripts、bin、CLI 和测试命名的工程文件，不会把 Node globals
 * 泄漏到 browser 应用源码。它必须晚于语言规则应用，才能可靠关闭工具脚本中的 `no-console`。
 *
 * @returns Node.js 工程文件专用的单个 override。
 */
export const createNodeToolingConfigs = (): Linter.ConfigOverride[] => [
	{
		files: [...GLOBS_NODE_TOOLING],
		env: { es2022: true, browser: false, node: true },
		rules: { "no-console": "off" },
	},
];
