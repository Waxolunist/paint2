require('pepjs/dist/pep');
window.screen.orientation = {type: 'landscape-primary'};
const {mockAnimationsApi} = require('jsdom-testing-mocks');
mockAnimationsApi();
// import.meta.url currently not working with ts-jest / jest
// strategy: isolate file loading worker, mock it globally
jest.mock('./src/components/paint-area/paint.worker.loader', () =>
  Object.create(null)
);
