import {css, html, LitElement, CSSResult, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {colors} from './colors';
import '../icon-button/paint-icon-button';

@customElement('paint-color-toolbar')
export class ColorToolbar extends LitElement {
  @property({type: String, reflect: true})
  activeColor = colors[0];

  static styles: CSSResult[] = [
    // language=CSS
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
        min-height: var(--icon-size);
      }

      .color-option[active] {
        --paint-icon-button-border-radius: 0;
      }

      .color-option:last-child {
        margin-bottom: 1em;
      }
    `,
  ];

  render(): TemplateResult {
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

  colorChange(code: string): () => void {
    return (): void => {
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
