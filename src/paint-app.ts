import {customElement, LitElement, html} from 'lit-element';
import './store';
import {connect} from 'pwa-helpers/connect-mixin';
import store from './store';
import {PaintState} from './ducks/paint-model';
import {navigate} from 'lit-redux-router';
import {RouterState} from 'lit-redux-router/lib/reducer';

@customElement('paint-app')
export class PaintApp extends connect(store)(LitElement) {
  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged({router, paint}: {router: RouterState; paint: PaintState}) {
    console.log(router);
    const activePaintingId = paint.activePainting?.painting?.id;
    if (activePaintingId && router.activeRoute === '/') {
      store.dispatch(navigate(`/paint/${activePaintingId}`));
    } else if(!activePaintingId && router.activeRoute !== '/') {
      store.dispatch(navigate('/'));
    }
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
          path="/paint/:id"
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
