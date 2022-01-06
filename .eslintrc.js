module.exports = {
	extends: [
		'airbnb',
		'plugin:prettier/recommended',
		'prettier/react',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'prettier/@typescript-eslint',
		'plugin:import/typescript',
	],
	plugins: ['@typescript-eslint', 'prettier', 'react', 'import', 'jsx-a11y'],
	parser: '@typescript-eslint/parser',
	settings: {
		'import/resolver': {
			node: {
				paths: ['src'],
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		jest: true,
		node: true,
	},
	rules: {
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				mjs: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
			},
		],
		'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
		'react/prop-types': 0,
		'max-len': [
			'warn',
			{
				code: 140,
				tabWidth: 2,
				comments: 140,
				ignoreComments: false,
				ignoreTrailingComments: true,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreRegExpLiterals: true,
			},
		],
		'no-param-reassign': ['warn', { props: false }],
		'no-use-before-define': 'off',
		'@typescript-eslint/no-empty-function': 'warn',
		'react/no-array-index-key': 'warn',
		'no-nested-ternary': 'warn',
		'import/prefer-default-export': 'off',
		'react/forbid-prop-types': 'warn',
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'jsx-a11y/control-has-associated-label': 'off',
		'jsx-a11y/interactive-supports-focus': 'off',
		'jsx-a11y/anchor-is-valid': 'off',
		'react/static-property-placement': 'off',
		'react/state-in-constructor': 'off',
		camelcase: 'warn',
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				printWidth: 200,
				tabWidth: 4,
				singleQuote: true,
				semi: true,
				trailingComma: 'all',
				bracketSpacing: true,
				rcVerbose: true,
				arrowParens: 'always',
			},
		],
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
};