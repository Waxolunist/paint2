import {Point, Stroke} from '../../ducks/paint-model';

export interface PaintMemory {
  measurePerformance: boolean;
  lastPoint: Point | undefined;
  secondLastPoint: Point | undefined;
  erase: boolean;
  color: string;
  lineWidth: number;
  points: Array<Point>;
  strokes: Array<Stroke>;
  paintImmediate: boolean;
  canvas?: OffscreenCanvas | HTMLCanvasElement;
  canvasContext?: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
}

//*** Memory  */
export const defaultMemory: PaintMemory = {
  canvas: undefined,
  canvasContext: undefined,
  measurePerformance: false,
  lastPoint: undefined,
  secondLastPoint: undefined,
  erase: false,
  color: '#000',
  lineWidth: 4,
  points: [],
  strokes: [],
  paintImmediate: true,
};