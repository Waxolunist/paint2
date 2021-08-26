import historyApiFallback from 'koa-history-api-fallback';
import fs from 'fs';
import path from 'path';

export default {
    port: 4433,
    http2: true,
    nodeResolve: false,
    appIndex: 'index.html',
    rootDir: './bundle',
    sslKey: './certs/key.pem',
    sslCert: './certs/cert.pem',
    middlewares: [
        historyApiFallback({
            index: '/index.html',
        }),
        function sourceMap(context, next) {
            if (context.url.startsWith('/src')) {
                const fpath = path.join(path.resolve(), context.path);
                const fstat = fs.statSync(fpath);

                if (fstat.isFile()) {
                    context.type = path.extname(fpath);
                    context.body = fs.createReadStream(fpath);
                }
            }
            return next();
        },
    ]
};