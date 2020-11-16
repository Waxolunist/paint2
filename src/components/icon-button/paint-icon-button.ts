import {
  css,
  customElement,
  html,
  query,
  eventOptions,
  LitElement,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import {ShadowStyles, AnimatedStyles} from '../../styles/shared-styles';
import {property} from 'lit-element';

@customElement('paint-icon-button')
export class IconButton extends LitElement {
  static get styles(): CSSResult[] {
    // language=CSS
    return [
      AnimatedStyles,
      ShadowStyles,
      css`
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

  @query('.icon-button')
  private button!: HTMLElement;

  @property({type: Boolean})
  active = false;

  render(): TemplateResult {
    return html`
      <div
        class="icon-button icon-wrapper shadow animated elevate elevate-2 elevated-3"
        @pointerdown="${this.pointerDown}"
        @pointerup="${this.pointerUp}"
        @pointercancel="${this.pointerUp}"
        @click="${this.clicked}"
      >
        <slot></slot>
      </div>
    `;
  }

  @eventOptions({capture: true, passive: true})
  private pointerDown(e: PointerEvent): void {
    e.stopPropagation();
    this.button.classList.add('clicked');
    if (process?.env?.NODE_ENV !== 'test')
      this.button.setPointerCapture(e.pointerId);
  }

  @eventOptions({capture: true, passive: true})
  private pointerUp(e: PointerEvent): void {
    e.stopPropagation();
    this.button.classList.remove('clicked');
    if (process?.env?.NODE_ENV !== 'test')
      this.button.releasePointerCapture(e.pointerId);
  }

  @eventOptions({capture: true, passive: false})
  private clicked(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('icon-clicked', {
        bubbles: true,
        composed: true,
      })
    );
  }
}
