const {createDefaultConfig} = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = (config) => {
    const configObj = merge(createDefaultConfig(config), {
      browsers : ['Chrome'],
      frameworks: ['mocha', 'chai'],
      client: {
        mocha: {ui: 'bdd'},
      },
      files: [
        {
          pattern: config.grep ? config.grep : 'test-bundle/multi-entry.js',
          type: 'module',
        },
      ],
      esm: {
        nodeResolve: true,
      },
    });
  //console.log(configObj);
  config.set(configObj);
  return config;
};