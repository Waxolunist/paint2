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

export const toFileExtension = (mimetype: string): string => {
  const split: string[] = mimetype.split('/');
  return split[split.length - 1];
};

export const dataURLtoBlob = (dataurl: string): Blob => {
  const arr = dataurl.split(',');
  const mime = arr[0]?.match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
};
