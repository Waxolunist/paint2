require('pepjs/dist/pep');
const Dexie = require('dexie');
Dexie.dependencies.indexedDB = require('fake-indexeddb');
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
window.screen.orientation = {type: 'landscape-primary'};

// import.meta.url currently not working with ts-jest / jest
// strategy: isolate file loading worker, mock it globally
jest.mock('./src/components/paint-area/paint.worker.loader', () =>
  Object.create(null)
);
