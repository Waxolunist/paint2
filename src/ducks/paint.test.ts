import {
  removePaintingFromArray,
  newSortedDeduplicatedPaintingsArray,
} from './paint-utils';
import {Painting} from './paint-model';
import {extractIdFromUrl} from './paint-utils';

describe('paint utils', () => {
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

  describe('extract ops', () => {
    const setLocation = (url: string): void => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete global.window.location;
      global.window.location = (new URL(url) as unknown) as Location;
    };

    it('extract id from pathname', () => {
      setLocation('https://www.example.com/paint/1');
      expect(extractIdFromUrl()).toEqual('1');
    });

    it('extract id from pathname', () => {
      setLocation('https://www.example.com/');
      expect(extractIdFromUrl()).toBeUndefined();
    });

    it('extract id from pathname', () => {
      setLocation('https://www.example.com/blablubbb/222');
      expect(extractIdFromUrl()).toBeUndefined();
    });
  });
});
