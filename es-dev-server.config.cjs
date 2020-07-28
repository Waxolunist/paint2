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
      index: '/bundle/index.html',
    }),
    function rewriteIndex(context, next) {
      // middleware for debugging worker
      if (context.url.startsWith('/bundle/src')) {
        context.url = context.url.replace('/bundle', '');
      }

      return next();
    },
  ],
  plugins: [
  {
    transform(context) {
      if (context.url === '/bundle/index.html') {
        const transformedBody = context.body.replace(/<base href=".*"/, '<base href="/bundle/"');
        return { body: transformedBody };
      }
    },
  },
  ]
};
