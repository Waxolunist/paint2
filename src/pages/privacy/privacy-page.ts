import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  TemplateResult,
} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
import store from '../../store';
import {arrowBack} from '../paint/icons';
import {navigate} from 'lit-redux-router';
import '../../components/icon-button/paint-icon-button';

@customElement('paint-privacy-page')
export class PrivacyPage extends connect(store)(LitElement) {
  render(): TemplateResult {
    return html`
      <section>
        <h2>Privacy policy</h2>
        <p>The app paint.v-collaborate.com is operated by Christian Sterzl.</p>
        <p>
          I collect information that your browser sends whenever you visit my
          Service ("Log Data"). This Log Data may include information such as
          your computer's Internet Protocol ("IP") address, browser type,
          browser version, the pages of our Service that you visit, the time and
          date of your visit, the time spent on those pages and other
          statistics.
          <br />
          The security of your Personal Information is important to me, but
          remember that no method of transmission over the Internet, or method
          of electronic storage is 100% secure. While I strive to use
          commercially acceptable means to protect your Personal Information, I
          cannot guarantee its absolute security.
          <br />
          The Service may contain links to other sites that are not operated by
          me. If you click on a third party link, you will be directed to that
          third party's site. I strongly advise you to review the Privacy Policy
          of every site you visit.
          <br />
          I have no control over, and assume no responsibility for the content,
          privacy policies or practices of any third party sites or services.
          <br />
          If you have any questions about this Privacy Policy, please contact me
          at christian.sterzl+paint[at]gmail.com.
        </p>
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

      em {
        text-decoration: underline;
      }
    `;
  }

  private navigateBack(): void {
    store.dispatch(navigate('/'));
  }
}
