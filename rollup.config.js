import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import workerLoader from 'rollup-plugin-web-worker-loader';
import {generateSW} from 'rollup-plugin-workbox';
import sourcemaps from 'rollup-plugin-sourcemaps';
import del from 'rollup-plugin-delete';

export default [
  {
    input: 'src/paint-app.ts',
    output: {
      dir: './bundle',
      format: 'esm',
      sourcemap: true,
    },
    onwarn(warning) {
      if (warning.code !== 'THIS_IS_UNDEFINED') {
        console.error(`(!) ${warning.message}`);
      }
    },
    plugins: [
      del({
        targets: './bundle/*',
      }),
      resolve(),
      workerLoader({inline: false, sourcemap: false}),
      typescript({
        sourceMap: true,
        exclude: ['node_modules', '**/*.test.ts'],
      }),
      copy({
        targets: [
          {src: 'src/index.html', dest: 'bundle'},
          {src: 'src/manifest.json', dest: 'bundle'},
          {src: 'src/images', dest: 'bundle'},
          {src: ['src/styles/*.css'], dest: 'bundle/styles'},
        ],
      }),
      generateSW({
        swDest: 'bundle/sw.js',
        globDirectory: 'bundle',
      }),
      sourcemaps(),
    ],
  },
];
