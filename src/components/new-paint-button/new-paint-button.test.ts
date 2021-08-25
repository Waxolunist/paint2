import {fireClickEvent, firePointerEvent} from '../../test/pointerevents';
import {fixture, html, oneEvent} from '@open-wc/testing';
import {cleanHTML} from '../../test/htmlutils';
import {NewPaintButton} from './new-paint-button';

describe('new-paint-button', () => {
  it('is defined', () => {
    const el = document.createElement('paint-new-paint-button');
    expect(el).toBeInstanceOf(NewPaintButton);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html` <paint-new-paint-button></paint-new-paint-button>`
    );
    expect(cleanHTML(element)).toMatchSnapshot();
  });

  it('renders correctly after pointerdown', async () => {
    const element = await fixture(
      html` <paint-new-paint-button></paint-new-paint-button>`
    );
    await firePointerEvent(element, ['down']);
    expect(cleanHTML(element)).toMatchSnapshot();
  });

  it('renders correctly after pointerdown and up', async () => {
    const element = await fixture(
      html` <paint-new-paint-button></paint-new-paint-button>`
    );
    await firePointerEvent(element, ['down', 'up']);
    expect(cleanHTML(element)).toMatchSnapshot();
  });

  it('fires event after pointer up', async () => {
    const el = await fixture(
      html` <paint-new-paint-button></paint-new-paint-button>`
    );
    fireClickEvent(el.shadowRoot!.querySelector('paint-paint-button')!);
    const {detail} = await oneEvent(el, 'paint-clicked');
    expect(detail).not.toBeUndefined();
  });
});
