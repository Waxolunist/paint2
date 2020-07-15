import {customElement, LitElement, html} from 'lit-element';
import './store';
import {connect} from 'pwa-helpers/connect-mixin';
import store, {AppState} from './store';
import {initialLoad, ThunkDispatch} from './ducks/paint';

@customElement('paint-app')
export class PaintApp extends connect(store)(LitElement) {
  connectedCallback() {
    super.connectedCallback();
    (store.dispatch as ThunkDispatch)(initialLoad());
    window.onbeforeunload = () =>
      (<AppState>store.getState()).paint.paintings.forEach(p => p.freeMemory());
  }

  render() {
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
