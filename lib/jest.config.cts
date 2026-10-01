module.exports = {
  displayName: 'internal-shared',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    '^@reelscore-sdk/models$':
      '<rootDir>/../node_modules/reelscore-sdk/dist/cjs/models/index.js',
    '^@reelscore-sdk/constants$':
      '<rootDir>/../node_modules/reelscore-sdk/dist/cjs/shared/constants/index.js',
    '^@reelscore-sdk/helpers$':
      '<rootDir>/../node_modules/reelscore-sdk/dist/cjs/shared/helpers/index.js',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/lib',
};
