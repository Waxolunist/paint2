import {css, customElement, html} from 'lit-element';
import {imageIcon} from './icons';
import {PaintButton} from '../paint-button/paint-button';

@customElement('paint-new-paint-button')
export class NewPaintButton extends PaintButton {
  static get styles() {
    // language=CSS
    return [
      css`
        :host {
          display: block;
        }

        .add {
          background-color: lightgray;
          --painting-button-border: 10px dashed #ffffef;
        }

        .add svg {
          width: 100%;
          height: 100%;
          fill: #ffffef;
        }
      `,
    ];
  }

  render() {
    return html`
      <paint-paint-button class="add">
        <div slot="content">${imageIcon}</div>
      </paint-paint-button>
    `;
  }
}
