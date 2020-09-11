import {customElement, html, LitElement, TemplateResult} from 'lit-element';

@customElement('paint-error404-page')
export class Error404Page extends LitElement {
  render(): TemplateResult {
    return html`
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for doesn't seem to exist. Head back
          <a href="/">home</a> and try again?
        </p>
      </section>
    `;
  }
}
