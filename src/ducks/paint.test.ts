import {
  removePaintingFromArray,
  newSortedDeduplicatedPaintingsArray,
} from './paint-utils';
import {Painting} from './paint-model';

describe('paint events', () => {
  describe('delete ops', () => {
    it('should remove element with id', async () => {
      const array: Painting[] = [<Painting>{id: 1}, <Painting>{id: 2}];
      const filteredArray = removePaintingFromArray(1, array);
      expect(filteredArray).toHaveLength(1);
      expect(filteredArray[0].id).toEqual(2);
    });
  });

  describe('sort ops', () => {
    it('creates a new sorted array', () => {
      const array: Painting[] = [<Painting>{id: 2}, <Painting>{id: 1}];
      const sortedArray = newSortedDeduplicatedPaintingsArray(array);
      expect(sortedArray).toHaveLength(2);
      expect(sortedArray[0].id).toEqual(1);
      expect(sortedArray).not.toEqual(array);
    });

    it('creates and deduplicates a new sorted array', () => {
      const array: Painting[] = [
        <Painting>{id: 2},
        <Painting>{id: 1},
        <Painting>{id: 1},
      ];
      const sortedArray = newSortedDeduplicatedPaintingsArray(array);
      expect(sortedArray).toHaveLength(2);
      expect(sortedArray[0].id).toEqual(1);
      expect(sortedArray).not.toEqual(array);
    });
  });
});
