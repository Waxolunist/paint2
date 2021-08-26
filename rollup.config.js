/* global process, console */
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import workerLoader from 'rollup-plugin-web-worker-loader';
import {injectManifest} from 'rollup-plugin-workbox';
import {terser} from 'rollup-plugin-terser';
import {constants} from 'zlib';
import brotli from 'rollup-plugin-brotli';
import multiInput from 'rollup-plugin-multi-input';

const mapObj = {
  'process.env.BUILDID': `'${process.env.BUILDID || ''}'`,
  'process.env.COMMITID': `'${process.env.COMMITID || ''}'`,
  'process.env.NODE_ENV': `'${process.env.NODE_ENV || ''}'`,
  'process.env.PAINT_VERSION': `'${process.env.PAINT_VERSION || ''}'`,
};

const pluginsBase = [
  multiInput(),
  resolve(),
  workerLoader({inline: false, sourcemap: false}),
  typescript({
    sourceMap: true,
    exclude: ['node_modules', '**/*.test.ts'],
    include: ['src/**/*.ts'],
  }),
  copy({
    targets: [
      // eslint-disable-next-line no-undef, @typescript-eslint/explicit-function-return-type
      {
        src: 'src/index.html',
        dest: 'bundle',
        transform: (contents) =>
          contents.toString().replace(
            new RegExp(
              // Convert the object to array of keys
              Object.keys(mapObj)
                // Escape any special characters in the search key
                .map((key) => key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
                // Create the Regex pattern
                .join('|'),
              // Additional flags can be used. Like `i` - case-insensitive search
              'g'
            ),
            // For each key found, replace with the appropriate value
            (match) => mapObj[match]
          ),
      },
      {src: 'src/manifest.json', dest: 'bundle'},
      {src: 'src/images', dest: 'bundle'},
      {src: ['src/styles/*.css'], dest: 'bundle/styles'},
      {src: 'src', dest: 'bundle'},
      {
        src: 'node_modules/workbox-sw/build/workbox-sw.js',
        dest: 'bundle/serviceworker',
      },
      {src: ['src/utils/logger.js'], dest: 'bundle/utils'},
    ],
  }),
];

const pluginsProduction = [
  ...pluginsBase,
  terser({
    output: {
      comments: false,
    },
  }),
  injectManifest({
    swSrc: 'src/sw.js',
    swDest: 'bundle/sw.js',
    globDirectory: 'bundle',
  }),
  brotli({
    options: {
      mode: 0,
      level: constants.BROTLI_MAX_QUALITY,
    },
  }),
];

console.log(`Use rollupconfig for ${process.env.NODE_ENV}.`);

export default [
  {
    input: ['src/index.ts', 'src/serviceworker/load-serviceworker.ts'],
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
    plugins:
      process.env.NODE_ENV === 'production' ? pluginsProduction : pluginsBase,
  },
];
