import {fixture, html, oneEvent} from '@open-wc/testing';
import {firePointerEvent} from '../../test/pointerevents';
import {NewPaintButton} from './new-paint-button';

const expect = chai.expect;
describe('new-paint-button', () => {
  it('is defined', () => {
    const el = document.createElement('paint-new-paint-button');
    expect(el).to.be.an.instanceof(NewPaintButton);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html`<paint-new-paint-button></paint-new-paint-button>`
    );
    expect(element).shadowDom.to.equalSnapshot();
  });

  it('renders correctly after pointerdown', async () => {
    const element = await fixture(
      html`<paint-new-paint-button></paint-new-paint-button>`
    );
    await firePointerEvent(element, ['down']);
    expect(element).shadowDom.to.equalSnapshot();
  });

  it('renders correctly after pointerdown and up', async () => {
    const element = await fixture(
      html`<paint-new-paint-button></paint-new-paint-button>`
    );
    await firePointerEvent(element, ['down', 'up']);
    expect(element).shadowDom.to.equalSnapshot();
  });

  it('fires event after pointer up', async () => {
    const el = await fixture(
      html`<paint-new-paint-button></paint-new-paint-button>`
    );
    firePointerEvent(el.shadowRoot!.querySelector('paint-paint-button')!, [
      'down',
      'up',
    ]);
    const {detail} = await oneEvent(el, 'paint-clicked');
    expect(detail).to.be.not.undefined;
  });
});
