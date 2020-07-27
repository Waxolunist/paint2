import {Stroke} from '../../ducks/paint-model';
import {calculatePoint, middleOfTwoPoints, distanceBetweenTwoPointsGreaterThan} from './paint-math';
import { logPerformance } from './paint-perf';
import { PaintMemory } from './paint-memory';

console.log('Paint Area Worker initialized');

interface OffscreenPaintMemory extends PaintMemory {
  offScreenCanvas: OffscreenCanvas | undefined;
  offScreenCanvasContext: OffscreenCanvasRenderingContext2D | null;
}

//*** Memory  */
const _: OffscreenPaintMemory = {
  offScreenCanvas: undefined,
  offScreenCanvasContext: null,
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

const clearMemory = () => {
  _.strokes = [];
  _.points = [];
  _.erase = false;
};

//*** Canvas ops  */
class CanvasPainter {

  _: OffscreenPaintMemory;

  constructor(memory: OffscreenPaintMemory ) {
    this._ = memory;
  }

  createOffScreenCanvasContext = (canvas: OffscreenCanvas) => {
    this._.offScreenCanvas = canvas;
    this._.offScreenCanvasContext = canvas.getContext('2d');
    this._.offScreenCanvasContext!.lineCap = 'round';
    this._.offScreenCanvasContext!.lineJoin = 'round';
    this._.offScreenCanvasContext!.shadowOffsetX = 1;
    this._.offScreenCanvasContext!.shadowOffsetY = 1;
    this._.offScreenCanvasContext!.shadowBlur = 2;
    this._.offScreenCanvasContext!.translate(0.5, 0.5);
    setDrawStyle();
    draw(true);
  }

  setEraseStyle = () => {
    this._.offScreenCanvasContext!.strokeStyle = '#FFFFFF';
    this._.offScreenCanvasContext!.lineWidth = 32;
  }

  setDrawStyle = (color = '#000000') => {
    this._.offScreenCanvasContext!.strokeStyle = color;
    this._.offScreenCanvasContext!.lineWidth = this._.lineWidth;
  }

  drawStroke = ({points, erase, color}: Stroke) => {
    if (points.length > 0) {
      if (erase) setEraseStyle();
      else setDrawStyle(color);

      let p1 = points[0];
      let p2 = points[1];

      this._.offScreenCanvasContext!.beginPath();
      this._.offScreenCanvasContext!.moveTo(p1.x, p1.y);

      for (let i = 1, len = points.length; i < len; ++i) {
        const midPoint = middleOfTwoPoints(p1, p2);
        this._.offScreenCanvasContext!.quadraticCurveTo(
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
      this._.offScreenCanvasContext!.lineTo(p1.x, p1.y);
      this._.offScreenCanvasContext!.stroke();
    }
  }

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
  }) => {
    if (this._.points.length > 0) {
      _.strokes.push({points: _.points, erase: _.erase, color: _.color});
      _.points = [];
      _.erase = erase;
      _.color = color;
    }

    _.secondLastPoint = _.lastPoint;
    const point = (_.lastPoint = calculatePoint(
        coordinates[0].pageX,
        coordinates[0].pageY,
        left,
        top
    ));
    _.points.push(point);

    if (_.paintImmediate) {
      _.offScreenCanvasContext!.beginPath();
      _.offScreenCanvasContext!.moveTo(point.x, point.y);
    }
  };

  const moveStroke = ({
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
  }) => {
    if (_.measurePerformance) {
      performance.mark('start_script');
    }

    for (let i = 0, len = coordinates.length; i < len; ++i) {
      const point = calculatePoint(
          coordinates[i].pageX,
          coordinates[i].pageY,
          left,
          top
      );
      if (distanceBetweenTwoPointsGreaterThan(point, _.lastPoint!, 5) && distanceBetweenTwoPointsGreaterThan(point, _.secondLastPoint || _.lastPoint!, 5)) {
        _.erase = erase;
        _.color = color;
        _.points.push((_.lastPoint = point));
        draw(!_.paintImmediate);
      }
    }

    if (_.measurePerformance) {
      performance.mark('end_script');
      performance.measure('processCommand', 'start_script', 'end_script');
    }
  };

  const stopStroke = () => {
    if(!_.paintImmediate) {
      draw(false);
    }
  };

  const clearCanvas = () => {
    _.offScreenCanvasContext!.clearRect(
        -1,
        -1,
        _.offScreenCanvas!.width + 1,
        _.offScreenCanvas!.height + 1
    );
  };
}

const createOffScreenCanvasContext = (canvas: OffscreenCanvas) => {
  _.offScreenCanvas = canvas;
  _.offScreenCanvasContext = _.offScreenCanvas.getContext('2d');
  _.offScreenCanvasContext!.lineCap = 'round';
  _.offScreenCanvasContext!.lineJoin = 'round';
  _.offScreenCanvasContext!.shadowOffsetX = 1;
  _.offScreenCanvasContext!.shadowOffsetY = 1;
  _.offScreenCanvasContext!.shadowBlur = 2;
  _.offScreenCanvasContext!.translate(0.5, 0.5);
  setDrawStyle();
  draw(true);
};

const setEraseStyle = () => {
  _.offScreenCanvasContext!.strokeStyle = '#FFFFFF';
  _.offScreenCanvasContext!.lineWidth = 32;
};

const setDrawStyle = (color = '#000000') => {
  _.offScreenCanvasContext!.strokeStyle = color;
  _.offScreenCanvasContext!.lineWidth = _.lineWidth;
};

const drawStroke = ({points, erase, color}: Stroke) => {
  if (points.length > 0) {
    if (erase) setEraseStyle();
    else setDrawStyle(color);

    let p1 = points[0];
    let p2 = points[1];

    _.offScreenCanvasContext!.beginPath();
    _.offScreenCanvasContext!.moveTo(p1.x, p1.y);

    for (let i = 1, len = points.length; i < len; ++i) {
      const midPoint = middleOfTwoPoints(p1, p2);
      _.offScreenCanvasContext!.quadraticCurveTo(
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
    _.offScreenCanvasContext!.lineTo(p1.x, p1.y);
    _.offScreenCanvasContext!.stroke();
  }
};

const render = (drawAll = true) => () => {
  if(drawAll) {
    clearCanvas();
    for (let i = 0, len = _.strokes.length; i < len; ++i) {
      drawStroke(_.strokes[i]);
    }
  }
  drawStroke(_);
};

const draw = (drawAll = true) => requestAnimationFrame(render(drawAll));

const startStroke = ({
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
}) => {
  if (_.points.length > 0) {
    _.strokes.push({points: _.points, erase: _.erase, color: _.color});
    _.points = [];
    _.erase = erase;
    _.color = color;
  }

  _.secondLastPoint = _.lastPoint;
  const point = (_.lastPoint = calculatePoint(
    coordinates[0].pageX,
    coordinates[0].pageY,
    left,
    top
  ));
  _.points.push(point);

  if (_.paintImmediate) {
    _.offScreenCanvasContext!.beginPath();
    _.offScreenCanvasContext!.moveTo(point.x, point.y);
  }
};

const moveStroke = ({
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
}) => {
  if (_.measurePerformance) {
    performance.mark('start_script');
  }

  for (let i = 0, len = coordinates.length; i < len; ++i) {
    const point = calculatePoint(
        coordinates[i].pageX,
        coordinates[i].pageY,
        left,
        top
    );
    if (distanceBetweenTwoPointsGreaterThan(point, _.lastPoint!, 5) && distanceBetweenTwoPointsGreaterThan(point, _.secondLastPoint || _.lastPoint!, 5)) {
      _.erase = erase;
      _.color = color;
      _.points.push((_.lastPoint = point));
      draw(!_.paintImmediate);
    }
  }

  if (_.measurePerformance) {
    performance.mark('end_script');
    performance.measure('processCommand', 'start_script', 'end_script');
  }
};

const stopStroke = () => {
  if(!_.paintImmediate) {
    draw(false);
  }
};

const clearCanvas = () => {
  _.offScreenCanvasContext!.clearRect(
    -1,
    -1,
    _.offScreenCanvas!.width + 1,
    _.offScreenCanvas!.height + 1
  );
};

const postStrokes = () => {
  self.postMessage({
    strokes: [..._.strokes, {points: _.points, erase: _.erase, color: _.color}],
  });
};

const processCommand = ({data}: {data: any}) => {
  switch (data.command) {
    case 'create':
      _.measurePerformance = data.measurePerformance;
      _.lineWidth = data.lineWidth;
      _.strokes = data.strokes || [];
      _.paintImmediate = data.paintImmediate;
      createOffScreenCanvasContext(data.canvas);
      break;
    case 'start':
      startStroke(data);
      break;
    case 'move':
      moveStroke(data);
      break;
    case 'stop':
      stopStroke();
      break;
    case 'clear':
      clearMemory();
      clearCanvas();
      break;
    case 'perf':
      logPerformance(_.measurePerformance);
      break;
    case 'strokes':
      postStrokes();
      break;
    default:
      break;
  }
};

self.onmessage = processCommand;
