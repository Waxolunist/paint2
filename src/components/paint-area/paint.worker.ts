console.log('Paint Area Worker initialized');

interface Memory {
  offScreenCanvas: OffscreenCanvas | undefined;
  offScreenCanvasContext: OffscreenCanvasRenderingContext2D | null;
  measurePerformance: boolean;
  lastPoint: Point | undefined;
  erase: boolean;
  color: string;
  lineWidth: number;
  points: Array<Point>;
  strokes: Array<Stroke>;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Array<Point>;
  erase: boolean;
  color: string;
}

//*** Math  */
const calculatePoint = (
  pageX: number,
  pageY: number,
  left: number,
  top: number
) => ({
  x: (pageX - left) | 0,
  y: (pageY - top) | 0,
});

const distanceBetweenTwoPointsGreaterThan = (
  {x: x1, y: y1}: {x: number; y: number},
  {x: x2, y: y2}: {x: number; y: number},
  cmp: number
) => {
  const x = Math.abs(x2 - x1);
  const y = Math.abs(y2 - y1);
  return x > cmp || y > cmp;
};

const middleOfTwoPoints = (
  {x: x1, y: y1}: {x: number; y: number},
  {x: x2, y: y2}: {x: number; y: number}
) => ({
  x: (x1 + (x2 - x1) / 2) | 0,
  y: (y1 + (y2 - y1) / 2) | 0,
});

//*** Memory  */
const _: Memory = {
  offScreenCanvas: undefined,
  offScreenCanvasContext: null,
  measurePerformance: false,
  lastPoint: undefined,
  erase: false,
  color: '#000',
  lineWidth: 4,
  points: [],
  strokes: [],
};

const clearMemory = () => {
  _.strokes = [];
  _.points = [];
  _.erase = false;
};

//*** Canvas ops  */
const createOffScreenCanvasContext = (canvas: OffscreenCanvas) => {
  _.offScreenCanvas = canvas;
  _.offScreenCanvasContext = _.offScreenCanvas.getContext('2d');
  _.offScreenCanvasContext!.lineCap = 'round';
  _.offScreenCanvasContext!.lineJoin = 'round';
  //_.offScreenCanvasContext!.shadowOffsetX = 1;
  //_.offScreenCanvasContext!.shadowOffsetY = 1;
  //_.offScreenCanvasContext!.shadowBlur = 2;
  //_.offScreenCanvasContext!.translate(0.5, 0.5);
  setDrawStyle();
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
};

const render = () => {
  clearCanvas();
  for (let i = 0, len = _.strokes.length; i < len; ++i) {
    drawStroke(_.strokes[i]);
  }
  drawStroke(_);
};

const draw = () => requestAnimationFrame(render);

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

  const point = (_.lastPoint = calculatePoint(
    coordinates[0].pageX,
    coordinates[0].pageY,
    left,
    top
  ));
  _.points.push(point);
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
    if (distanceBetweenTwoPointsGreaterThan(point, _.lastPoint!, 5)) {
      _.erase = erase;
      _.color = color;
      _.points.push((_.lastPoint = point));
      draw();
    }
  }

  if (_.measurePerformance) {
    performance.mark('end_script');
    performance.measure('processCommand', 'start_script', 'end_script');
  }
};

const stopStroke = () => {
  draw();
};

const clearCanvas = () => {
  _.offScreenCanvasContext!.clearRect(
    -1,
    -1,
    _.offScreenCanvas!.width + 1,
    _.offScreenCanvas!.height + 1
  );
};

//*** Performance ops  */
const logPerformance = () => {
  if (_.measurePerformance) {
    const measures = performance.getEntriesByType('measure');
    if (measures.length) {
      const durations = measures.map((m) => m.duration);
      const max = Math.max(...durations);
      const min = Math.min(...durations);
      const sum = durations.reduce((a, b) => a + b, 0);
      console.log(`Max: ${max}`);
      console.log(`Min: ${min}`);
      console.log(`Avg: ${sum / measures.length}`);
      performance.clearMeasures();
    } else {
      console.log('No performance measures collected yet.');
    }
  } else {
    console.log('Performance measurement not enabled.');
  }
};

const processCommand = ({data}: {data: any}) => {
  switch (data.command) {
    case 'create':
      _.measurePerformance = data.measurePerformance;
      _.lineWidth = data.lineWidth;
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
      logPerformance();
      break;
    default:
      break;
  }
};

self.onmessage = processCommand;
