import {PaintingImpl, PaintingRawData} from './paint-model';

describe('model', () => {
  describe('PaintingImpl', () => {
    it('should set default values', () => {
      const model = new PaintingImpl('data:image/png;base64,abc', 1);
      expect(model.blobUrl).toEqual('');
    });
  });

  describe('PaintingRawData', () => {
    it('should set default values', () => {
      const model = new PaintingRawData(1, []);
      expect(model).toMatchSnapshot();
    });
  });
});
