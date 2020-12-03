import {
  customElement,
  LitElement,
  html,
  TemplateResult,
  css,
  CSSResult,
  property,
} from 'lit-element';
import store, {AppState} from './store';
import {initialLoad, ThunkDispatch} from './ducks/paint';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Window {
    o9n: {
      orientation: {
        lock: (orientation: string) => Promise<void>;
      };
    };
  }
  interface HTMLElementTagNameMap {
    'lit-route': LitRouteElement;
  }
  interface Navigator {
    canShare?: (data?: ShareData) => boolean;
  }
}

@customElement('paint-app')
export class PaintApp extends LitElement {
  @property({type: String, reflect: true})
  ready = '';

  connectedCallback(): void {
    super.connectedCallback();
    (store.dispatch as ThunkDispatch)(initialLoad());
    window.onbeforeunload = () =>
      (<AppState>store.getState()).paint.paintings.forEach((p) =>
        p.freeMemory()
      );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import('./ponyfills/o9n').then(() => {
      window.o9n.orientation.lock('portrait').catch((err) => {
        console.log(`Ignore this error: ${err.message}`);
      });
    });
  }

  firstUpdated(): void {
    this.ready = 'ready';
  }

  static get styles(): CSSResult[] {
    // language=CSS
    return [
      css`
        :host {
          height: 100vh;
          width: 100vw;
          display: block;
        }
      `,
    ];
  }

  render(): TemplateResult {
    return html`
      <div>
        <lit-route
          path="/"
          component="paint-overview-page"
          .resolve="${() => import('./pages/overview/overview-page')}"
        ></lit-route>
        <lit-route
          path="/paint/:paintingId"
          component="paint-paint-page"
          .resolve="${() => import('./pages/paint/paint-page')}"
        ></lit-route>
        <lit-route
          path="/about"
          component="paint-about-page"
          .resolve="${() => import('./pages/about/about-page')}"
        ></lit-route>
        <lit-route
          component="paint-error404-page"
          .resolve="${() => import('./pages/errors/404-page')}"
        ></lit-route>
      </div>
    `;
  }
}
