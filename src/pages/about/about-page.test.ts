import {fixture, html} from '@open-wc/testing-helpers';
import {AboutPage} from './about-page';
import {cleanHTML} from '../../test/htmlutils';

describe('about-page', () => {
  it('is defined', () => {
    const el = document.createElement('paint-about-page');
    expect(el).toBeInstanceOf(AboutPage);
  });

  it('renders correctly', async () => {
    const element = await fixture(html`<paint-about-page></paint-about-page>`);
    expect(cleanHTML(element)).toMatchSnapshot();
  });
});
