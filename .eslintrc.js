module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'plugin:vue/recommended', 
    'eslint:recommended',
    '@vue/standard'
  ],
  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'quotes': ['error', 'single'],
    // 'semi': ['error', 'never'],
    // 'no-extra-semi': 'error',
    // 'vue/html-end-tags': 'error',
    // 'vue/require-default-prop': 'off',
    // 'vue/require-prop-types': 'error',
    // 'vue/attributes-order': 'error',
    // 'vue/order-in-components': 'error',
    // 'vue/html-indent': ['error', 2],
    // 'vue/attribute-hyphenation': ['error', 'always'],
    // 'vue/html-quotes': ['error', 'double'],
    // 'vue/arrow-spacing': ['error', { 'before': false, 'after': true }],
    // 'vue/block-spacing': ['error', 'always'],
    // 'vue/component-name-in-template-casing': ['error', 'kebab-case', {
    //   'registeredComponentsOnly': true,
    //   'ignores': []
    // }],
    // 'vue/eqeqeq': ['error', 'always'],
    // 'handle-callback-err': ['error', '^(err|error)$']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
