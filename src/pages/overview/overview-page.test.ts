import {html} from 'lit-html';
import {OverviewPage} from './overview-page';
import {elementUpdated, fixture} from '@open-wc/testing';
import {PaintingImpl} from '../../ducks/paint-model';

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

  it('renders correctly with paintings', async () => {
    const element: OverviewPage = await fixture(
      html`<paint-overview-page></paint-overview-page>`
    );
    element.paintings = [new PaintingImpl(), new PaintingImpl()];
    await elementUpdated(element);
    expect(element.shadowRoot?.innerHTML).toMatchSnapshot();
    expect(
      element.shadowRoot?.querySelectorAll('paint-paint-button')
    ).toHaveLength(2);
  });
});
