import {customElement, LitElement, html, css, property} from 'lit-element';
import '../../components/new-paint-button/new-paint-button';
import '../../components/paint-button/paint-button';
import '../../components/icon-button/paint-icon-button';
import {closeIcon, shareIcon} from './icons';
import store from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {Painting, PaintState} from '../../ducks/paint-model';
import {repeat} from 'lit-html/directives/repeat';
import {
  loadData,
  newPainting,
  ThunkDispatch,
  removePainting,
} from '../../ducks/paint';
import {RouterState} from 'lit-redux-router/lib/reducer';

@customElement('paint-overview-page')
export class OverviewPage extends connect(store)(LitElement) {
  @property()
  paintings: Painting[] = [];

  stateChanged({router, paint}: {router: RouterState; paint: PaintState}) {
    if (router.routes['/'].active) this.paintings = paint.paintings;
  }

  static get styles() {
    // language=CSS
    return css`
      :host {
        display: block;
        background-color: #91b5ff;
        padding: 1.5em;
        /* prettier-ignore */
        min-width: calc((var(--painting-width) / var(--painting-scalefactor) + var(--painting-margin)) * 2);
      }

      .paintings {
        display: grid;
        grid-gap: var(--painting-margin);
        grid-template-columns: repeat(
          auto-fit,
          calc(var(--painting-width) / var(--painting-scalefactor))
        );
        justify-content: center;
      }

      .painting {
        width: calc(var(--painting-width) / var(--painting-scalefactor));
        height: calc(var(--painting-height) / var(--painting-scalefactor));
        position: relative;
      }

      @media screen and (max-width: 400px) {
        :host {
          padding: 1.5em 0;
          --painting-margin: 1em;
        }

        .paintings {
          grid-gap: var(--painting-margin);
        }
      }
    `;
  }

  render() {
    return html`
      <div class="paintings">
        <paint-new-paint-button
          class="painting"
          @paint-clicked="${this.newPainting}"
        ></paint-new-paint-button>
        ${repeat(
          this.paintings,
          (painting) =>
            html`<paint-paint-button
              class="painting"
              @paint-clicked="${this.openPainting(painting.id)}"
              imageUrl="${painting.blobUrl}"
            >
              <paint-icon-button
                slot="addons"
                @icon-clicked="${this.removePainting(painting.id)}"
                >${closeIcon}</paint-icon-button
              >
              <paint-icon-button
                slot="addons"
                @icon-clicked="${this.sharePainting(painting.id)}"
                >${shareIcon}</paint-icon-button
              >
            </paint-paint-button>`
        )}
      </div>
    `;
  }

  private newPainting() {
    (store.dispatch as ThunkDispatch)(newPainting());
  }

  private openPainting = (id?: number | string) => () => {
    (store.dispatch as ThunkDispatch)(loadData(id));
  };

  private removePainting = (id?: number | string) => () => {
    (store.dispatch as ThunkDispatch)(removePainting(id));
  };

  private sharePainting = (id?: number | string) => (e: CustomEvent) => {
    console.log(`${id}: ${e}`);
  };
}
