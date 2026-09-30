import eslint from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver, importX } from 'eslint-plugin-import-x';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import { configs, parser } from 'typescript-eslint';
import * as vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  eslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.{js,ts,vue}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
  },
  {
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: './tsconfig.app.json',
        }),
        createNodeResolver(),
      ],
    },
    rules: {
      'import-x/no-unresolved': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/multiline-html-element-content-newline': 'off',
    },
  },
];
