import historyApiFallback from 'koa-history-api-fallback';
import fs from 'fs';
import path from 'path';

const extname = path.extname;

export default {
    port: 8000,
    nodeResolve: true,
    appIndex: 'index.html',
    rootDir: './src',
};