import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import github from 'eslint-plugin-github'
import eslintPluginImport from 'eslint-plugin-import'
import nodePlugin from 'eslint-plugin-n'
import prettier from 'eslint-config-prettier'
import stylistic from '@stylistic/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'


const MAX_LINE_LENGTH = 120

const pathGroupsImportOptions = {
	patternOptions: { dot: true, nocomment: true },
	group: 'unknown',
	position: 'after',
}

export default [
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	js.configs.recommended,
	...ts.configs.recommended,
	...vue.configs['flat/recommended'],
	{
		files: ['*.vue', '**/*.vue', '*.cjs', '**/*.cjs', '*.mjs', '**/*.mjs'],
		languageOptions: {
			parserOptions: {
				parser: typescriptParser,
				ecmaVersion: 2020,
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
			github
		},
		rules: {
			'prettier/prettier': 'off',
			'semi': 'off',
			'quotes': ['error', 'single'],
			'max-len': [2, { code: MAX_LINE_LENGTH, ignoreComments: true }],

			'no-param-reassign': ['error', { props: false }],
			'no-console': 'warn',
			'no-debugger': 'error',
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-plusplus': 'warn',
			'no-shadow': 'error',
			'no-unused-expressions': 'off',
			'no-use-before-define': 'off',
			'no-mixed-spaces-and-tabs': 'error',
			'no-trailing-spaces': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': ['error', { 'max': 2 }],
			'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
			'indent': ['error', 'tab', {
				'SwitchCase': 1,
				'VariableDeclarator': { 'var': 1, 'let': 1, 'const': 1 },
				'outerIIFEBody': 1
			}],
			'curly': [2, 'all'],
			'prefer-destructuring': 'warn',
			'lines-between-class-members': [2, 'always', { exceptAfterSingleLine: true }],

			'github/filenames-match-regex': ['error', '^([a-z0-9]+[-.])*[a-z0-9]+$'],

			'import/no-extraneous-dependencies': 'off',
			'import/no-unresolved': 'off',
			'import/extensions': 'off',
			'import/prefer-default-export': 'off',
			'import/order': [	'error', {
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


			'n/no-process-env': ['error', {
				'allowedVariables': ['NODE_ENV']
			}],

			// Vue
			'vue/require-v-for-key': 'off',
			'vue/max-attributes-per-line': ['error', {
				'singleline': {
					'max': 4
				},
				'multiline': {
					'max': 2
				}
			}],
			'vue/html-closing-bracket-spacing': ['error', {
				'startTag': 'never',
				'endTag': 'never',
				'selfClosingTag': 'always'
			}],
			'vue/html-closing-bracket-newline': ['error', {
				'singleline': 'never',
				'multiline': 'always'
			}],
			'vue/attribute-hyphenation': ['error', 'always'],
			'vue/html-indent': ['error', 'tab', {
				'attribute': 1,
				'baseIndent': 1,
				'closeBracket': 0,
				'alignAttributesVertically': false,
				'ignores': []
			} ],
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
					'CONTENT'
				],
				'alphabetical': false
			}],
			'vue/component-name-in-template-casing': ['error', 'kebab-case', {
				'registeredComponentsOnly': false,
				'ignores': []
			}],

			// TypeScript
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/array-type': [2, { default: 'array' }],
			'@typescript-eslint/no-unused-vars': ['warn', {
				'args': 'all',
				'argsIgnorePattern': '^_',
				'caughtErrors': 'all',
				'caughtErrorsIgnorePattern': '^_',
				'destructuredArrayIgnorePattern': '^_',
				'varsIgnorePattern': '^_',
				'ignoreRestSiblings': true,
				'vars': 'all'
			}],
			'@typescript-eslint/no-unused-expressions': 'off',
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
			'@typescript-eslint/naming-convention': ['error',
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
			'@typescript-eslint/no-extraneous-class': 'error',
			'@typescript-eslint/no-misused-new': 'error',
			'@typescript-eslint/no-array-constructor': 'error',
			'@typescript-eslint/no-use-before-define': [ 'error', {
				functions: false,
				classes: true,
				variables: true,
				ignoreTypeReferences: true,
				typedefs: false,
			}],
			'@typescript-eslint/no-useless-constructor': 'error',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/ban-ts-comment': 'warn',


		},
	},
	{
		files: ['*.ts'],
		rules: {
			'no-empty-function': 0,
			'no-useless-constructor': 0,
		},
	},
	{
		files: ['**/config.{j,t}s', '**/*.config.{j,t}s', '**/environment.{j,t}s'],
		rules: {
			'node/no-process-env': 'off',
		},
	},
	{
		ignores: ['dist', 'coverage', 'node_modules', '.*.cjs',],
	},
]
