import {Painting} from './paint-model';

export const removePaintingFromArray = (
  id: number | string,
  paintings: Painting[]
): Painting[] => paintings.filter((p) => p.id != id);
