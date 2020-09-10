module.exports = {
  env: {
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:import/warnings',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'prettier/@typescript-eslint',
    'prettier',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        semi: false,
        bracketSpacing: true,
        jsxBracketSameLine: false,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'avoid',
      },
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-useless-concat': ['warn'],
    '@typescript-eslint/no-explicit-any': ['off'],
    eqeqeq: ['error', 'smart'],
    'no-shadow': ['error', { builtinGlobals: false, hoist: 'all' }],
  },
}
