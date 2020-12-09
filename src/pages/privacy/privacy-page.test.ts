import {fixture} from '@open-wc/testing';
import {html} from 'lit-html';
import {PrivacyPage} from './privacy-page';

describe('privacy-page', () => {
  it('is defined', () => {
    const el = document.createElement('paint-privacy-page');
    expect(el).toBeInstanceOf(PrivacyPage);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html`<paint-privacy-page></paint-privacy-page>`
    );
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });
});
