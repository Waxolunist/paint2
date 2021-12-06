const {jsWithTsESM: tsjPreset} = require('ts-jest/presets');

const ignoreModules = [
  '@open-wc',
  'lit-html',
  'lit-element',
  'lit',
  '@lit',
  'lit-redux-router',
  'pwa-helpers',
  '@material',
].join('|');

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  verbose: true,
  preset: 'ts-jest/presets/js-with-ts-esm',
  moduleFileExtensions: ['js', 'ts'],
  moduleDirectories: ['node_modules'],
  transform: {
    ...tsjPreset.transform,
  },
  transformIgnorePatterns: [`node_modules/(?!(${ignoreModules})/)`],
  moduleNameMapper: {
    '\\.worker.loader.(js|ts)': '<rootDir>/__mocks__/workerMock.js',
  },
  testPathIgnorePatterns: ['cypress', 'bundle/'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./setupTestEnv.cjs', 'fake-indexeddb/auto'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest',
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        uniqueOutputName: 'false',
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{classname}-{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.loader.{js,ts}',
    '!src/test/**/*.{js,ts}',
    '!src/ponyfills/**/*.{js,ts}',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 16,
      functions: 35,
      lines: 32,
      statements: 32,
    },
  },
};
