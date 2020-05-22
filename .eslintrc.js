module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: 'airbnb',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    'jest/globals': true,
    API_ENDPOINT: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react', 'jest'],
  rules: {
    'no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'none'
      }
    ],
    'comma-dangle': 'off',
    'react/jsx-filename-extension': 0,
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    indent: ['error', 2],
    'no-console': 'off'
  }
};
