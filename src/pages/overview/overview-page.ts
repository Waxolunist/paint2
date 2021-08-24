import {LitElement, html, css, CSSResult, TemplateResult} from 'lit';
import {customElement, property, queryAll} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';
import '../../components/new-paint-button/new-paint-button';
import '../../components/paint-button/paint-button';
import '../../components/icon-button/paint-icon-button';
import {closeIcon, shareIcon} from './icons';
import store from '../../store';
import {connect} from 'pwa-helpers/connect-mixin';
import {Painting, PaintState, defaultDataUrl} from '../../ducks/paint-model';
import {repeat} from 'lit/directives/repeat.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {
  loadData,
  newPainting,
  ThunkDispatch,
  removePainting,
} from '../../ducks/paint';
import {toFileExtension, dataURLtoBlob} from '../../ducks/paint-utils';
import {RouterState} from 'lit-redux-router/lib/reducer';
import {AnimatedStyles} from '../../styles/shared-styles';

interface PaintingAnimationData {
  id: number;
  index: number;
  clientRect: DOMRect;
}

@customElement('paint-overview-page')
export class OverviewPage extends connect(store)(LitElement) {
  @queryAll('paint-paint-button')
  paintingButtons?: NodeList;

  private currentPaintingClientRects: PaintingAnimationData[] = [];

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

  updated(changedProperties: Map<string, Painting[]>): void {
    if (this.paintingDeleted(changedProperties.get('paintings'))) {
      this.updateComplete.then(this.animatePaintings);
    }
  }

  static styles: CSSResult[] = [
    //language=CSS
    AnimatedStyles,
    css`
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
        transition-property: transform;
        will-change: transform;
      }

      .painting.translate {
        transform: translate(0px, 0px);
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
    `,
  ];

  render(): TemplateResult {
    return html`
      <div class="paintings">
        <paint-new-paint-button
          class="painting translate"
          @paint-clicked="${this.newPainting}"
        ></paint-new-paint-button>
        ${repeat(
          this.paintings,
          (painting, index) =>
            html`<paint-paint-button
              class="painting translate"
              data-id="${ifDefined(painting.id)}"
              style="${styleMap(
                this.calculateTranslateProperty(index, painting.id)
              )}"
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

  private newPainting = (): void => {
    (<ThunkDispatch>store.dispatch)(newPainting());
  };

  private openPainting = (id?: number | string) => (): void => {
    (<ThunkDispatch>store.dispatch)(loadData(id));
  };

  private removePainting =
    (id?: number | string) => async (): Promise<void> => {
      this.currentPaintingClientRects = [];
      this.paintingButtons?.forEach((node, index) => {
        this.currentPaintingClientRects.push({
          id: this.paintings[index].id ?? 0,
          index: index,
          clientRect: (node as HTMLElement).getBoundingClientRect(),
        });
      });
      this.removeAnimatedClass();
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
    const painting: Painting | undefined = store
      .getState()
      .paint.paintings.find((p) => p.id == id);
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
          url: '/',
        });
      } catch (error) {
        console.error('Sharing failed', error);
      }
    }
  };

  private paintingDeleted = (oldVal: Painting[] = []): boolean =>
    !!oldVal && oldVal.length > this.paintings.length;

  private calculateTranslateProperty = (
    index: number,
    id?: number
  ): {[name: string]: string} => {
    const dataWithIndexAndId = this.currentPaintingClientRects.find(
      (p) => p.index === index && p.id === id
    );
    if (dataWithIndexAndId || this.currentPaintingClientRects.length === 0) {
      return {transform: 'translate(0px, 0px)'};
    }
    const dataWithIdIndex = this.currentPaintingClientRects.findIndex(
      (p) => p.id === id
    );
    const current = this.currentPaintingClientRects[dataWithIdIndex];
    const predeccessor = this.currentPaintingClientRects[dataWithIdIndex - 1];
    if (current && predeccessor) {
      const translateX = current.clientRect.x - predeccessor.clientRect.x;
      const translateY = current.clientRect.y - predeccessor.clientRect.y;
      return {transform: `translate(${translateX}px, ${translateY}px)`};
    }
    return {transform: 'translate(0px, 0px)'};
  };

  private animatePaintings = (): void => {
    this.paintingButtons?.forEach((node, index) => {
      const htmlel = node as HTMLElement;
      setTimeout(
        () =>
          requestAnimationFrame(() => {
            htmlel.style.transform = 'translate(0px, 0px)';
            htmlel.classList.add('animated');
          }),
        Math.min(200 + index * 50, 700)
      );
    });
  };

  private removeAnimatedClass = (): void => {
    this.paintingButtons?.forEach((node) =>
      (node as HTMLElement).classList.remove('animated')
    );
  };
}
