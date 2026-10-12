import nx from '@nx/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.cjs'],
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [String.raw`^\u0000`],
            ['^node:'],
            ['^@angular/'],
            [String.raw`^@?\w`],
            ['^@reelscore-sdk/'],
            ['^@testing/client(?:/|$)'],
            ['^@lib/'],
            ['^@app/'],
            [String.raw`^\.\.(?:/|$)`],
            [String.raw`^\./[^./]+/`],
            [String.raw`^\./[^./]+$`],
            ['^'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['@app', '@lib', '@testing'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.cjs'],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'script',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    languageOptions: { globals: globals.jest },
  },
];
