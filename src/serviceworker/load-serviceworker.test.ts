import {fixture, html} from '@open-wc/testing';
import {renderSnackbar} from './load-serviceworker';

describe('overview-page', () => {
  it('renders correctly', async () => {
    const placeholderelement = await fixture(html`<div id="snackbar"></div>`);
    await renderSnackbar('snackbar');
    expect(placeholderelement!.innerHTML).toMatchSnapshot();
  });

  it('open', async () => {
    await fixture(html`<div><div id="snackbar"></div></div>`);
    const snackbar = await renderSnackbar('snackbar');
    expect(snackbar?.open).toBeFalsy();
    snackbar?.show();
    expect(snackbar?.open).toBeTruthy();
  });
});
