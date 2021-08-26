const ignoreModules = [
  '@open-wc',
  'lit-html',
  'lit-element',
  'lit',
  '@lit',
  'chai-a11y-axe',
  'lit-redux-router',
  'pwa-helpers',
  '@material',
].join('|');

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  moduleFileExtensions: ['js', 'ts'],
  moduleDirectories: ['node_modules'],
  transform: {
    'node_modules/lit/.+\\.(j|t)s?$': 'ts-jest',
  },
  transformIgnorePatterns: [`node_modules/(?!(${ignoreModules})/)`],
  testPathIgnorePatterns: ['cypress', 'bundle/'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.worker.(js|ts)': '<rootDir>/__mocks__/workerMock.js',
  },
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
    '!src/test/**/*.{js,ts}',
    '!src/ponyfills/**/*.{js,ts}',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 18,
      functions: 35,
      lines: 32,
      statements: 32,
    },
  },
  preset: 'ts-jest/presets/js-with-ts',
};

export default config;
