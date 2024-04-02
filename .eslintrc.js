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
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
   },   
};
