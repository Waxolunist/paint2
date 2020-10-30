import {Painting} from './paint-model';

export const removePaintingFromArray = (
  id: number | string,
  paintings: Painting[]
): Painting[] => paintings.filter((p) => p.id != id);

export const newSortedPaintingsArray = (paintings: Painting[]): Painting[] =>
  [...paintings].sort(
    (pA: Painting, pB: Painting) => (pA.id ?? 0) - (pB.id ?? 0)
  );
