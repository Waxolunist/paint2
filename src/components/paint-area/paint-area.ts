import {
  css,
  CSSResult,
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
} from 'lit';
import {customElement, eventOptions, property, query} from 'lit/decorators.js';
import {defaultMemory, PaintCommand, PaintMemory} from './paint-memory';
import store, {AppState} from '../../store';
import {CanvasPainter} from './paint-painter';
import PaintWorker from 'web-worker:./paint.worker.ts';
import {PointerEventCoalescor} from './pointer-event-coalescor';
import {Stroke} from '../../ducks/paint-model';

@customElement('paint-area')
export class PaintArea extends LitElement {
  @query('#canvas')
  private canvas!: HTMLCanvasElement;

  @property({type: String})
  paintingId = '';

  @property()
  width: number | string = 0;

  @property()
  height: number | string = 0;

  @property()
  colorCode = '#000';

  private worker?: Worker;

  private pointerActive = false;

  private canvasClientBoundingRect?: DOMRect;

  private workerSupported = false;

  private coalesceEventsSupported = false;

  private pointerEventCoalescor = new PointerEventCoalescor();

  private painter?: CanvasPainter = undefined;

  connectedCallback(): void {
    super.connectedCallback();
    this.workerSupported =
      !!HTMLCanvasElement.prototype.transferControlToOffscreen;
    this.coalesceEventsSupported = !!PointerEvent.prototype.getCoalescedEvents;

    if (this.workerSupported && !this.worker) {
      this.worker = new PaintWorker();
    } else {
      this.painter = new CanvasPainter({
        ...defaultMemory,
        ...{
          measurePerformance: false,
          lineWidth: 4,
          paintImmediate: true,
          strokes:
            (store.getState() as AppState).paint?.activePainting?.rawData
              ?.strokes || [],
        },
      });
    }
    console.log('connected');
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.worker?.terminate();
    console.log('disconnected');
  }

  updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has('width') && parseInt(this.width as string) > 0) {
      try {
        this.initWorker();
      } catch (e) {
        this.cloneCanvas();
        this.initWorker();
      }
    }
  }

  private cloneCanvas(): void {
    const canvasClone = this.canvas.cloneNode(true) as HTMLCanvasElement;
    const canvasParent = this.canvas.parentNode;
    canvasParent?.removeChild(this.canvas);
    canvasParent?.appendChild(canvasClone);
  }

  private initWorker(): void {
    if (this.workerSupported) {
      const offscreenCanvas = this.canvas.transferControlToOffscreen();
      this.worker?.postMessage(
        {
          command: 'create',
          canvas: offscreenCanvas,
          measurePerformance: false,
          lineWidth: 4,
          strokes: (store.getState() as AppState).paint?.activePainting?.rawData
            ?.strokes,
          paintImmediate: true,
        },
        [offscreenCanvas]
      );
    } else {
      this.painter?.createCanvasContext(this.canvas);
    }
  }

  private mapEvents(
    rawEvents: {pageX: number; pageY: number}[] = []
  ): {pageX: number; pageY: number}[] {
    return rawEvents.map(({pageX, pageY}: {pageX: number; pageY: number}) => ({
      pageX,
      pageY,
    }));
  }

  private toPointerEventArray(
    events: PointerEvent | PointerEvent[] = <PointerEvent>{}
  ): PointerEvent[] {
    if (Array.isArray(events)) {
      return events;
    }
    return (
      events.getCoalescedEvents?.() ?? [
        {pageX: events.pageX, pageY: events.pageY},
      ]
    );
  }

  private getLastEvent(
    events: PointerEvent | PointerEvent[] = <PointerEvent>{}
  ): PointerEvent {
    if (Array.isArray(events) && events.length) {
      return events[events.length - 1];
    }
    return events as PointerEvent;
  }

  private createMessage(
    command: string,
    events: PointerEvent | PointerEvent[] = <PointerEvent>{},
    {left, top} = {left: 0, top: 0}
  ): PaintCommand & Pick<PaintMemory, 'erase' | 'color'> {
    return {
      command,
      coordinates: this.mapEvents(this.toPointerEventArray(events)),
      left,
      top,
      erase: this.getLastEvent(events).buttons === 32,
      color: this.colorCode,
    };
  }

  @eventOptions({capture: true, passive: true})
  private pointerDown(e: PointerEvent): void {
    this.pointerActive = true;
    this.canvas.setPointerCapture(e.pointerId);
    this.canvasClientBoundingRect = this.canvas.getBoundingClientRect();
    const message = this.createMessage(
      'start',
      e,
      this.canvasClientBoundingRect
    );
    this.worker?.postMessage(message);
    this.painter?.startStroke(message);
  }

  @eventOptions({capture: true, passive: true})
  private pointerUp(e: PointerEvent): void {
    this.pointerActive = false;
    this.canvas.releasePointerCapture(e.pointerId);
    const message = this.createMessage('stop');
    this.worker?.postMessage(message);
    this.painter?.stopStroke();
    if (!this.coalesceEventsSupported) {
      this.pointerEventCoalescor.eventRemove(e);
    }
    this.dispatchEvent(
      new CustomEvent('stroke-painted', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private pointerMove(e: PointerEvent | PointerEvent[]): void {
    if (this.pointerActive) {
      const message = this.createMessage(
        'move',
        e,
        this.canvasClientBoundingRect
      );
      this.worker?.postMessage(message);
      this.painter?.moveStroke(message);
    }
  }

  private throttle(
    timer: (callback: () => void) => void
  ): (callback: () => void) => void {
    let queuedCallback: (() => void) | null;
    return (callback: () => void): void => {
      if (!queuedCallback) {
        timer(() => {
          const cb = queuedCallback;
          queuedCallback = null;
          cb?.();
        });
      }
      queuedCallback = callback;
    };
  }

  private throttledMove = this.throttle(requestAnimationFrame);

  @eventOptions({capture: true, passive: true})
  private throttledPointerMove(e: PointerEvent): void {
    if (this.coalesceEventsSupported) {
      this.pointerMove(e);
    } else {
      this.pointerEventCoalescor.eventAdd(e);
      this.throttledMove(() => {
        this.pointerMove(this.pointerEventCoalescor.getCoalescedEvents());
        this.pointerEventCoalescor.clear();
      });
    }
  }

  toImage(): string {
    const destinationCanvas: HTMLCanvasElement =
      document.createElement('canvas');
    destinationCanvas.width = this.canvas.width;
    destinationCanvas.height = this.canvas.height;

    const destCtx = destinationCanvas.getContext('2d');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    destCtx!.fillStyle = '#FFFFFF';
    destCtx?.fillRect(0, 0, this.canvas.width, this.canvas.height);
    destCtx?.drawImage(this.canvas, 0, 0);
    return destinationCanvas.toDataURL('image/png');
  }

  async getStrokes(): Promise<Stroke[]> {
    return new Promise<Stroke[]>((resolve) => {
      if (this.workerSupported) {
        this.worker?.addEventListener(
          'message',
          (e) => resolve(e.data.strokes),
          {once: true}
        );
        this.worker?.postMessage({command: 'strokes'});
      } else {
        resolve(this.painter?.getStrokes() ?? []);
      }
    });
  }

  static get styles(): CSSResult[] {
    // language=CSS
    return [
      css`
        :host {
          display: block;
        }

        canvas {
          background-color: white;
          touch-action: none;
        }
      `,
    ];
  }

  render(): TemplateResult {
    return html`
      <canvas
        id="canvas"
        width="${this.width}"
        height="${this.height}"
        @pointerdown="${this.pointerDown}"
        @pointerup="${this.pointerUp}"
        @pointercancel="${this.pointerUp}"
        @pointermove="${this.throttledPointerMove}"
      ></canvas>
    `;
  }
}
