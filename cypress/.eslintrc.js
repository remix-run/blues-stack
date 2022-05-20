/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:unicorn/recommended',
		'plugin:sonarjs/recommended',
		'plugin:jsonc/base',
		'plugin:no-unsanitized/DOM',
		'plugin:security/recommended',
		'plugin:array-func/recommended',
		'plugin:eslint-comments/recommended',
		'plugin:promise/recommended',
		'plugin:switch-case/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:cypress/recommended',
		'plugin:testing-library/react',
		'plugin:prettier/recommended'
	],
	plugins: [
		'unicorn',
		'sonarjs',
		'no-secrets',
		'no-constructor-bind',
		'no-use-extend-native',
		'optimize-regex',
		'switch-case',
		'@typescript-eslint',
		'jsx-a11y',
		'react',
		'prettier'
	],
	rules: {
		'no-secrets/no-secrets': 'error',
		'no-constructor-bind/no-constructor-bind': 'error',
		'no-constructor-bind/no-constructor-state': 'error',
		'optimize-regex/optimize-regex': [
			'warn',
			{
				blacklist: ['charClassClassrangesMerge']
			}
		],
		indent: ['error', 'tab'],
		'object-curly-spacing': ['error', 'always'],
		'comma-dangle': ['error', 'never'],
		'new-cap': ['error', { capIsNew: false }],
		'no-unused-vars': [
			'error',
			{ argsIgnorePattern: 'res|req|next', args: 'none' }
		],
		'spaced-comment': [2, 'always', { exceptions: ['#'] }],
		'prettier/prettier': [
			'error',
			{ singleQuote: true, jsxSingleQuote: true },
			{ usePrettierrc: true }
		],
		'unicorn/prefer-module': 'off',
		'unicorn/filename-case': 'off',
		'unicorn/numeric-separators-style': 'off',
		'unicorn/prevent-abbreviations': 'off',
		'react/react-in-jsx-scope': 'off'
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
}
