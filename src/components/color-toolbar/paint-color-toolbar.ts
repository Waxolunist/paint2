import {animate} from '@lit-labs/motion';
import {css, CSSResult, html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import '../icon-button/paint-icon-button';
import {colors} from './colors';

@customElement('paint-color-toolbar')
export class ColorToolbar extends LitElement {
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
        width: 70px;
      }

      .color-palette .wrapper {
        width: 100%;
        opacity: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        overflow-y: scroll;
        transform: translateY(-100%);
        transition: transform 1.5s cubic-bezier(1, 0.49, 0.63, 1.25);
        will-change: transform;
      }

      .color-palette .wrapper.active {
        transform: translateY(0);
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
  @property({type: String, reflect: true})
  activeColor = colors[0];

  @property({type: Boolean, reflect: true})
  active = false;

  @property({type: Boolean, reflect: false})
  animated = false;

  firstUpdated(): void {
    this.animated = this.active;
  }

  render(): TemplateResult {
    return html`
      <div class="color-palette">
        <div class="wrapper ${this.animated ? 'active' : ''}" ${animate()}>
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
