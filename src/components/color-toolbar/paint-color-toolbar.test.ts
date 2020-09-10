import {ColorToolbar} from './paint-color-toolbar';
import {fixture, html, oneEvent} from '@open-wc/testing';
import {colors} from './colors';
import {firePointerEvent} from '../../test/pointerevents';

const expect = chai.expect;
describe('paint-color-toolbar', () => {
  it('is defined', () => {
    const el = document.createElement('paint-color-toolbar');
    expect(el).to.be.an.instanceof(ColorToolbar);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      `<paint-color-toolbar></paint-color-toolbar>`
    );
    expect(element).shadowDom.to.equalSnapshot();
  });

  it('fires event on color change', async () => {
    const el = await fixture(
      html`<paint-color-toolbar
        activeColor="${colors[0]}"
      ></paint-color-toolbar>`
    );
    const colorButton = el.shadowRoot!.querySelector(
      `paint-icon-button[data-color-code="${colors[1]}"]`
    )!;
    firePointerEvent(colorButton, ['down', 'up']);
    const {detail} = await oneEvent(el, 'color-changed');
    expect(detail.code).to.equal(colors[1]);
  });
});
