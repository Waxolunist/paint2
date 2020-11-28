import {
  customElement,
  LitElement,
  html,
  css,
  property,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import '../../components/new-paint-button/new-paint-button';
import '../../components/paint-button/paint-button';
import '../../components/icon-button/paint-icon-button';
import {closeIcon, shareIcon} from './icons';
import store from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {Painting, PaintState, defaultDataUrl} from '../../ducks/paint-model';
import {repeat} from 'lit-html/directives/repeat';
import {
  loadData,
  newPainting,
  ThunkDispatch,
  removePainting,
} from '../../ducks/paint';
import {toFileExtension, dataURLtoBlob} from '../../ducks/paint-utils';
import {RouterState} from 'lit-redux-router/lib/reducer';

@customElement('paint-overview-page')
export class OverviewPage extends connect(store)(LitElement) {
  @property({type: Array, attribute: false})
  paintings: Painting[] = [];

  stateChanged({
    router,
    paint,
  }: {
    router: RouterState;
    paint: PaintState;
  }): void {
    if (router.routes['/']?.active) this.paintings = paint.paintings;
  }

  static get styles(): CSSResult {
    // language=CSS
    return css`
      :host {
        display: block;
        background-color: #91b5ff;
        padding: 1.5em 0;
        /* prettier-ignore */
        min-width: calc((var(--painting-width) / var(--painting-scalefactor) + var(--painting-margin)) * 2);
        position: relative;
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

      .about {
        position: absolute;
        bottom: -2em;
        padding: 1em;
        font-size: large;
        font-family: monospace;
        font-weight: bold;
      }

      .about a {
        color: #ffffef;
      }

      @media screen and (max-width: 400px) {
        :host {
          padding: 1.5em 0;
          --painting-margin: 1em;
        }

        .paintings {
          --painting-scalefactor: 1.3;
          grid-column-gap: 1.3em;
          grid-row-gap: 1.3em;
        }
      }
    `;
  }

  render(): TemplateResult {
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
                role="button"
                slot="addons"
                class="delete"
                @icon-clicked="${this.removePainting(painting.id)}"
                >${closeIcon}</paint-icon-button
              >
              ${this.canShare()
                ? html`<paint-icon-button
                    slot="addons"
                    role="button"
                    class="share"
                    @icon-clicked="${this.sharePainting(painting.id)}"
                    >${shareIcon}</paint-icon-button
                  >`
                : ''}
            </paint-paint-button>`
        )}
      </div>
      <div class="about"><a href="/about">About this app</a></div>
    `;
  }

  private newPainting(): void {
    (<ThunkDispatch>store.dispatch)(newPainting());
  }

  private openPainting = (id?: number | string) => (e: CustomEvent): void => {
    const domRect = (<HTMLElement>e.target).getBoundingClientRect();
    this.dispatchEvent(
      new CustomEvent('button-clicked', {
        detail: {
          domRect,
        },
        bubbles: true,
        composed: true,
      })
    );
    (<ThunkDispatch>store.dispatch)(loadData(id));
  };

  private removePainting = (id?: number | string) => (): void => {
    (<ThunkDispatch>store.dispatch)(removePainting(id));
  };

  private canShare = (): boolean | undefined => {
    const blob = dataURLtoBlob(defaultDataUrl);
    return (
      navigator.canShare &&
      navigator.canShare({
        files: [
          new File([blob], `test.${toFileExtension(blob.type)}`, {
            type: blob.type,
          }),
        ],
      })
    );
  };

  private sharePainting = (id?: number | string) => async (): Promise<void> => {
    const painting:
      | Painting
      | undefined = store.getState().paint.paintings.find((p) => p.id == id);
    if (painting) {
      const request = await fetch(painting.blobUrl);
      const blob = await request.blob();
      try {
        await navigator.share({
          files: [
            new File([blob], `painting.${toFileExtension(blob.type)}`, {
              type: blob.type,
            }),
          ],
          title: 'My Painting',
          text: `Look Ma' what I did.`,
          url: 'myurl',
        });
      } catch (error) {
        console.error('Sharing failed', error);
      }
    }
  };
}
