const {createDefaultConfig} = require('@open-wc/testing-karma');
const merge = require('deepmerge');
const wrench = require('wrench');
const path = require('path');
const fs = require('fs');

function resolve(basePath, suiteName) {
  if (fs.existsSync(`${basePath}/test-bundle/src`)) {
    const files = wrench.readdirSyncRecursive(`${basePath}/test-bundle/src`);
    const suite = files.find((f) => f.endsWith(`${suiteName}.test.js`));
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
    browsers: ['Chrome'],
    frameworks: ['mocha', 'chai'],
    client: {
      mocha: {ui: 'bdd'},
    },
    files: [
      {
        pattern: config.grep ? config.grep : 'test-bundle/src/**/*.test.js',
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
    preprocessors: {'**/__snapshots__/*.md': ['snapshot']},
  });
  console.log(configObj);
  config.set(configObj);
  return config;
};
