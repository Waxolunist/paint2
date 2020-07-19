import {
  css,
  customElement,
  eventOptions,
  html,
  LitElement,
  property,
  query,
  PropertyValues,
} from 'lit-element';
import PaintWorker from 'web-worker:./paint.worker.ts';
import store, {AppState} from '../../store';

@customElement('paint-area')
export class PaintArea extends LitElement {
  @query('canvas[name="canvas"]')
  private canvas?: HTMLCanvasElement;

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

  connectedCallback() {
    super.connectedCallback();
    if (!this.#worker) {
      this.#worker = new PaintWorker();
    }
    console.log('connected');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#worker?.terminate();
    console.log('disconnected');
  }

  updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has('width') && parseInt(this.width as string) > 0) {
      try {
        this.initWorker();
      } catch (e) {
        this.cloneCanvas();
        this.initWorker();
      }
    }
  }

  private cloneCanvas() {
    const canvasClone = this.canvas!.cloneNode(true) as HTMLCanvasElement;
    const canvasParent = this.canvas!.parentNode;
    canvasParent!.removeChild(this.canvas!);
    canvasParent!.appendChild(canvasClone);
  }

  private initWorker() {
    const offscreenCanvas = this.canvas!.transferControlToOffscreen();
    this.#worker?.postMessage(
      {
        command: 'create',
        canvas: offscreenCanvas,
        measurePerformance: false,
        lineWidth: 4,
        strokes: (store.getState() as AppState).paint?.activePainting?.rawData
          ?.strokes,
      },
      [offscreenCanvas]
    );
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
    rawEvents: PointerEvent[] = [],
    {left, top} = {left: 0, top: 0}
  ) {
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
    this.canvas!.setPointerCapture(e.pointerId);
    this.#canvasClientBoundingRect = this.canvas!.getBoundingClientRect();
    this.#worker!.postMessage(
      this.createMessage(
        'start',
        e,
        e.getCoalescedEvents(),
        this.#canvasClientBoundingRect
      )
    );
  }

  @eventOptions({capture: true, passive: true})
  private pointerUp(e: PointerEvent) {
    this.#pointerActive = false;
    this.canvas!.releasePointerCapture(e.pointerId);
    this.#worker!.postMessage(this.createMessage('stop'));
  }

  private pointerMove(e: PointerEvent) {
    if (this.#pointerActive) {
      console.log(e);
      this.#worker!.postMessage(
        this.createMessage(
          'move',
          e,
          e.getCoalescedEvents(),
          this.#canvasClientBoundingRect
        )
      );
    }
  }

  private throttle(timer: (callback: any) => void): (callback: any) => void {
    let queuedCallback: (() => void) | null;
    return (callback) => {
      if (!queuedCallback) {
        timer(() => {
          const cb = queuedCallback;
          queuedCallback = null;
          cb!();
        });
      }
      queuedCallback = callback;
    };
  }

  private throttledMove = this.throttle(requestAnimationFrame);

  @eventOptions({capture: true, passive: true})
  private throttledPointerMove(e: PointerEvent) {
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
    return this.canvas!.toDataURL('image/png');
  }

  async getStrokes(): Promise<Stroke[]> {
    return new Promise((resolve) => {
      this.#worker?.addEventListener(
        'message',
        (e) => resolve(e.data.strokes),
        {once: true}
      );
      this.#worker?.postMessage({command: 'strokes'});
    });
  }

  static get styles() {
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

  render() {
    return html`
      <canvas
        name="canvas"
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
