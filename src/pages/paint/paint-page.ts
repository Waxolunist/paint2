import {
  customElement,
  LitElement,
  html,
  css,
  property,
  query,
} from 'lit-element';
import {arrowBack} from './icons';
import '../../components/icon-button/paint-icon-button';
import '../../components/color-toolbar/paint-color-toolbar';
import '../../components/paint-area/paint-area';
import store from '../../store';
import {PaintArea} from '../../components/paint-area/paint-area';
import {connect} from 'pwa-helpers/connect-mixin';
import {ThunkDispatch, storeData} from '../../ducks/paint';

@customElement('paint-paint-page')
export class PaintPage extends connect(store)(LitElement) {
  @query('[name="paint-area-container"]')
  private areaContainer?: HTMLElement;

  @query('[name="paint-area"]')
  private area?: PaintArea;

  @property({type: Number, reflect: false})
  width = 0;

  @property({type: Number, reflect: false})
  height = 0;

  @property({type: String, reflect: false})
  colorCode = '#000';

  @property({type: String})
  id = '';

  connectedCallback() {
    super.connectedCallback();
    console.log(`Load paint-page with id ${this.id}`);
  }

  firstUpdated() {
    this.calcAspectRatio();
  }

  isLandscape({height, width}: {height?: number; width?: number} = {}) {
    if (width && height) {
      return width > height;
    }
    return window.screen.orientation.type.startsWith('landscape');
  }

  calcAspectRatio() {
    const {height, width} = this.areaContainer!.getBoundingClientRect();
    if (this.isLandscape({height, width})) {
      const scale = Math.min(width / 297, height / 210);
      this.height = (210 * scale) | 0;
      this.width = (297 * scale) | 0;
    } else {
      const scale = Math.min(width / 210, height / 297);
      this.height = (297 * scale) | 0;
      this.width = (210 * scale) | 0;
    }
  }

  static get styles() {
    // language=CSS
    return css`
      :host {
        display: block;
        display: flex;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }

      .paint-page {
        display: flex;
        width: 100%;
      }

      .paint-toolbar {
        width: 45px;
        min-width: 45px;
        background-color: #eee;
        display: flex;
        align-items: flex-start;
        padding-top: 5px;
        flex-direction: column;
        box-sizing: border-box;
      }

      .back-button {
        height: var(--icon-size);
        width: var(--icon-size);
        margin-bottom: 5px;
        margin-left: 7px;
      }

      .paint-wrapper {
        display: flex;
        align-items: stretch;
        flex-grow: 1;
        padding: 30px;
      }

      .paint-area-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `;
  }
  //
  render() {
    return html`
      <div class="paint-page">
        <div class="paint-toolbar">
          <paint-icon-button
            class="back-button"
            @icon-clicked="${this.navigateBack}"
          >
            ${arrowBack}
          </paint-icon-button>
          <paint-color-toolbar
            @color-changed="${this.colorChanged}"
          ></paint-color-toolbar>
        </div>
        <div class="paint-wrapper">
          <div name="paint-area-container" class="paint-area-container">
            <paint-area
              name="paint-area"
              width="${this.width}"
              height="${this.height}"
              colorCode="${this.colorCode}"
            ></paint-area>
          </div>
        </div>
      </div>
    `;
  }

  private navigateBack() {
    (store.dispatch as ThunkDispatch)(
      storeData({
        id: this.id,
        dataUrl: this.area!.toImage(),
        strokes: [],
      })
    );
  }

  private colorChanged(e: CustomEvent) {
    this.colorCode = e.detail.code;
  }
}
