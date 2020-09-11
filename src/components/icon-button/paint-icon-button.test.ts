import {IconButton} from './paint-icon-button';
import {fixture, html, oneEvent} from '@open-wc/testing';
import {firePointerEvent} from '../../test/pointerevents';

const expect = chai.expect;
describe('paint-icon-button', () => {
  it('is defined', () => {
    const el = document.createElement('paint-icon-button');
    expect(el).to.be.an.instanceof(IconButton);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html`<paint-icon-button></paint-icon-button>`
    );
    expect(element).shadowDom.to.equalSnapshot();
  });

  it('renders correctly when active and with slot', async () => {
    const element = await fixture(
      html`<paint-icon-button active>Foo</paint-icon-button>`
    );
    expect(element).shadowDom.to.equalSnapshot();
    expect(element).lightDom.to.equalSnapshot();
  });

  it('renders correctly after pointerdown', async () => {
    const element = await fixture(
      html`<paint-icon-button></paint-icon-button>`
    );
    await firePointerEvent(element, ['down']);
    expect(element).shadowDom.to.equalSnapshot();
  });

  it('renders correctly after pointerdown and up', async () => {
    const element = await fixture(
      html`<paint-icon-button></paint-icon-button>`
    );
    await firePointerEvent(element, ['down', 'up']);
    expect(element).shadowDom.to.equalSnapshot();
  });

  it('fires event after pointer up', async () => {
    const el = await fixture(html`<paint-icon-button></paint-icon-button>`);
    firePointerEvent(el, ['down', 'up']);
    const {detail} = await oneEvent(el, 'icon-clicked');
    expect(detail).to.be.not.undefined;
  });
});
