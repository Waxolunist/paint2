// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const historyApiFallback = require('koa-history-api-fallback');
const fs = require('fs');
const path = require('path');
const extname = path.extname;
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
    function sourceMap(context, next) {
      if (context.url.startsWith('/src')) {
        const fpath = path.join(__dirname, context.path);
        const fstat = fs.statSync(fpath);

        if (fstat.isFile()) {
          context.type = extname(fpath);
          context.body = fs.createReadStream(fpath);
        }
      }
      return next();
    },
  ],
};
