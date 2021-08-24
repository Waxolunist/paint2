import {fireClickEvent, firePointerEvent} from '../../test/pointerevents';
import {fixture, html, oneEvent} from '@open-wc/testing';
import {IconButton} from './paint-icon-button';

describe('paint-icon-button', () => {
  it('is defined', () => {
    const el = document.createElement('paint-icon-button');
    expect(el).toBeInstanceOf(IconButton);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html` <paint-icon-button></paint-icon-button>`
    );
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('renders correctly when active and with slot', async () => {
    const element = await fixture(
      html` <paint-icon-button active>Foo</paint-icon-button>`
    );
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('renders correctly after pointerdown', async () => {
    const element = await fixture(
      html` <paint-icon-button></paint-icon-button>`
    );
    await firePointerEvent(element, ['down']);
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('renders correctly after pointerdown and up', async () => {
    const element = await fixture(
      html` <paint-icon-button></paint-icon-button>`
    );
    await firePointerEvent(element, ['down', 'up']);
    expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
  });

  it('fires event after pointer up', async () => {
    const el = await fixture(html` <paint-icon-button></paint-icon-button>`);
    fireClickEvent(el);
    const {detail} = await oneEvent(el, 'icon-clicked');
    expect(detail).not.toBeUndefined();
  });
});
