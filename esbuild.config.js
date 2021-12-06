#!/usr/bin/env node

/* global process, console */

import {html} from '@esbuilder/html';
import {compress} from 'brotli';
import esbuild from 'esbuild';
import {promises as fs} from 'fs';
import glob from 'tiny-glob';
import {injectManifest} from 'workbox-build';
import {constants} from 'zlib';
import copyfiles from 'copyfiles';
/** ES Build */
const outdir = 'bundle';
const globalOptions = {
  outdir,
  brotliSettings: {
    extension: 'br',
    mode: 0, // 0 = generic, 1 = text, 2 = font (WOFF2)
    quality: constants.BROTLI_MAX_QUALITY,
  },
  esBuildSettings: {
    outdir,
    bundle: true,
    splitting: true,
    format: 'esm',
    minify: true,
    sourcemap: 'external',
    metafile: true,
    treeShaking: true,
    plugins: [],
  },
};

try {
  const resultHTML = await esbuild.build({
    ...globalOptions.esBuildSettings,
    entryPoints: ['src/index.html'],
    plugins: [html()],
    assetNames: '[name]',
    define: {
      'process.env.BUILDID': `'${process.env.BUILDID || ''}'`,
      'process.env.COMMITID': `'${process.env.COMMITID || ''}'`,
      'process.env.NODE_ENV': `'${process.env.NODE_ENV || ''}'`,
      'process.env.PAINT_VERSION': `'${process.env.PAINT_VERSION || ''}'`,
    },
  });
  console.log('HTML-Build successful!');
  console.log(resultHTML.errors);
  console.log(resultHTML.warnings);
  console.log(resultHTML.metafile);

  const workerEntryPoints = await glob('./src/**/*.worker.ts');
  console.log(`Found ${workerEntryPoints.length}  workers.`);
  console.log(workerEntryPoints);
  const resultWorkers = await esbuild.build({
    ...globalOptions.esBuildSettings,
    entryPoints: workerEntryPoints,
    splitting: false,
  });

  console.log('Workers-Build successful!');
  console.log(resultWorkers.errors);
  console.log(resultWorkers.warnings);
  console.log(resultWorkers.metafile);
} catch (e) {
  console.error('Error during esBuild.', e);
  process.exit(1);
}

/** Assets */
try {
  await new Promise((resolve, reject) =>
    copyfiles(
      [
        './src/images/**/*',
        './src/styles/**/*.css',
        './src/manifest.json',
        globalOptions.outdir,
      ],
      {up: 1},
      (err) => {
        if (err) reject();
        else resolve();
      }
    )
  );
  await new Promise((resolve, reject) =>
    copyfiles(
      [
        './node_modules/workbox-sw/build/workbox-sw.js',
        `${globalOptions.outdir}/serviceworker/`,
      ],
      {
        up: 3,
        flat: true,
      },
      (err) => {
        if (err) reject();
        else resolve();
      }
    )
  );
  console.log('Successful copied assets.');
} catch (e) {
  console.error('Error during assets build step.', e);
  process.exit(1);
}

/** ServiceWorker */
const swSrc = 'src/sw.js';
const swDest = `${globalOptions.outdir}/sw.js`;
const {count, size} = await injectManifest({
  swSrc,
  swDest,
  globDirectory: globalOptions.outdir,
});
console.log(
  `ServiceWorker: Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.\n`
);

/** Compress */
const filesToCompress = await glob(
  `${globalOptions.outdir}/**/*.{js,html,css}`
);
await Promise.all(
  filesToCompress.map(async (file) => {
    const fileContent = await fs.readFile(file);
    console.log(`Compressing file ${file}.`);
    const result = compress(fileContent, globalOptions.brotliSettings);
    if (result) {
      return fs.writeFile(
        `${file}.${globalOptions.brotliSettings.extension}`,
        result
      );
    }
  })
);
console.log('Brotli compression done.');
