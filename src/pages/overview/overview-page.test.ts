import {elementUpdated, fixture, html} from '@open-wc/testing';
import {cleanHTML} from '../../test/htmlutils';
import {OverviewPage} from './overview-page';
import {PaintingImpl} from '../../ducks/paint-model';

describe('overview-page', () => {
  it('is defined', () => {
    const el = document.createElement('paint-overview-page');
    expect(el).toBeInstanceOf(OverviewPage);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html` <paint-overview-page></paint-overview-page>`
    );
    expect(cleanHTML(element)).toMatchSnapshot();
  });

  it('renders correctly with paintings', async () => {
    const element: OverviewPage = await fixture(
      html` <paint-overview-page></paint-overview-page>`
    );
    element.paintings = [new PaintingImpl(), new PaintingImpl()];
    await elementUpdated(element);
    expect(cleanHTML(element)).toMatchSnapshot();
    expect(
      element.shadowRoot?.querySelectorAll('paint-paint-button')
    ).toHaveLength(2);
  });
});
