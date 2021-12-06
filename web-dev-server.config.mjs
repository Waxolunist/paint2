import {esbuildPlugin} from '@web/dev-server-esbuild';
import historyApiFallback from 'koa-history-api-fallback';
import rollupReplace from '@rollup/plugin-replace';
import {fromRollup} from '@web/dev-server-rollup';
const replace = fromRollup(rollupReplace);

const mapObj = {
  'process.env.BUILDID': `'${process.env.BUILDID || ''}'`,
  'process.env.COMMITID': `'${process.env.COMMITID || ''}'`,
  'process.env.NODE_ENV': `'${process.env.NODE_ENV || ''}'`,
  'process.env.PAINT_VERSION': `'${process.env.PAINT_VERSION || ''}'`,
};

export default {
  open: false,
  watch: false,
  port: 8000,
  nodeResolve: true,
  appIndex: '/index.html',
  rootDir: './src',
  debug: false,
  middlewares: [
    historyApiFallback({
      index: '/index.html',
    }),
  ],
  plugins: [
    replace({
      include: ['src/index.html'],
      values: mapObj,
      preventAssignment: true,
    }),
    esbuildPlugin({ts: true, target: 'es2021'}),
  ],
};
