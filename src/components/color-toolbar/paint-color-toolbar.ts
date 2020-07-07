import {css, customElement, html, LitElement, property} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {htmlcolors} from './colors';
import '../icon-button/paint-icon-button';

@customElement('paint-color-toolbar')
export class ColorToolbar extends LitElement {
  @property({type: Number, reflect: true})
  private activeColor = 'black';

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
      `,
    ];
  }

  render() {
    return html`
      <div class="color-palette">
        ${repeat(
          Object.entries(htmlcolors),
          ([name]) => name,
          ([name, code]) => html` <paint-icon-button
            class="color-option"
            style="--paint-icon-button-background-color: ${code}"
            data-color-code="${code}"
            data-color-name="${name}"
            ?active="${this.activeColor === name}"
            @icon-clicked="${this.colorChange(code, name)}"
          ></paint-icon-button>`
        )}
      </div>
    `;
  }

  colorChange(code: string, name: string) {
    return () => {
      this.activeColor = name;
      this.dispatchEvent(
        new CustomEvent('color-changed', {
          detail: {code, name},
          bubbles: true,
          composed: true,
        })
      );
    };
  }
}
