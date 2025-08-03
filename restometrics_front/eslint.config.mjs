import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import next from 'eslint-plugin-next'
import tailwindcss from 'eslint-plugin-tailwindcss'
import globals from 'globals'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      prettier,
      react,
      import: importPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Твои кастомные правила
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'no-undef': 'off',
      'prettier/prettier': 'error',
    },
  },
  {
    plugins: { tailwindcss },
    rules: {
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'off',
    },
  },
  {
    plugins: { next },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
]
