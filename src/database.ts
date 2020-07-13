import Dexie from 'dexie';
import {Painting} from '../model/painting';

const _database = new Dexie('PaintingsDB');
_database.version(1).stores({
  paintings: '++id,strokes,dataURL',
});
_database.paintings.mapToClass(Painting);

_database.on('populate', () => {
  console.log('populate');
  const paintingsFromLS = localStorage.getItem('paintings');
  if (paintingsFromLS) {
    const paintings = JSON.parse(paintingsFromLS || '[]')
      .map((p) => new Painting(p));
    localStorage.setItem('paintings', null);
    _database.paintings.bulkAdd(paintings);
  }
});

export const database = async () => {
  if (!_database.isOpen()) {
    try {
      await _database.open();
      console.log(`DB successfule opened. Version ${_database.verno}`);
      return _database;
    } catch (err) {
      console.error('Failed to open db: ' + (err.stack || err));
    };
  }
  return _database;
};

export default database;
