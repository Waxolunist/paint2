# Paint for Kids

Paint for Kids is a free paint app, with no ads and no tracking code. No cookies or whatsoever are used to track you or the usage of the app. No data about users or devices are collected. I only count the number of downloads. It can be installed on most devices, by just adding it to the home screen. The app works offline.

Main goal of this app is having fun with painting. Even little kids should have no problems using it and parents should not have any privacy concerns letting them. 

Use a touch screen compatible pen for the best user experience.

If you have any issues with the app or want to see new features, just create an github issue please.
    
## Setup

Install dependencies:

```bash
npm i
```

## Build

This sample uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

To build the JavaScript version of your component:

```bash
npm run build
```

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
npm run build:watch
```

Both the TypeScript compiler and lit-analyzer are configured to be very strict. You may want to change `tsconfig.json` to make them less strict.

## Testing

This sample uses Karma, Chai, Mocha, and the open-wc test helpers for testing. See the [open-wc testing documentation](https://open-wc.org/testing/testing.html) for more information.

Tests can be run with the `test` script:

```bash
npm test
```

## Dev Server

This sample uses open-wc's [es-dev-server](https://github.com/open-wc/open-wc/tree/master/packages/es-dev-server) for previewing the project without additional build steps. ES dev server handles resolving Node-style "bare" import specifiers, which aren't supported in browsers. It also automatically transpiles JavaScript and adds polyfills to support older browsers.

To run the dev server and open the project in a new browser tab:

```bash
npm run serve
```

There is a development HTML file located at `/dev/index.html` that you can view at http://localhost:8000/dev/index.html.

## Test service worker

First create once the certificates. Best tool for that is
`mkcert`. [https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/][see ``````https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/] 

Configure the certificates in the file `es-dev-server.test.js`.

Then start the server:

```bash
npm run serve:bundle
```

# Build Docker image

    npm run bundle && docker build -t waxolunist/paint:latest -t waxolunist/paint:2 .
    docker save waxolunist/paint:latest | gzip > paint_latest.tar.gz

Run it with:

    docker run -p 8043:8043 --name paintforkids waxolunist/paint:latest 

## Editing

If you use VS Code, we highly reccomend the [lit-plugin extension](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin), which enables some extremely useful features for lit-html templates:
  - Syntax highlighting
  - Type-checking
  - Code completion
  - Hover-over docs
  - Jump to definition
  - Linting
  - Quick Fixes
  
  The project is setup to reccomend lit-plugin to VS Code users if they don't already have it installed.

## Linting

Linting of TypeScript files is provided by [ESLint](eslint.org) and [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint). In addition, [lit-analyzer](https://www.npmjs.com/package/lit-analyzer) is used to type-check and lint lit-html templates with the same engine and rules as lit-plugin.

The rules are mostly the recommended rules from each project, but some have been turned off to make LitElement usage easier. The recommended rules are pretty strict, so you may want to relax them by editing `.eslintrc.json` and `tsconfig.json`.

To lint the project run:

```bash
npm run lint
```

## Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Polymer Project's style. You can change this in `.prettierrc.json`.

Prettier has not been configured to run when commiting files, but this can be added with Husky and and `pretty-quick`. See the [prettier.io](https://prettier.io/) site for instructions.

## Static Site

This project includes a simple website generated with the [eleventy](11ty.dev) static site generator and the templates and pages in `/docs-src`. The site is generated to `/docs` and intended to be checked in so that GitHub pages can serve the site [from `/docs` on the master branch](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

To enable the site go to the GitHub settings and change the GitHub Pages &quot;Source&quot; setting to &quot;master branch /docs folder&quot;.</p>

To build the site, run:

```bash
npm run docs
```

To serve the site locally, run:

```bash
npm run docs:serve
```

To watch the site files, and re-build automatically, run:

```bash
npm run docs:watch
```

The site will usually be served at http://localhost:8000.

## More information

See [Get started](https://lit-element.polymer-project.org/guide/start) on the LitElement site for more information.

# Issues
- [ ] about page
- [ ] eraser
- [ ] share function not programmed
- [ ] save to image folder
- [ ] store in worker
- [ ] store on pointer up
- [ ] iOS topBar colour adjustment
- [ ] loading animations
