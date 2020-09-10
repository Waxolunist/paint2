import {ColorToolbar} from './paint-color-toolbar';

//import {fixture, html} from '@open-wc/testing';
const expect = chai.expect;
describe('paint-color-toolbar', () => {
  it('is defined', () => {
    const el = document.createElement('paint-color-toolbar');
    expect(el).to.be.an.instanceof(ColorToolbar);
  });

  /*
  test('renders with default values', async () => {
    const el = await fixture(html`<my-element></my-element>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('renders with a set name', async () => {
    const el = await fixture(html`<my-element name="Test"></my-element>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, Test!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('handles a click', async () => {
    const el = (await fixture(html`<my-element></my-element>`)) as MyElement;
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 1</button>
      <slot></slot>
    `
    );
  });
  */
});
