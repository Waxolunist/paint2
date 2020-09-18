const {createDefaultConfig} = require('@open-wc/testing-karma');
const merge = require('deepmerge');
const wrench = require('wrench');
const path = require('path');
const fs = require('fs');

function resolve(basePath, suiteName) {
  if (fs.existsSync(`${basePath}/src`)) {
    const files = wrench.readdirSyncRecursive(`${basePath}/src`);
    const suite = files.find((f) => f.endsWith(`${suiteName}.test.ts`));
    if (suite) {
      console.log(`Found suite ${suite}`);
      const relativeDirname = path.dirname(suite);
      return `${basePath}/src/${relativeDirname}/__snapshots__/${suiteName}.md`;
    }
  }
  return `${basePath}/__snapshots__/${suiteName}.md`;
}

module.exports = (config) => {
  const configObj = merge(createDefaultConfig(config), {
    logLevel: config.LOG_DEBUG,
    browsers: ['Chrome'],
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    client: {
      mocha: {ui: 'bdd'},
    },
    files: [
      {
        pattern: config.grep ? config.grep : 'src/**/*.test.ts',
        type: 'module',
      },
    ],
    esm: {
      nodeResolve: true,
      exclude: ['**/__snapshots__/*'],
    },
    snapshot: {
      pathResolver: resolve,
    },
    preprocessors: {
      '**/__snapshots__/*.md': ['snapshot'],
      '**/*.ts': 'karma-typescript',
    },
    reporters: ['progress', 'karma-typescript'],
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
    },
    typescriptPreprocessor: {
      transformPath: function (path) {
        return path.replace(/\.ts$/, '.js');
      },
    },
  });
  console.log(configObj);
  config.set(configObj);
  return config;
};
