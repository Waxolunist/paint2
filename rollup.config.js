import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy'
import workerLoader from 'rollup-plugin-web-worker-loader';
import { generateSW } from 'rollup-plugin-workbox';
import sourcemaps from 'rollup-plugin-sourcemaps';
import babel from '@rollup/plugin-babel';
import multi from '@rollup/plugin-multi-entry';
import del from 'rollup-plugin-delete'

export default [{
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
            targets: './bundle/*'
        }),
        resolve(),
        workerLoader({ inline: false, sourcemap: false }),
        typescript(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            extensions: ['.ts', '.js'],
            include: 'src/**/*',
        }),
        copy({
            targets: [
                { src: 'src/index.html', dest: 'bundle' },
                { src: 'src/manifest.json', dest: 'bundle' },
                { src: 'src/images', dest: 'bundle' },
                { src: ['src/styles/*.css'], dest: 'bundle/styles' },
            ]
        }),
        generateSW({
            swDest: 'bundle/sw.js',
            globDirectory: 'bundle',
        }),
        sourcemaps(),
    ]
}, {
    input: 'src/**/*.test.ts',
    output: {
        dir: './test-bundle',
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
            targets: './test-bundle/*'
        }),
        multi(),
        resolve(),
        typescript(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            extensions: ['.ts', '.js'],
            include: 'src/**/*',
        }),
        sourcemaps(),
    ],
}];
