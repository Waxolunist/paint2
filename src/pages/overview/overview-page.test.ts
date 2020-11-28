import {html} from 'lit-html';
import {OverviewPage} from './overview-page';
import {fixture} from '@open-wc/testing';

describe('overview-page', () => {
  it('is defined', () => {
    const el = document.createElement('paint-overview-page');
    expect(el).toBeInstanceOf(OverviewPage);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html`<paint-overview-page></paint-overview-page>`
    );
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });
});
