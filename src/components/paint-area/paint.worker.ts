import {logPerformance} from './paint-perf';
import {defaultMemory} from './paint-memory';
import {CanvasPainter} from './paint-painter';

console.log('Paint Area Worker initialized');

const postStrokes = () => self.postMessage({ strokes: painter.getStrokes() });

let painter: CanvasPainter;

const processCommand = ({data}: {data: any}) => {
  switch (data.command) {
    case 'create':
      painter = new CanvasPainter({
        ...defaultMemory,
        ...data,
      });
      painter.createCanvasContext(data.canvas);
      break;
    case 'start':
      painter.startStroke(data);
      break;
    case 'move':
      painter.moveStroke(data);
      break;
    case 'stop':
      painter.stopStroke();
      break;
    case 'clear':
      painter.clearMemory();
      painter.clearCanvas();
      break;
    case 'perf':
      logPerformance(defaultMemory.measurePerformance);
      break;
    case 'strokes':
      postStrokes();
      break;
    default:
      break;
  }
};

self.onmessage = processCommand;
