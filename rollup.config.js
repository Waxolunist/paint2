import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy'
import workerLoader from 'rollup-plugin-web-worker-loader';

export default {
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
    resolve(),
    workerLoader({ inline: false, sourcemap: false }),
    typescript(),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'bundle' },
        { src: 'src/manifest.json', dest: 'bundle' },
        { src: 'src/images', dest: 'bundle' },
        { src: ['src/styles/*.css'], dest: 'bundle/styles' },
      ]
    })
  ],
};
