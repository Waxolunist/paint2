import {customElement, LitElement, html} from 'lit-element';
import './store';
@customElement('paint-app')
export class PaintApp extends LitElement {
  connectedCallback() {
    super.connectedCallback();
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
