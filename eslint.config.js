import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import eslintPluginImport from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import prettier from 'eslint-config-prettier';
import stylistic from '@stylistic/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import oxlint from 'eslint-plugin-oxlint';


const MAX_LINE_LENGTH = 120;

const pathGroupsImportOptions = {
	patternOptions: { dot: true, nocomment: true },
	group: 'unknown',
	position: 'after',
};

export default defineConfig([
	js.configs.recommended,
	...ts.configs.recommended,
	...vue.configs['flat/recommended'],
	{
		files: ['*.vue', '**/*.vue', '*.cjs', '**/*.cjs', '*.mjs', '**/*.mjs'],
		languageOptions: {
			parserOptions: {
				parser: typescriptParser,
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
	},
	// prettier
	prettier,
	{
		plugins: {
			'@stylistic': stylistic,
			'import': eslintPluginImport,
			'n': nodePlugin,
		},
		rules: {
			'prettier/prettier': 'off',

			'no-undef': 'off',
			'no-shadow': 'error',
			'no-use-before-define': 'off',
			'no-mixed-spaces-and-tabs': 'error',
			'no-trailing-spaces': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': ['error', { 'max': 2 }],
			'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
			'prefer-destructuring': 'warn',
			'lines-between-class-members': [2, 'always', { exceptAfterSingleLine: true }],

			'import/no-extraneous-dependencies': 'off',
			'import/no-unresolved': 'off',
			'import/order': ['error', {
				'newlines-between': 'always',
				groups: [
					'builtin',
					'external',
					['internal', 'unknown', 'parent', 'sibling', 'index', 'object'],
				],
				pathGroups: [
					{
						...pathGroupsImportOptions,
						pattern: '*.vue',
						patternOptions: {
							...pathGroupsImportOptions.patternOptions,
							matchBase: true,
						},
					},
				],
			}],

			// Неподдерживаемые vue-правила в oxlint
			'vue/require-v-for-key': 'off',
			'vue/max-attributes-per-line': ['error', {
				'singleline': {
					'max': 2,
				},
				'multiline': {
					'max': 1,
				},
			}],
			'vue/html-closing-bracket-spacing': ['error', {
				'startTag': 'never',
				'endTag': 'never',
				'selfClosingTag': 'always',
			}],
			'vue/html-closing-bracket-newline': ['error', {
				'singleline': 'never',
				'multiline': 'always',
			}],
			'vue/attribute-hyphenation': ['error', 'always'],
			'vue/html-indent': ['error', 'tab', {
				'attribute': 1,
				'baseIndent': 1,
				'closeBracket': 0,
				'alignAttributesVertically': false,
				'ignores': [],
			}],
			'vue/attributes-order': ['error', {
				'order': [
					'DEFINITION',
					'LIST_RENDERING',
					'CONDITIONALS',
					'RENDER_MODIFIERS',
					'UNIQUE',
					'GLOBAL',
					'TWO_WAY_BINDING',
					'OTHER_DIRECTIVES',
					'OTHER_ATTR',
					'EVENTS',
					'CONTENT',
				],
				'alphabetical': false,
			}],
			'vue/component-name-in-template-casing': ['error', 'kebab-case', {
				'registeredComponentsOnly': false,
				'ignores': [],
			}],

			// Stylistic
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/max-len': ['error', {
				code: MAX_LINE_LENGTH,
				ignoreComments: true,
			}],
			'@stylistic/member-delimiter-style': ['error', {
				multiline: {
					delimiter: 'semi',
					requireLast: true,
				},
				singleline: {
					delimiter: 'semi',
					requireLast: false,
				},
			}],
			'@stylistic/indent': ['error', 'tab', {
				SwitchCase: 1,
				VariableDeclarator: { var: 1, let: 1, const: 1 },
				MemberExpression: 1,
				FunctionDeclaration: { parameters: 1, body: 1 },
				FunctionExpression: { parameters: 1, body: 1 },
				CallExpression: { arguments: 1 },
				ArrayExpression: 1,
				ObjectExpression: 1,
				ImportDeclaration: 1,
				flatTernaryExpressions: false,
				ignoreComments: false,
				ignoredNodes: ['TemplateLiteral *'],
			}],
			'@stylistic/comma-dangle': ['error', 'always-multiline'],
			'@stylistic/comma-spacing': ['error', { before: false, after: true }],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/array-bracket-spacing': ['error', 'never'],
			'@stylistic/space-before-function-paren': ['error', {
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always',
			}],
			'@stylistic/space-before-blocks': ['error', 'always'],
			'@stylistic/keyword-spacing': ['error', { before: true, after: true }],

			// TypeScript
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/no-unused-vars': ['warn', {
				'args': 'all',
				'argsIgnorePattern': '^_',
				'caughtErrors': 'all',
				'caughtErrorsIgnorePattern': '^_',
				'destructuredArrayIgnorePattern': '^_',
				'varsIgnorePattern': '^_',
				'ignoreRestSiblings': true,
				'vars': 'all',
			}],
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/naming-convention': ['error',
				{
					selector: ['variable', 'property'],
					format: null,
					filter: {
						regex: '^__APP_[A-Z0-9_]+__$',
						match: true,
					},
				},
				{
					selector: 'default',
					format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
					leadingUnderscore: 'allow',
				},
				{
					selector: 'property',
					format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
					leadingUnderscore: 'allow',
				},
				{
					selector: ['property', 'method'],
					format: null,
					modifiers: ['requiresQuotes'],
				},
				{
					selector: 'enum',
					format: ['PascalCase', 'UPPER_CASE'],
				},
				{
					selector: 'enumMember',
					format: ['PascalCase', 'UPPER_CASE'],
				},
				{
					selector: 'typeAlias',
					format: ['PascalCase'],
				},
				{
					selector: 'typeParameter',
					format: ['PascalCase'],
				},
				{
					selector: 'class',
					format: ['PascalCase'],
				},
				{
					selector: 'interface',
					format: ['PascalCase'],
					prefix: ['I'],
				},
			],
			'@typescript-eslint/no-use-before-define': ['error', {
				functions: false,
				classes: true,
				variables: true,
				ignoreTypeReferences: true,
				typedefs: false,
			}],
		},
	},
	{
		files: ['**/config.{j,t}s', '**/*.config.{j,t}s', '**/environment.{j,t}s'],
		rules: {
			'n/no-process-env': 'off',
		},
	},
	{
		ignores: ['dist', 'coverage', 'node_modules', '.*.cjs'],
	},
	...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
]);
