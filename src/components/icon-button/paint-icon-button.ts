import {
  css,
  customElement,
  html,
  query,
  eventOptions,
  LitElement,
} from 'lit-element';
import {PaintButton} from '../paint-button/paint-button';
import {ShadowStyles, AnimatedStyles} from '../../styles/shared-styles';

@customElement('paint-icon-button')
export class IconButton extends LitElement {
  static get styles() {
    // language=CSS
    return [
      AnimatedStyles,
      ShadowStyles,
      css`
        :host {
        }

        ::slotted(svg) {
          width: calc(var(--icon-size) - 6px);
          height: calc(var(--icon-size) - 6px);
          padding-top: 3px;
          display: block;
          margin: auto;
        }

        .icon-wrapper {
          width: 100%;
          height: 100%;
          border-radius: var(--paint-icon-button-border-radius, 50%);
          background-color: var(--paint-icon-button-background-color, white);
          display: block;
          transition-property: box-shadow, border-radius !important;
          will-change: box-shadow, border-radius !important;
        }
      `,
    ];
  }

  @query('[name="icon-button"]')
  private button?: HTMLElement;

  render() {
    return html`
      <div
        name="icon-button"
        class="icon-wrapper shadow animated elevate elevate-2 elevated-3"
        @pointerdown="${this.pointerDown}"
        @pointerup="${this.pointerUp}"
      >
        <slot></slot>
      </div>
    `;
  }

  @eventOptions({capture: true, passive: true})
  private pointerDown(e: PointerEvent) {
    e.stopPropagation();
    this.button!.classList.add('clicked');
    this.button!.setPointerCapture(e.pointerId);
  }

  @eventOptions({capture: true, passive: true})
  private pointerUp(e: PointerEvent) {
    e.stopPropagation();
    this.button!.classList.remove('clicked');
    this.button!.releasePointerCapture(e.pointerId);
    this.dispatchEvent(
      new CustomEvent('icon-clicked', {
        bubbles: true,
        composed: true,
      })
    );
  }
}
