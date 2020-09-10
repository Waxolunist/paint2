import {
  css,
  customElement,
  eventOptions,
  html,
  LitElement,
  property,
  query,
} from 'lit-element';
import {AnimatedStyles, ShadowStyles} from '../../styles/shared-styles';

@customElement('paint-paint-button')
export class PaintButton extends LitElement {
  @query('.paint-button')
  private button?: HTMLElement;

  @property({type: String})
  imageUrl?: string;

  static get styles() {
    // language=CSS
    return [
      AnimatedStyles,
      ShadowStyles,
      css`
        :host {
          display: block;
          background-color: white;
          width: auto;
          min-width: 100px;
          height: 100%;
          min-height: 100px;
          touch-action: none;
          margin: 0;
        }

        slot[name='content']::slotted(*),
        .content {
          height: 100%;
          width: 100%;
        }

        slot[name='content']::slotted(img),
        img.content {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .addons {
          position: absolute;
          width: var(--icon-size);
          top: calc(var(--icon-size) * -0.5);
          right: calc(var(--icon-size) * -0.5);
        }

        slot[name='addons']::slotted(*) {
          width: var(--icon-size);
          height: var(--icon-size);
          display: block;
          margin-top: 10px;
        }

        slot[name='addons']::slotted(*:first-child) {
          margin-top: 0;
        }

        .paint-button {
          width: 100%;
          height: 100%;
          border: var(--painting-button-border, none);
          box-sizing: border-box;
          padding: 5px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div
        class="paint-button shadow animated elevate elevate-1 elevated-3"
        @pointerdown="${this.pointerDown}"
        @pointerup="${this.pointerUp}"
      >
        ${this.imageUrl
          ? html`<img class="content" src="${this.imageUrl}"></img>`
          : html` <slot name="content"></slot>`}
        <div class="addons">
          <slot name="addons"></slot>
        </div>
      </div>
    `;
  }

  @eventOptions({capture: false, passive: true})
  private pointerDown(e: PointerEvent) {
    e.stopPropagation();
    this.button!.classList.add('clicked');
    this.button!.setPointerCapture(e.pointerId);
  }

  @eventOptions({capture: false, passive: true})
  private pointerUp(e: PointerEvent) {
    e.stopPropagation();
    this.button!.classList.remove('clicked');
    this.button!.releasePointerCapture(e.pointerId);
    this.dispatchEvent(
      new CustomEvent('paint-clicked', {
        bubbles: true,
        composed: true,
      })
    );
  }
}
