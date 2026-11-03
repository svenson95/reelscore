module.exports = {
  displayName: 'client',
  verbose: true,
  reporters: ['<rootDir>/jest/grouped-reporter.cjs'],
  preset: '../../jest.preset.js',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/scripts/**/*.spec.ts',
    '<rootDir>/vercel/**/*.spec.ts',
  ],
  collectCoverageFrom: [
    'src/app/app.component.ts',
    'src/app/app.config.ts',
    'src/app/app.config.server.ts',
    'src/app/app.routes.ts',
    'src/app/app.routes.server.ts',
    'src/app/config/app-initializer.provider.ts',
    'src/app/features/overview/components/content/content.component.ts',
    'src/app/features/overview/data-access/date-navigation.service.ts',
    'src/app/features/overview/data-access/selected-date.service.ts',
    'src/app/shared/data-access/startup/startup.service.ts',
    'src/app/shared/data-access/theme.service.ts',
    'src/app/shared/utils/nationality-flag.utils.ts',
    'src/main.server.ts',
    'src/server-app.ts',
    'scripts/build-vercel-output.cjs',
    'vercel/ssr-handler.cjs',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/client',
  transform: {
    [String.raw`^.+\.(ts|mjs|js|cjs|html)$`]: [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: String.raw`\.(html|svg)$`,
      },
    ],
  },
  transformIgnorePatterns: [String.raw`node_modules/(?!.*\.mjs$)`],
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
