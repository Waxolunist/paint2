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
}
