module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-typescript/base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js, cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-loop-func' : 'off',
    '@typescript-eslint/no-shadow' : 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    "eol-last": ["error", "always"],
    "@typescript-eslint/no-unused-vars": "off",
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, minProperties: 1 },
      ObjectPattern: { multiline: true, minProperties: 1 },
      ImportDeclaration: 'never',
      ExportDeclaration: { multiline: true, minProperties: 1 }
    }],
   },   
};
