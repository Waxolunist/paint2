import {logPerformance} from './paint-perf';
import {defaultMemory, PaintCommand, PaintMemory} from './paint-memory';
import {CanvasPainter} from './paint-painter';

console.log('Paint Area Worker initialized');

let painter: CanvasPainter;

const postStrokes = () => self.postMessage({strokes: painter.getStrokes()});

const processCommand = ({data}: {data: PaintMemory & PaintCommand}) => {
  switch (data.command) {
    case 'create':
      painter = new CanvasPainter({
        ...defaultMemory,
        ...data,
      });
      painter.createCanvasContext(data.canvas!);
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
