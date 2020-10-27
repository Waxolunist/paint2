import {removePaintingFromArray} from './paint-utils';
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
});
