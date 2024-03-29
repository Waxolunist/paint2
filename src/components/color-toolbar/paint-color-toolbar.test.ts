import {fixture, html, oneEvent} from '@open-wc/testing-helpers';
import {cleanHTML} from '../../test/htmlutils';
import {colors} from './colors';
import {ColorToolbar} from './paint-color-toolbar';
import {fireClickEvent} from '../../test/pointerevents';

describe('paint-color-toolbar', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1234567890123456);
  });

  it('is defined', () => {
    const el = document.createElement('paint-color-toolbar');
    expect(el).toBeInstanceOf(ColorToolbar);
  });

  it('renders correctly', async () => {
    const element = await fixture(
      html` <paint-color-toolbar></paint-color-toolbar>`
    );
    expect(cleanHTML(element)).toMatchSnapshot();
  });

  it('renders correctly with predefined active color', async () => {
    const element = await fixture(
      html` <paint-color-toolbar
        activeColor="${colors[1]}"
      ></paint-color-toolbar>`
    );
    expect(cleanHTML(element)).toMatchSnapshot();
  });

  it('fires event on color change', async () => {
    const el = await fixture(
      html` <paint-color-toolbar
        activeColor="${colors[0]}"
      ></paint-color-toolbar>`
    );
    expect((<ColorToolbar>el).activeColor).toEqual(colors[0]);
    const colorButton = el.shadowRoot!.querySelector(
      `paint-icon-button[data-color-code="${colors[1]}"]`
    )!;
    fireClickEvent(colorButton);
    const {detail} = await oneEvent(el, 'color-changed', false);
    expect(detail.code).toEqual(colors[1]);
    expect((<ColorToolbar>el).activeColor).toEqual(detail.code);
  });
});
