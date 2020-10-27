import {customElement, LitElement, html, TemplateResult} from 'lit-element';
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
        console.log('Ignore this error: ' + err.message);
      });
    });
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
          component="paint-error404-page"
          .resolve="${() => import('./pages/errors/404-page')}"
        ></lit-route>
      </div>
    `;
  }
}
