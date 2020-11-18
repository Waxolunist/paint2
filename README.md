# Paint for Kids

[https://paint.v-collaborate.com]

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
npm run bundle
```

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
npm run watch
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

For example:

```bash
mkcert -cert-file certs/cert.pem -key-file certs/key.pem v-collaborate.com '*.v-collaborate.com' localhost 127.0.0.1 ::1
```

Configure the certificates in the file `es-dev-server.build.cjs`.

Then start the server:

```bash
npm run serve:bundle
```

# Build Docker image

    npm run bundle && docker build -t waxolunist/paint2:latest -t waxolunist/paint2:latest .
    docker save waxolunist/paint2:latest | gzip > paint_latest.tar.gz

Or tag and push

     docker login registry.v-collaborate.com
     npm run bundle && docker build -t waxolunist/paint2:latest -t waxolunist/paint2:latest .
     docker tag waxolunist/paint2:latest registry.v-collaborate.com/christian.sterzl/waxolunist/paint2:latest
     docker push registry.v-collaborate.com/christian.sterzl/waxolunist/paint2:latest

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

# Issues
- [x] about page
- [x] eraser
- [x] share function not programmed
- [x] save to image folder (via share)
- [x] test if share is really possible, error popup if not (first construct files, then call share)
- [x] safari comp.
- [ ] version string in about page (rollup?)
- [ ] loading animations / skeletons / async image load on overview page
- [ ] PWA context menus / shortcuts
- [ ] lighthouse analysis 
- [ ] TWA
- [x] iOS topBar colour adjustment
- [x] iOS comp.
- [ ] animation on colorbuttons on ios slow
- [ ] sort with drag and drop?
- [ ] Multifileshare?
- [ ] Popup for filename?
- [ ] store image in worker (worker to indexdb)?
- [ ] store image on pointer up?
- [x] 2-finger painting on devices without PointerEvent.prototype.getCoalescedEvents
- [ ] links on about page, open in browser
- [ ] service worker update (show that there is an update)

Dev
- [x] uglify / minimize / terser
- [ ] better watching
- [ ] npm 7 
- [ ] source maps on server for debugging

Server
- [x] Server fallback page
- [ ] Store file on server (share url)?
- [ ] Better gzipping (brtl) - change to nginx
- [x] reload on about page not working
- [ ] build and push docker image in dev azure