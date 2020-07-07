// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const historyApiFallback = require('koa-history-api-fallback');
// eslint-disable-next-line no-undef
module.exports = {
  port: 8000,
  watch: true,
  nodeResolve: true,
  appIndex: 'index.html',
  moduleDirs: ['node_modules'],
  rootDir: './',
  open: true,
  middlewares: [
    historyApiFallback({
      index: '/build/index.html',
    })
  ],
  plugins: [
  {
    transform(context) {
      if (context.url === '/build/index.html') {
        const transformedBody = context.body.replace(/<base href=".*"/, '<base href="/build/"');
        return { body: transformedBody };
      }
    },
  },
  ]
};
