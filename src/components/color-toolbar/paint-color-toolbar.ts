import {css, customElement, html, LitElement, property} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {colors} from './colors';
import '../icon-button/paint-icon-button';

@customElement('paint-color-toolbar')
export class ColorToolbar extends LitElement {
  @property({type: Number, reflect: true})
  private activeColor = colors[0];

  static get styles() {
    // language=CSS
    return [
      css`
        :host {
          flex: 1;
          align-self: stretch;
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .color-palette {
          position: absolute;
          top: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          overflow-y: scroll;
          width: 70px;
        }

        .color-option {
          width: var(--icon-size);
          height: var(--icon-size);
          margin-top: 3px;
          margin-left: 7px;
        }

        .color-option[active] {
          --paint-icon-button-border-radius: 0;
        }

        .color-option:last-child {
          margin-bottom: 1em;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="color-palette">
        ${repeat(
          colors,
          (code) => html` <paint-icon-button
            class="color-option"
            style="--paint-icon-button-background-color: ${code}"
            data-color-code="${code}"
            ?active="${this.activeColor === code}"
            @icon-clicked="${this.colorChange(code)}"
          ></paint-icon-button>`
        )}
      </div>
    `;
  }

  colorChange(code: string) {
    return () => {
      this.activeColor = code;
      this.dispatchEvent(
        new CustomEvent('color-changed', {
          detail: {code},
          bubbles: true,
          composed: true,
        })
      );
    };
  }
}
