const assert = require("node:assert/strict");
const test = require("node:test");
const configs = require("@fast-china/eslint-config-legacy/configs");
const { assertNoConfigFailure, composeWithRoot, createLinter, directConfigNames, directConfigs, rootConfig } = require("./helpers/eslint.cjs");

test("unified Vue rules are the only rule-record entry for Vue version composition", () => {
	const rules = require("@fast-china/eslint-config-legacy/rules");
	assert.ok(rules.vueRules);
	for (const name of ["vueCommonRules", "vue2Rules", "vue3Rules"]) {
		assert.equal(Object.hasOwn(rules, name), false, name);
	}
});

test("every granular config resolves through its public Legacy extends name", async () => {
	for (const name of directConfigNames) {
		const filePath =
			name === "angular"
				? "fixtures/app.component.ts"
				: name === "react"
					? "fixtures/App.tsx"
					: name.startsWith("vue")
						? "fixtures/App.vue"
						: "fixtures/example.ts";
		const calculated = await createLinter({ extends: [`@fast-china/eslint-config-legacy/${name}`] }).calculateConfigForFile(filePath);
		assert.ok(calculated, `${name} did not resolve`);
	}
});

test("package root contains the documented Vue 3 browser stack", () => {
	const serialized = JSON.stringify(rootConfig);
	assert.match(serialized, /plugin:vue\/recommended/);
	assert.match(serialized, /plugin:@typescript-eslint\/recommended/);
	assert.match(serialized, /plugin:jsonc\/recommended-with-jsonc/);
	assert.match(serialized, /plugin:yml\/recommended/);
	assert.match(serialized, /plugin:markdown\/recommended-legacy/);
	assert.doesNotMatch(serialized, /vue2-recommended|plugin:react\/recommended|plugin:@angular-eslint\/recommended/);
});

test("package root parses every documented file family", async () => {
	const linter = createLinter(rootConfig);
	const fixtures = [
		["fixtures/example.js", "const answer = 42;\n\nexport { answer };\n"],
		["fixtures/example.ts", 'const message = "hello";\n\nexport { message };\n'],
		["fixtures/App.vue", '<script setup lang="ts">\nconst message = "hello";\n</script>\n<template><main>{{ message }}</main></template>\n'],
		["fixtures/example.jsonc", '{\n\t// comment\n\t"enabled": true\n}\n'],
		["fixtures/example.yaml", "enabled: true\n"],
		["fixtures/example.md", "# Example\n"],
	];
	for (const [filePath, code] of fixtures) {
		for (const result of await linter.lintText(code, { filePath })) assertNoConfigFailure(result, filePath);
	}
});

test("browser source and Node.js tooling receive separate globals", async () => {
	const linter = createLinter(rootConfig);
	const [browserResult] = await linter.lintText("process.cwd();\n", { filePath: "src/browser.js" });
	const [viteResult] = await linter.lintText("console.log(process.cwd());\n", { filePath: "vite.config.js" });
	assert.ok(browserResult.messages.some((message) => message.ruleId === "no-undef"));
	assert.ok(!viteResult.messages.some((message) => message.ruleId === "no-undef" || message.ruleId === "no-console"));
});

test("Vue 2 and Vue 3 expose different version-specific contracts", async () => {
	const vue2Config = await createLinter(directConfigs.vue2).calculateConfigForFile("fixtures/App.vue");
	const vue3Config = await createLinter(directConfigs.vue).calculateConfigForFile("fixtures/App.vue");
	assert.equal(vue2Config.rules["vue/require-explicit-emits"][0], "off");
	assert.equal(vue3Config.rules["vue/require-explicit-emits"][0], "error");
});

