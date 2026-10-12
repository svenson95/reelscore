import nx from '@nx/eslint-plugin';

import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'warn',
        {
          type: 'attribute',
          prefix: 'rs',
          style: 'camelCase',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  {
    files: [
      './src/app/components/footer/footer.component.ts',
      './src/app/components/header/header.component.ts',
    ],
    rules: {
      '@angular-eslint/component-selector': [
        'off',
        {
          type: 'element',
          prefix: [''],
          style: 'kebab-case',
        },
      ],
    },
  },
];
