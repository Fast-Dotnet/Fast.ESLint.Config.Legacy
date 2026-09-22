/**
 * 类型安全规则工具与本包本地规则记录的公共入口。
 *
 * 大多数项目应继承包根配置并在 `.eslintrc` 中覆写少量规则；本入口面向需要共享
 * 组织级规则或审查本包具体规则取舍的高级用例。导出的对象是普通规则记录，不包含
 * parser、plugin、env 或文件范围，直接使用时由调用方负责提供这些配置上下文。
 *
 * @packageDocumentation
 */
import type { Linter } from "eslint";
import type { RuleName, RuleOptions } from "../typegen";

type RejectUnknownRuleNames<Rules extends RuleOptions> = Rules & Record<Exclude<keyof Rules, RuleName>, never>;

/**
 * 为消费项目定义类型安全的 ESLint 8 规则记录。
 *
 * @param rules - 需要写入 `.eslintrc` 的规则记录。
 * @returns 与传入值引用相同、同时兼容 `Linter.RulesRecord` 的规则记录。
 * @public
 */
export const defineRules = <const Rules extends RuleOptions>(rules: RejectUnknownRuleNames<Rules>): Rules & Linter.RulesRecord => rules;

/** 类型安全规则 API 使用的规则名与规则记录类型。 */
export type { RuleName, RuleOptions } from "../typegen";

export * from "./angular";
export * from "./common";
export * from "./import";
export * from "./javascript";
export * from "./lodash";
export * from "./react";
export * from "./regexp";
export * from "./sort-package";
export * from "./sort-tsconfig";
export * from "./typescript";
export * from "./vue";