test("shared JavaScript, TypeScript, Vue, and RegExp rules match the modern config contract", async () => {
	const rootLinter = createLinter(rootConfig);
	const javaScriptConfig = await rootLinter.calculateConfigForFile("fixtures/example.js");
	const typeScriptConfig = await rootLinter.calculateConfigForFile("fixtures/example.ts");
	const vueConfig = await rootLinter.calculateConfigForFile("fixtures/App.vue");
	const regexpConfig = await createLinter(directConfigs.regexp).calculateConfigForFile("fixtures/example.js");

	assert.equal(javaScriptConfig.rules.camelcase[0], "error");
	assert.equal(javaScriptConfig.rules.camelcase[1].properties, "never");
	assert.deepEqual(javaScriptConfig.rules["no-restricted-syntax"], ["error", "LabeledStatement", "WithStatement"]);
	assert.equal(javaScriptConfig.rules["no-eval"][0], "error");
	assert.equal(javaScriptConfig.rules["no-implied-eval"][0], "error");
	assert.equal(javaScriptConfig.rules["no-new-func"][0], "error");
	assert.equal(javaScriptConfig.rules["no-promise-executor-return"][0], "error");
	assert.deepEqual(javaScriptConfig.rules.curly, ["error", "multi-line", "consistent"]);
	assert.equal(javaScriptConfig.rules["default-case-last"][0], "error");
	assert.equal(javaScriptConfig.rules["no-void"][0], "error");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/explicit-function-return-type"][0], "off");
	assert.deepEqual(typeScriptConfig.rules["@typescript-eslint/explicit-module-boundary-types"], [
		"error",
		{ allowArgumentsExplicitlyTypedAsAny: false },
	]);
	assert.deepEqual(typeScriptConfig.rules["@typescript-eslint/no-empty-function"], ["error", { allow: ["constructors", "overrideMethods"] }]);
	assert.equal(typeScriptConfig.rules["@typescript-eslint/no-non-null-assertion"][0], "off");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/consistent-type-imports"][1].fixStyle, "separate-type-imports");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/no-import-type-side-effects"][0], "error");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/no-unused-vars"][1].varsIgnorePattern, undefined);
	assert.equal(typeScriptConfig.rules["import-x/order"][1].sortTypesGroup, true);
	assert.equal(typeScriptConfig.rules["import-x/order"][1].groups.at(-1), "type");
	assert.deepEqual(
		typeScriptConfig.rules["import-x/order"][1].pathGroups.find((group) => group.pattern === "@/**"),
		{ pattern: "@/**", group: "internal", position: "before" }
	);
	assert.equal(vueConfig.rules["vue/prefer-import-from-vue"][0], "off");
	assert.equal(vueConfig.rules["vue/no-setup-props-reactivity-loss"][0], "error");
	assert.equal(vueConfig.rules["vue/no-ref-object-reactivity-loss"][0], "error");
	assert.deepEqual(vueConfig.rules["vue/attribute-hyphenation"], ["error", "always"]);
	assert.equal(vueConfig.rules["vue/html-closing-bracket-newline"][0], "off");
	assert.equal(vueConfig.rules["@typescript-eslint/explicit-function-return-type"][0], "off");
	assert.equal(vueConfig.rules["@typescript-eslint/explicit-module-boundary-types"][0], "off");
	assert.equal(vueConfig.rules["@typescript-eslint/no-unused-vars"][1].args, "none");
	assert.equal(regexpConfig.rules["regexp/no-super-linear-backtracking"][0], "error");
	assert.equal(regexpConfig.rules["regexp/strict"][0], "error");
	assert.equal(regexpConfig.rules["regexp/control-character-escape"], undefined);
});

test("style imports form a final stable group while other imports retain import-x ordering", async () => {
	const linter = createLinter({ overrides: configs.createImportConfigs(["**/*.js"]) });
	const [validResult] = await linter.lintText(
		'import vue from "vue";\nimport App from "./App.vue";\nimport "./z.scss";\nimport "vue-json-pretty/lib/styles.css";\nimport styles from "./a.module.scss?inline";\nvoid vue;\nvoid App;\nvoid styles;\n',
		{ filePath: "fixtures/style-imports-valid.js" }
	);
	const [misplacedStyleResult] = await linter.lintText('import "./theme.scss";\nimport App from "./App.vue";\nvoid App;\n', {
		filePath: "fixtures/style-imports-invalid.js",
	});
	const [sideEffectResult] = await linter.lintText('import App from "./App.vue";\nimport "reflect-metadata";\nvoid App;\n', {
		filePath: "fixtures/side-effect-imports-invalid.js",
	});
	const [alphabetizeResult] = await linter.lintText('import z from "z";\nimport a from "a";\nvoid z;\nvoid a;\n', {
		filePath: "fixtures/alphabetize-imports-invalid.js",
	});

	assert.equal(validResult.errorCount, 0, validResult.messages.map((message) => message.message).join(", "));
	assert.equal(misplacedStyleResult.messages.filter((message) => message.ruleId === "import-x/style-imports-last").length, 1);
	assert.ok(!misplacedStyleResult.messages.some((message) => message.ruleId === "import-x/order"));
	assert.equal(misplacedStyleResult.messages.find((message) => message.ruleId === "import-x/style-imports-last")?.fix, undefined);
	assert.ok(sideEffectResult.messages.some((message) => message.ruleId === "import-x/order"));
	assert.ok(alphabetizeResult.messages.some((message) => message.ruleId === "import-x/order"));
});

