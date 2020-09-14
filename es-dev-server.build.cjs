// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const historyApiFallback = require('koa-history-api-fallback');
// eslint-disable-next-line no-undef
module.exports = {
  port: 4433,
  watch: true,
  http2: true,
  nodeResolve: false,
  appIndex: 'index.html',
  compatibility: 'none',
  rootDir: './bundle',
  sslKey: './certs/key.pem',
  sslCert: './certs/cert.pem',
  open: true,
  middlewares: [
    historyApiFallback({
      index: '/index.html',
    }),
  ],
};
