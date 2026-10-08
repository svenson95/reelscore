module.exports = {
  displayName: 'client',
  verbose: true,
  reporters: ['<rootDir>/jest/grouped-reporter.cjs'],
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/client',
  transform: {
    [String.raw`^.+\.(ts|mjs|js|html)$`]: [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: String.raw`\.(html|svg)$`,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^@reelscore-sdk/models$':
      '<rootDir>/../../node_modules/reelscore-sdk/dist/cjs/models/index.js',
    '^@reelscore-sdk/constants$':
      '<rootDir>/../../node_modules/reelscore-sdk/dist/cjs/shared/constants/index.js',
    '^@reelscore-sdk/helpers$':
      '<rootDir>/../../node_modules/reelscore-sdk/dist/cjs/shared/helpers/index.js',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
