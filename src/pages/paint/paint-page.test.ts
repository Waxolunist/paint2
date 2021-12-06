import {fixture, html} from '@open-wc/testing-helpers';

import {cleanHTML} from '../../test/htmlutils';
import {PaintPage} from './paint-page';

describe('paint-page', () => {
  it('is defined', () => {
    const el = document.createElement('paint-paint-page');
    expect(el).toBeInstanceOf(PaintPage);
  });

  it('renders correctly', async () => {
    const element = await fixture(html`<paint-paint-page></paint-paint-page>`);
    expect(cleanHTML(element)).toMatchSnapshot();
  });
});
