import {Painting} from './paint-model';

export const extractIdFromUrl = (): string | undefined => {
  const match = window.location.pathname.match(/\/paint\/(\d+)/);
  return match ? match[1] : undefined;
};

export const removePaintingFromArray = (
  id: number | string,
  paintings: Painting[]
): Painting[] => paintings.filter((p) => p.id != id);

export const newSortedDeduplicatedPaintingsArray = (
  paintings: Painting[]
): Painting[] => [
  ...new Map(
    paintings
      .filter((p: Painting | undefined) => p)
      .map((p: Painting): [number | undefined, Painting] => [p.id, p])
      .sort(
        (
          [idA]: [number | undefined, Painting],
          [idB]: [number | undefined, Painting]
        ) => (idA ?? 0) - (idB ?? 0)
      )
  ).values(),
];
