import {fixture} from '@open-wc/testing';
import {html} from 'lit-html';
import {AboutPage} from './about-page';

describe('about-page', () => {
  it('is defined', () => {
    const el = document.createElement('paint-about-page');
    expect(el).toBeInstanceOf(AboutPage);
  });

  it('renders correctly', async () => {
    const element = await fixture(html`<paint-about-page></paint-about-page>`);
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });
});
