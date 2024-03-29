# Paint for Kids

[![Build Status](https://dev.azure.com/christiansterzl/Paint%202/_apis/build/status/Bundle%20and%20test?branchName=master)](https://dev.azure.com/christiansterzl/Paint%202/_build/latest?definitionId=1&branchName=master)

[https://paint.v-collaborate.com](https://paint.v-collaborate.com)

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

This sample uses esbuild as compiler to transpile to JavaScript.

To build the JavaScript version of your component:

```bash
npm run bundle
```

To run the bundle (before create certificates).

```bash
npm run serve:bundle
```

To watch files and rebuild when the files are modified, run the following command:

```bash
npm run serve
```

Both the TypeScript compiler and lit-analyzer are configured to be very strict. You may want to change `tsconfig.json` to make them less strict.

## Testing

This sample uses jest and the open-wc test helpers for testing. See the [open-wc testing documentation](https://open-wc.org/testing/testing.html) for more information.

Tests can be run with the `test` script:

```bash
npm run test
```

## Dev Server

This sample uses open-wc's [web-dev-server](https://modern-web.dev/docs/dev-server/overview/) for previewing the project without additional build steps. ES dev server handles resolving Node-style "bare" import specifiers, which aren't supported in browsers. It also automatically transpiles JavaScript and adds polyfills to support older browsers.

## Test service worker

First create once the certificates. Best tool for that is
`mkcert` (see [https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/](https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/)). 

For example:

```bash
mkcert -install
mkcert -cert-file certs/cert.pem -key-file certs/key.pem v-collaborate.com '*.v-collaborate.com' localhost 127.0.0.1 ::1
```

Configure the certificates in the file `web-dev-server.build.mjs`.

To test, that the serviceworker, something has to change in the shipped code.
E.g. the buildid.

So run the server as follows:

```bash
BUILDID=1 npm run serve:bundle
```

Open the browser. Go to the about page.

Stop the server and restart it with a different buildid.

```bash
BUILDID=2 npm run serve:bundle
```

Reload the browser. The same version as before should be shown and a box should appear
hinting you, that a new version is available. Click on the refresh button and the new 
bundleid should appear.

# Build Docker image

    npm run bundle && docker build -t waxolunist/paint2:latest -t waxolunist/paint2:latest .
    docker save waxolunist/paint2:latest | gzip > paint_latest.tar.gz

Or tag and push

     docker login registry.v-collaborate.com
     npm run bundle && docker build -t waxolunist/paint2:latest .
     docker tag waxolunist/paint2:latest registry.v-collaborate.com/dev/waxolunist/paint2:latest
     docker push registry.v-collaborate.com/dev/waxolunist/paint2:latest

Run it with:

    docker rm paintforkids
    docker run -p 8043:8043 --name paintforkids waxolunist/paint2:latest 

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

## More information

See [Get started](https://lit-element.polymer-project.org/guide/start) on the LitElement site for more information.

# TWA

see [TWA](https://developers.google.com/web/android/trusted-web-activity/quick-start)

When jdk8 is installed correctly, install android tools by executing

    scripts/install_adb_cli.sh mac

Alternatively you can also install "win" or "linux" versions. Default is "linux".

Then configure bubblewrap. I prepared the script

    scripts/config_bubblewrap.sh

After that start by building

    npm run twa:build

# Build systems

Not one build system is perfect. Each has its issues.
- Using rollup, the webworker loader could not run in watch mode, thus resulting in slow development cycles.
- Esbuild is a better alternative, blazing fast btw, but workers are hard to get right when bundling
- Testing with ts-jest has problems with workers
- esbuild has problems with debugging and dynamic imports

# Issues
- [x] about page
- [x] eraser
- [x] share function not programmed
- [x] save to image folder (via share)
- [x] test if share is really possible, error popup if not (first construct files, then call share)
- [x] safari comp.
- [x] version string in about page (rollup?)
- [ ] loading animations / skeletons / async image load on overview page
- [x] delete animation
- [ ] painting scale / wobble animation on delete
- [ ] active animation
- [ ] back animation
- [ ] don't scroll to top on back navigation
- [ ] PWA context menus / shortcuts
- [ ] lighthouse analysis 
- [x] TWA
- [ ] publish TWA
- [x] iOS topBar colour adjustment
- [x] iOS comp.
- [ ] animation on colorbuttons on ios slow
- [ ] sort with drag and drop?
- [ ] Multifileshare?
- [ ] Popup for filename?
- [ ] store image already in worker (worker to indexdb)?
- [x] store image on pointer up or navigate back (not only backbutton)?
- [x] 2-finger painting on devices without PointerEvent.prototype.getCoalescedEvents
- [x] links on about page, open in browser
- [x] service worker update (show that there is an update)
- [ ] a11y
- [ ] pencil thickness

Dev
- [x] uglify / minimize / terser
- [x] better watching
- [x] npm 7 
- [x] source maps on server for debugging
- [x] inspect esbuild and @web/dev-server
- [x] compare lit-analyzer to @custom-elements-manifest/analyzer
- [x] use concurrently for watch development
- [x] try ts-jest, remove babel
- [x] try esbuild-jest
- [ ] hot module reloading (depends on import.meta)
- [x] remove esbuild-copy plugin
- [ ] ts-jest modules (import.meta bug)
- [ ] types in store.ts

Server
- [x] Server fallback page
- [ ] Store file on server (share url)?
- [x] Better gzipping (brtl) - change to nginx
- [x] reload on about page not working
- [x] build and push docker image in dev azure
- [ ] include a robots.txt

Bugs
- [ ] console.error on back navigation - can't find blob url 
