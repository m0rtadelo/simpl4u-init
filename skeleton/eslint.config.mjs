import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';


export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
  { rules: {
    indent: ['error', 2], // match .editorconfig
    'linebreak-style': ['error', 'unix'],
    'eol-last': ['error', 'always'],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
  },
  }
]);
