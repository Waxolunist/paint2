import {fixture, html, oneEvent} from '@open-wc/testing';
import {firePointerEvent} from '../../test/pointerevents';
import {PaintButton} from './paint-button';

describe('paint-button', () => {
  it('is defined', () => {
    const el = document.createElement('paint-paint-button');
    expect(el).toBeInstanceOf(PaintButton);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html`<paint-paint-button></paint-paint-button>`
    );
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('renders correctly after pointerdown', async () => {
    const element = await fixture(
      html`<paint-paint-button></paint-paint-button>`
    );
    await firePointerEvent(element, ['down']);
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('renders correctly after pointerdown and up', async () => {
    const element = await fixture(
      html`<paint-paint-button></paint-paint-button>`
    );
    await firePointerEvent(element, ['down', 'up']);
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('fires event after pointer up', async () => {
    const el = await fixture(html`<paint-paint-button></paint-paint-button>`);
    firePointerEvent(el, ['down', 'up']);
    const {detail} = await oneEvent(el, 'paint-clicked');
    expect(detail).not.toBeUndefined();
  });
});
