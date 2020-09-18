module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    ['@babel/preset-typescript', {onlyRemoveTypeImports: true}],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', {decoratorsBeforeExport: true}],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
    'babel-plugin-parameter-decorator',
  ],
};
