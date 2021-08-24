import '../../components/icon-button/paint-icon-button';
import {css, CSSResult, html, LitElement, TemplateResult} from 'lit';
import {arrowBack} from '../paint/icons';
import {connect} from 'pwa-helpers/connect-mixin';
import {customElement} from 'lit/decorators.js';
import {navigate} from 'lit-redux-router';
import store from '../../store';

@customElement('paint-about-page')
export class AboutPage extends connect(store)(LitElement) {
  render(): TemplateResult {
    return html`
      <section>
        <h2>Paints For Kids</h2>
        <p>
          <em>Paint for Kids</em> is a free paint app, with no ads and no
          tracking code. No cookies or whatsoever are used to track you or the
          usage of the app. No data about users or devices are collected. I only
          count the number of downloads. It can be installed on most devices, by
          just adding it to the home screen. The app works offline. It is
          mulittouch compatible.
        </p>
        <p>
          Main goal of this app is having fun with painting. Even little kids
          should have no problems using it and parents should not have any
          privacy concerns letting them.
        </p>
        <p>Use a touch screen compatible pen for the best user experience.</p>
        <p>
          Half of the revenue will go to charity. Twice a year I will publish
          here the revenue numbers, my expenses and which charity facilities I
          support.
        </p>
        <p>
          If you have any issues with the app or want to see new features, just
          create an github issue please.
        </p>
        <dl>
          <dt>Github</dt>
          <dd>
            <a href="https://github.com/Waxolunist/paint2" target="_blank"
              >Waxolunist/paint2</a
            >
          </dd>
          <dt>About the author</dt>
          <dd>
            <a href="https://christian.sterzl.info" target="_blank"
              >Christian Sterzl</a
            >
          </dd>
        </dl>
        <dl class="opsinfo">
          <dt>Version</dt>
          <dd>${window.process.env.VERSION}</dd>
          <dt>Build</dt>
          <dd>${window.process.env.BUILDID}</dd>
          <dt>Commit</dt>
          <dd>${window.process.env.COMMITID}</dd>
          <dt>Environment</dt>
          <dd>${window.process.env.NODE_ENV}</dd>
        </dl>
        <p class="back-button">
          <paint-icon-button
            class="back-button"
            @icon-clicked="${this.navigateBack}"
          >
            ${arrowBack}
          </paint-icon-button>
        </p>
      </section>
    `;
  }

  static get styles(): CSSResult {
    // language=CSS
    return css`
      :host {
        display: block;
        padding: 2em;
      }

      p.back-button {
        display: flex;
        justify-content: center;
      }

      paint-icon-button.back-button {
        --icon-size: 100px;
        width: 100px;
        height: 100px;
      }

      section {
        font-family: system-ui, sans-serif;
        font-size: large;
      }

      dt {
        font-weight: bold;
      }

      em {
        text-decoration: underline;
      }

      .opsinfo {
        font-size: smaller;
      }
    `;
  }

  private navigateBack(): void {
    store.dispatch(navigate('/'));
  }
}
