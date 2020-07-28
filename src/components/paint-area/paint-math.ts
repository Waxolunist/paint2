//*** Math  */
export const calculatePoint = (
  pageX: number,
  pageY: number,
  left: number,
  top: number
) => ({
  x: (pageX - left) | 0,
  y: (pageY - top) | 0,
});

//*** Math  */
export const distanceBetweenTwoPointsGreaterThan = (
  {x: x1, y: y1}: {x: number; y: number} = {x: 0, y: 0},
  {x: x2, y: y2}: {x: number; y: number} = {x: 0, y: 0},
  cmp: number
) => {
  const x = Math.abs(x2 - x1);
  const y = Math.abs(y2 - y1);
  return x > cmp || y > cmp;
};

export const middleOfTwoPoints = (
  {x: x1, y: y1}: {x: number; y: number},
  {x: x2, y: y2}: {x: number; y: number}
) => ({
  x: (x1 + (x2 - x1) / 2) | 0,
  y: (y1 + (y2 - y1) / 2) | 0,
});
