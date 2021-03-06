import {fixture, html, oneEvent} from '@open-wc/testing';
import {fireClickEvent, firePointerEvent} from '../../test/pointerevents';
import {NewPaintButton} from './new-paint-button';

describe('new-paint-button', () => {
  it('is defined', () => {
    const el = document.createElement('paint-new-paint-button');
    expect(el).toBeInstanceOf(NewPaintButton);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html`<paint-new-paint-button></paint-new-paint-button>`
    );
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('renders correctly after pointerdown', async () => {
    const element = await fixture(
      html`<paint-new-paint-button></paint-new-paint-button>`
    );
    await firePointerEvent(element, ['down']);
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('renders correctly after pointerdown and up', async () => {
    const element = await fixture(
      html`<paint-new-paint-button></paint-new-paint-button>`
    );
    await firePointerEvent(element, ['down', 'up']);
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('fires event after pointer up', async () => {
    const el = await fixture(
      html`<paint-new-paint-button></paint-new-paint-button>`
    );
    fireClickEvent(el.shadowRoot!.querySelector('paint-paint-button')!);
    const {detail} = await oneEvent(el, 'paint-clicked');
    expect(detail).not.toBeUndefined();
  });
});
