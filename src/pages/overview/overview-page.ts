import {customElement, LitElement, html, css} from 'lit-element';
import '../../components/new-paint-button/new-paint-button';
import '../../components/paint-button/paint-button';
import '../../components/icon-button/paint-icon-button';
import {closeIcon, shareIcon} from './icons';
import store from '../../store';
import {navigate} from 'lit-redux-router';

@customElement('paint-overview-page')
export class OverviewPage extends LitElement {
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
        <paint-paint-button
          class="painting"
          @paint-clicked="${this.openPainting}"
        >
          <paint-icon-button
            slot="addons"
            @icon-clicked="${this.removePainting}"
            >${closeIcon}</paint-icon-button
          >
          <paint-icon-button slot="addons" @icon-clicked="${this.sharePainting}"
            >${shareIcon}</paint-icon-button
          >
        </paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
        <paint-paint-button class="painting"></paint-paint-button>
      </div>
    `;
  }

  private newPainting(e: CustomEvent) {
    console.log(e);
  }

  private openPainting() {
    store.dispatch(navigate('/paint/3'));
  }

  private removePainting(e: CustomEvent) {
    console.log(e);
  }

  private sharePainting(e: CustomEvent) {
    console.log(e);
  }
}
