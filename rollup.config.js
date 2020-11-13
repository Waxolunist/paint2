import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import workerLoader from 'rollup-plugin-web-worker-loader';
import {generateSW} from 'rollup-plugin-workbox';

const pluginsBase = [
  resolve(),
  workerLoader({inline: false, sourcemap: false}),
  typescript({
    sourceMap: true,
    exclude: ['node_modules', '**/*.test.ts'],
  }),
  copy({
    targets: [
      // eslint-disable-next-line no-undef, @typescript-eslint/explicit-function-return-type
      {
        src: 'src/index.html',
        dest: 'bundle',
        transform: (contents) =>
          contents.toString().replace(
            new RegExp('process.env.NODE_ENV', 'g'),
            // eslint-disable-next-line no-undef
            `'${process.env.NODE_ENV || ''}'`
          ),
      },
      {src: 'src/manifest.json', dest: 'bundle'},
      {src: 'src/images', dest: 'bundle'},
      {src: ['src/styles/*.css'], dest: 'bundle/styles'},
    ],
  }),
];

const pluginsProduction = [
  ...pluginsBase,

  generateSW({
    swDest: 'bundle/sw.js',
    globDirectory: 'bundle',
  }),
];

// eslint-disable-next-line no-undef
console.log(`Use rollupconfig for ${process.env.NODE_ENV}.`);

export default [
  {
    input: 'src/paint-app.ts',
    output: {
      dir: './bundle',
      format: 'esm',
      sourcemap: true,
    },
    cache: false,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
    onwarn(warning) {
      if (warning.code !== 'THIS_IS_UNDEFINED') {
        // eslint-disable-next-line no-undef
        console.error(`(!) ${warning.message}`);
      }
    },
    // eslint-disable-next-line no-undef
    plugins:
      process.env.NODE_ENV === 'production' ? pluginsProduction : pluginsBase,
  },
];
