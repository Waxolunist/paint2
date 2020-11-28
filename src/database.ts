import Dexie from 'dexie';
import {Painting, PaintingImpl, PaintingRawData} from './ducks/paint-model';

export class PaintingDatabase extends Dexie {
  public paintings: Dexie.Table<Painting, number>;
  public strokes: Dexie.Table<PaintingRawData, number>;

  constructor() {
    super('PaintingDatabase');
    this.version(1).stores({
      paintings: '++id,strokes,dataURL',
    });
    this.version(2)
      .stores({
        paintings: '++id,dataURL',
        strokes: '&paintingId,strokes',
      })
      .upgrade((tx) => {
        return tx
          .table('paintings')
          .toCollection()
          .modify(async (p) => {
            delete p.strokes;
            await tx.table('strokes').put(p.strokes, p.id);
          });
      });
    this.paintings = this.table('paintings');
    this.strokes = this.table('strokes');
  }
}

const _database = new PaintingDatabase();
_database.paintings.mapToClass(PaintingImpl);

_database.on('populate', () => {
  const paintingsFromLS = localStorage.getItem('paintings');
  if (paintingsFromLS) {
    const paintings = (JSON.parse(paintingsFromLS || '[]') || []).map(
      (p: Painting) => p
    );
    localStorage.removeItem('paintings');
    _database.paintings.bulkAdd(paintings);
  }
});

export const database = async (): Promise<PaintingDatabase> => {
  if (!_database.isOpen()) {
    try {
      await _database.open();
      console.log(`DB successful opened. Version ${_database.verno}`);
      return _database;
    } catch (err) {
      if (window.process.env.NODE_ENV === 'production') {
        console.error('Failed to open db: ' + (err.stack || err));
      }
    }
  }
  return _database;
};

export default database;
