import {
  calculatePoint,
  distanceBetweenTwoPointsGreaterThan,
  middleOfTwoPoints,
} from './paint-math';
import {PaintMemory} from './paint-memory';
import {Stroke} from '../../ducks/paint-model';

export class CanvasPainter {
  _: PaintMemory;

  constructor(memory: PaintMemory) {
    this._ = memory;
    this._.strokes = this._.strokes || [];
  }

  createCanvasContext = (canvas: OffscreenCanvas | HTMLCanvasElement): void => {
    this._.canvas = canvas;
    this._.canvasContext = canvas.getContext('2d')!;
    this._.canvasContext.lineCap = 'round';
    this._.canvasContext.lineJoin = 'round';
    this._.canvasContext.shadowOffsetX = 1;
    this._.canvasContext.shadowOffsetY = 1;
    this._.canvasContext.shadowBlur = 2;
    this._.canvasContext.translate(0.5, 0.5);
    this.setDrawStyle();
    this.draw(true);
  };

  setEraseStyle = (): void => {
    this._.canvasContext!.strokeStyle = '#FFFFFF';
    this._.canvasContext!.lineWidth = 32;
  };

  setDrawStyle = (color = '#000000'): void => {
    this._.canvasContext!.strokeStyle = color;
    this._.canvasContext!.lineWidth = this._.lineWidth;
  };

  drawStroke = ({points, erase, color}: Stroke): void => {
    if (points.length > 0) {
      if (erase) this.setEraseStyle();
      else this.setDrawStyle(color);

      let p1 = points[0];
      let p2 = points[1];

      this._.canvasContext!.beginPath();
      this._.canvasContext!.moveTo(p1.x, p1.y);

      for (let i = 1, len = points.length; i < len; ++i) {
        const midPoint = middleOfTwoPoints(p1, p2);
        this._.canvasContext!.quadraticCurveTo(
          p1.x,
          p1.y,
          midPoint.x,
          midPoint.y
        );
        p1 = points[i];
        p2 = points[i + 1];
      }
      // Draw last line as a straight line while
      // we wait for the next point to be able to calculate
      // the bezier control point
      this._.canvasContext!.lineTo(p1.x, p1.y);
      this._.canvasContext!.stroke();
    }
  };

  startStroke = ({
    coordinates,
    left,
    top,
    erase,
    color,
  }: {
    coordinates: {pageX: number; pageY: number}[];
    left: number;
    top: number;
    erase: boolean;
    color: string;
  }): void => {
    if (this._.points.length > 0) {
      this._.strokes.push({
        points: this._.points,
        erase: this._.erase,
        color: this._.color,
      });
      this._.points = [];
      this._.erase = erase;
      this._.color = color;
    }

    if (coordinates.length > 0) {
      this._.secondLastPoint = this._.lastPoint;
      const point = (this._.lastPoint = calculatePoint(
        coordinates[0].pageX,
        coordinates[0].pageY,
        left,
        top
      ));
      this._.points.push(point);

      if (this._.paintImmediate) {
        this._.canvasContext!.beginPath();
        this._.canvasContext!.moveTo(point.x, point.y);
      }
    }
  };

  moveStroke = ({
    coordinates,
    left,
    top,
    erase,
    color,
  }: {
    coordinates: {pageX: number; pageY: number}[];
    left: number;
    top: number;
    erase: boolean;
    color: string;
  }): void => {
    if (this._.measurePerformance) {
      performance.mark('start_script');
    }

    for (let i = 0, len = coordinates.length; i < len; ++i) {
      const point = calculatePoint(
        coordinates[i].pageX,
        coordinates[i].pageY,
        left,
        top
      );
      if (
        distanceBetweenTwoPointsGreaterThan(point, this._.lastPoint!, 5) &&
        distanceBetweenTwoPointsGreaterThan(
          point,
          this._.secondLastPoint || this._.lastPoint!,
          5
        )
      ) {
        this._.erase = erase;
        this._.color = color;
        this._.points.push((this._.lastPoint = point));
        this.draw(!this._.paintImmediate);
      }
    }

    if (this._.measurePerformance) {
      performance.mark('end_script');
      performance.measure('processCommand', 'start_script', 'end_script');
    }
  };

  stopStroke = (): void => {
    if (!this._.paintImmediate) {
      this.draw(false);
    }
  };

  render =
    (drawAll = true): (() => void) =>
    () => {
      if (drawAll) {
        this.clearCanvas();
        for (let i = 0, len = this._.strokes.length; i < len; ++i) {
          this.drawStroke(this._.strokes[i]);
        }
      }
      this.drawStroke(this._);
    };

  draw = (drawAll = true): number =>
    requestAnimationFrame(this.render(drawAll));

  clearCanvas = (): void => {
    this._.canvasContext!.clearRect(
      -1,
      -1,
      this._.canvas!.width + 1,
      this._.canvas!.height + 1
    );
  };

  clearMemory = (): void => {
    this._.strokes = [];
    this._.points = [];
    this._.erase = false;
  };

  getStrokes = (): Stroke[] => [
    ...this._.strokes,
    {points: this._.points, erase: this._.erase, color: this._.color},
  ];
}
