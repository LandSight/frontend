import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  // Игнорируемые файлы
  {
    ignores: [
      'dist',
      'node_modules',
      '*.config.js',
      '*.config.ts',
      '.env',
      'public',
      '.husky',
      'prettier.config.ts',
      'vite.config.ts',
    ],
  },
  
  // Основная конфигурация для TS/TSX файлов
  {
    files: ['**/*.{ts,tsx}'],
    
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { 
          jsx: true 
        },
        sourceType: 'module',
        project: './tsconfig.app.json',
      },
    },
    
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react': pluginReact,
      'jsx-a11y': pluginJsxA11y,
      'import': pluginImport,
      'prettier': pluginPrettier,
      'simple-import-sort': simpleImportSort,
    },
    
    settings: {
      react: { 
        version: 'detect' 
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json',
        },
      },
    },
    
    rules: {
      // Базовые правила JS
      ...js.configs.recommended.rules,
      
      // TypeScript правила
      ...tseslint.configs.recommended.rules,
      
      // React правила (правильный способ для flat config)
      ...pluginReact.configs.recommended.rules,
      
      // React Hooks правила
      ...reactHooks.configs.recommended.rules,

      // отключаем JS правило
      'no-unused-vars': 'off',

      // включаем TS правило
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      
      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Кастомные React правила
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      
      // Сортировка импортов
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^@?\\w'],
            ['^#/'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      
      // Import правила
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      
      // Prettier
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      
      // Общие правила
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
    },
  },
  
  // Специальные правила для тестов
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  }
);