test("root aliases precede the final type group and stylesheet group", async () => {
	const linter = createLinter(
		{
			parser: require.resolve("@typescript-eslint/parser"),
			overrides: configs.createImportConfigs(["**/*.ts"]),
		},
		{ fix: true }
	);
	const source =
		'import type { Config } from "eslint";\nimport app from "@/app";\nimport "./app.css";\nconst config = {} as Config;\nvoid app;\nvoid config;\n';
	const [result] = await linter.lintText(source, { filePath: "fixtures/alias-import-order.ts" });

	assert.equal(
		result.output,
		'import app from "@/app";\nimport type { Config } from "eslint";\nimport "./app.css";\nconst config = {} as Config;\nvoid app;\nvoid config;\n'
	);
});

test("React and Angular configs load their parsers, processors, and local rules", async () => {
	const react = createLinter({ overrides: configs.createReactConfigs() });
	const angular = createLinter({ overrides: configs.createAngularConfigs() });
	const [reactResult] = await react.lintText(
		'import { useState } from "react";\nexport const App = () => { if (true) useState(0); return <button>Save</button>; };\n',
		{ filePath: "fixtures/App.tsx" }
	);
	const [angularResult] = await angular.lintText(
		'import { Component } from "@angular/core";\n@Component({ standalone: true, template: `<img src="logo.png">` }) export class App {}\n',
		{ filePath: "fixtures/app.component.ts" }
	);
	assertNoConfigFailure(reactResult, "fixtures/App.tsx");
	assertNoConfigFailure(angularResult, "fixtures/app.component.ts");
	assert.ok(reactResult.messages.some((message) => message.ruleId === "react/button-has-type"));
	assert.ok(angularResult.messages.some((message) => message.ruleId === "@angular-eslint/template/alt-text"));
});

test("type-aware overlay starts Project Service and enables recommended typed rules", async () => {
	const linter = createLinter(composeWithRoot(configs.createTypeAwareConfigs()));
	const [result] = await linter.lintFiles(["src/index.ts"]);
	assert.equal(result.fatalErrorCount, 0, result.messages.map((message) => message.message).join(", "));
	const typeScriptConfig = await linter.calculateConfigForFile("src/index.ts");
	const vueConfig = await linter.calculateConfigForFile("tests/fixtures/type-aware.vue");
	assert.deepEqual(configs.createTypeScriptExtends({ typeChecked: true }), ["plugin:@typescript-eslint/recommended-type-checked"]);
	assert.equal(typeScriptConfig.rules["@typescript-eslint/no-floating-promises"][0], "off");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/strict-void-return"][0], "off");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/no-misused-promises"][0], "error");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/no-misused-promises"][1], undefined);
	assert.equal(typeScriptConfig.rules["@typescript-eslint/await-thenable"][0], "error");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/require-await"][0], "error");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/return-await"][0], "error");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/consistent-type-exports"][0], "error");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/prefer-readonly"][0], "error");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/switch-exhaustiveness-check"][0], "error");
	assert.equal(vueConfig.rules["@typescript-eslint/switch-exhaustiveness-check"][0], "off");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/no-deprecated"][0], "warn");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/no-unnecessary-condition"][0], "off");
	assert.equal(typeScriptConfig.rules["@typescript-eslint/prefer-promise-reject-errors"][1].allowThrowingUnknown, true);
	assert.deepEqual(typeScriptConfig.parserOptions.extraFileExtensions, [".vue", ".nvue"]);
	assert.deepEqual(vueConfig.parserOptions.extraFileExtensions, [".vue", ".nvue"]);
	assert.deepEqual(typeScriptConfig.parserOptions.extraFileExtensions, vueConfig.parserOptions.extraFileExtensions);
	assert.equal(vueConfig.rules["@typescript-eslint/explicit-function-return-type"][0], "off");
	assert.equal(vueConfig.rules["@typescript-eslint/explicit-module-boundary-types"][0], "off");
	assert.equal(vueConfig.rules["@typescript-eslint/no-misused-promises"][1].checksVoidReturn.attributes, false);
	assert.equal(vueConfig.rules["@typescript-eslint/no-unused-vars"][1].args, "none");
});

test("package sorting preserves semantic exports condition order", async () => {
	const linter = createLinter(composeWithRoot(configs.createPackageJsonSortConfigs()), { fix: true });
	const source = '{"name":"fixture","version":"1.0.0","exports":{".":{"node":"./node.js","import":"./index.js","default":"./index.js"}}}\n';
	const [result] = await linter.lintText(source, { filePath: "fixtures/package.json" });
	const fixed = result.output ?? source;
	const calculated = await linter.calculateConfigForFile("fixtures/package.json");
	const rootOrder = calculated.rules["jsonc/sort-keys"][1].order;
	assert.ok(fixed.indexOf('"node"') < fixed.indexOf('"import"'));
	assert.ok(fixed.indexOf('"import"') < fixed.indexOf('"default"'));
	assert.ok(!rootOrder.includes("allowScripts"));
});
