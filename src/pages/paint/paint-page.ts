import {LitElement, html, css, CSSResult, TemplateResult} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {arrowBack} from './icons';
import '../../components/icon-button/paint-icon-button';
import '../../components/color-toolbar/paint-color-toolbar';
import '../../components/paint-area/paint-area';
import store from '../../store';
import {PaintArea} from '../../components/paint-area/paint-area';
import {connect} from 'pwa-helpers/connect-mixin';
import {ThunkDispatch, storeData, unloadData} from '../../ducks/paint';
import {PaintState} from '../../ducks/paint-model';

@customElement('paint-paint-page')
export class PaintPage extends connect(store)(LitElement) {
  @query('#paint-area-container')
  private areaContainer!: HTMLElement;

  @query('#paint-area')
  private area!: PaintArea;

  @property({type: Number, reflect: false})
  width = 0;

  @property({type: Number, reflect: false})
  height = 0;

  @property({type: String, reflect: false})
  colorCode = '#000';

  @property({type: String})
  paintingId = '';

  @state()
  private paintingLoaded = false;

  firstUpdated(): void {
    this.calcAspectRatio();
  }

  isLandscape({
    height,
    width,
  }: {height?: number; width?: number} = {}): boolean {
    if (width && height) {
      return width > height;
    }
    return window.screen.orientation.type.startsWith('landscape');
  }

  calcAspectRatio(): void {
    const {height, width} = this.areaContainer.getBoundingClientRect();
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

  static styles: CSSResult =
    // language=CSS
    css`
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
        position: fixed;
        top: 0;
        bottom: 0;
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
        margin-left: 45px;
      }

      .paint-area-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `;

  render(): TemplateResult {
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
            active="${this.paintingLoaded}"
            @color-changed="${this.colorChanged}"
          ></paint-color-toolbar>
        </div>
        <div class="paint-wrapper">
          <div id="paint-area-container" class="paint-area-container">
            ${this.paintingLoaded
              ? html`<paint-area
                  id="paint-area"
                  width="${this.width}"
                  height="${this.height}"
                  colorCode="${this.colorCode}"
                  @stroke-painted="${this.storeStroke}"
                ></paint-area>`
              : html``}
          </div>
        </div>
      </div>
    `;
  }

  stateChanged({paint}: {paint: PaintState}): void {
    this.paintingLoaded =
      paint.activePainting?.painting.id === parseInt(this.paintingId);
  }

  private async storeStroke(): Promise<void> {
    const strokes = await this.area.getStrokes();
    (store.dispatch as ThunkDispatch)(
      storeData({
        id: parseInt(this.paintingId),
        dataUrl: this.area.toImage(),
        strokes,
      })
    );
  }

  private async navigateBack(): Promise<void> {
    await this.storeStroke();
    (store.dispatch as ThunkDispatch)(unloadData());
  }

  private colorChanged(e: CustomEvent): void {
    this.colorCode = e.detail.code;
  }
}
