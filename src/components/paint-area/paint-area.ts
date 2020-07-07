import {css, customElement, html, LitElement, property} from 'lit-element';

@customElement('paint-area')
export class PaintArea extends LitElement {
  @property()
  width: number = 0;

  @property()
  height: number = 0;

  @property()
  colorCode: string = '#000';

  static get styles() {
    // language=CSS
    return [
      css`
        :host {
          display: block;
        }

        canvas {
          background-color: white;
        }
      `,
    ];
  }

  render() {
    return html`
      <canvas width="${this.width}" height="${this.height}"></canvas>
    `;
  }
}
