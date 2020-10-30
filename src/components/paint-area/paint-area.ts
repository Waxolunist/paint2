import {
  css,
  customElement,
  eventOptions,
  html,
  LitElement,
  property,
  query,
  PropertyValues,
  CSSResult,
} from 'lit-element';
import PaintWorker from 'web-worker:./paint.worker.ts';
import store, {AppState} from '../../store';
import {CanvasPainter} from './paint-painter';
import {defaultMemory} from './paint-memory';
import {Stroke} from '../../ducks/paint-model';
import {TemplateResult} from 'lit-element';

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

  #worker?: Worker;

  #pointerActive = false;

  #canvasClientBoundingRect?: DOMRect;

  #workerSupported = false;

  #painter?: CanvasPainter = undefined;

  connectedCallback(): void {
    super.connectedCallback();
    this.#workerSupported = !!HTMLCanvasElement.prototype
      .transferControlToOffscreen;

    if (this.#workerSupported && !this.#worker) {
      this.#worker = new PaintWorker();
    } else {
      this.#painter = new CanvasPainter({
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
    this.#worker?.terminate();
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
    if (this.#workerSupported) {
      const offscreenCanvas = this.canvas.transferControlToOffscreen();
      this.#worker?.postMessage(
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
      this.#painter?.createCanvasContext(this.canvas);
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

  private createMessage(
    command: string,
    {pageX, pageY, buttons} = {pageX: 0, pageY: 0, buttons: 0},
    event: PointerEvent = <PointerEvent>{},
    {left, top} = {left: 0, top: 0}
  ) {
    const rawEvents = event.getCoalescedEvents
      ? event.getCoalescedEvents()
      : [];
    return {
      command,
      coordinates: this.mapEvents(
        rawEvents.length ? rawEvents : [{pageX, pageY}]
      ),
      left,
      top,
      erase: buttons === 32,
      color: this.colorCode,
    };
  }

  @eventOptions({capture: true, passive: true})
  private pointerDown(e: PointerEvent) {
    this.#pointerActive = true;
    this.canvas.setPointerCapture(e.pointerId);
    this.#canvasClientBoundingRect = this.canvas.getBoundingClientRect();
    const message = this.createMessage(
      'start',
      e,
      e,
      this.#canvasClientBoundingRect
    );
    this.#worker?.postMessage(message);
    this.#painter?.startStroke(message);
  }

  @eventOptions({capture: true, passive: true})
  private pointerUp(e: PointerEvent) {
    this.#pointerActive = false;
    this.canvas.releasePointerCapture(e.pointerId);
    const message = this.createMessage('stop');
    this.#worker?.postMessage(message);
    this.#painter?.stopStroke();
  }

  private pointerMove(e: PointerEvent) {
    if (this.#pointerActive) {
      const message = this.createMessage(
        'move',
        e,
        e,
        this.#canvasClientBoundingRect
      );
      this.#worker?.postMessage(message);
      this.#painter?.moveStroke(message);
    }
  }

  private throttle(
    timer: (callback: () => void) => void
  ): (callback: () => void) => void {
    let queuedCallback: (() => void) | null;
    return (callback) => {
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
  private throttledPointerMove(e: PointerEvent) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (PointerEvent.prototype.getCoalescedEvents) {
      this.pointerMove(e);
    } else {
      this.throttledMove(() => {
        this.pointerMove(e);
      });
    }
  }

  toImage(): string {
    return this.canvas.toDataURL('image/png');
  }

  async getStrokes(): Promise<Stroke[]> {
    return new Promise((resolve) => {
      if (this.#workerSupported) {
        this.#worker?.addEventListener(
          'message',
          (e) => resolve(e.data.strokes),
          {once: true}
        );
        this.#worker?.postMessage({command: 'strokes'});
      } else {
        resolve(this.#painter?.getStrokes());
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
