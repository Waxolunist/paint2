import {fireClickEvent, firePointerEvent} from '../../test/pointerevents';
import {fixture, html, oneEvent} from '@open-wc/testing-helpers';
import {cleanHTML} from '../../test/htmlutils';
import {PaintButton} from './paint-button';

describe('paint-button', () => {
  it('is defined', () => {
    const el = document.createElement('paint-paint-button');
    expect(el).toBeInstanceOf(PaintButton);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html` <paint-paint-button></paint-paint-button>`
    );
    expect(cleanHTML(element)).toMatchSnapshot();
  });

  it('renders correctly after pointerdown', async () => {
    const element = await fixture(
      html` <paint-paint-button></paint-paint-button>`
    );
    await firePointerEvent(element, ['down']);
    expect(cleanHTML(element)).toMatchSnapshot();
  });

  it('renders correctly after pointerdown and up', async () => {
    const element = await fixture(
      html` <paint-paint-button></paint-paint-button>`
    );
    await firePointerEvent(element, ['down', 'up']);
    expect(cleanHTML(element)).toMatchSnapshot();
  });

  it('fires event after click', async () => {
    const el = await fixture(html` <paint-paint-button></paint-paint-button>`);
    fireClickEvent(el);
    const {detail} = await oneEvent(el, 'paint-clicked');
    expect(detail).not.toBeUndefined();
  });
});
