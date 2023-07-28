module.exports = {
    env: {
        browser: true,
        commonjs: true,
    },

    extends: ['@broxus'],

    overrides: [
        {
            files: ['*.d.ts', '**/*/types.ts'],
            rules: {
                camelcase: 'off',
                'max-len': 'off',
            },
        },
        {
            files: ['*.abi.ts'],
            parserOptions: {
                sourceType: 'module',
            },
            rules: {
                camelcase: 'off',
                'max-len': 'off',
                'sort-keys': 'off',
            },
        },
        {
            files: ['*.ts{,x}'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': ['warn', {
                    allowExpressions: true,
                    allowHigherOrderFunctions: true,
                    allowTypedFunctionExpressions: true,
                }],
                'import/extensions': ['error', 'never', {
                    ts: 'never',
                    tsx: 'never',
                    json: 'always',
                    scss: 'always'
                }],
                indent: 'off',
                'no-await-in-loop': 'off',
                'no-continue': 'off',
                'no-restricted-syntax': 'off',
                'object-curly-newline': 'off',
            }
        }
    ],

    root: true,

    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'import/extensions': ['error', 'never', { json: 'always', scss: 'always' }],
        'no-await-in-loop': 'off',
        'no-restricted-syntax': 'off',
        // 'sort-keys': 'off',
    },

    settings: {
        'import/extensions': ['.ts', '.tsx', '.js', '.scss', '.css'],
        'import/resolver': {
            node: true,
            webpack: true,
        },
    },
}
