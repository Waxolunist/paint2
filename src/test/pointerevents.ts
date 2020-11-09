type pointerevents = 'down' | 'up';

const getElement = (el: Element, querySelector: string): HTMLElement | null =>
  el.shadowRoot!.querySelector(querySelector);

const dispatchEvent = (
  el: Element,
  querySelector: string,
  event: Event
): boolean | undefined => getElement(el, querySelector)?.dispatchEvent(event);

export const firePointerEvent = async (
  el: Element,
  events: Array<pointerevents> | pointerevents = 'down',
  querySelector = ':first-child',
  pointerId = 1
): Promise<void> => {
  const fire = (event: string, cb: (() => void) | undefined): number =>
    setTimeout(() => {
      dispatchEvent(
        el,
        querySelector,
        new PointerEvent(`pointer${event}`, {pointerId}) as Event
      );
      if (cb) cb();
    });

  return new Promise((resolve) => {
    if (events instanceof String) {
      fire(<string>events, resolve);
    } else {
      (<Array<pointerevents>>events).forEach((e, idx, arr) =>
        fire(e, idx === arr.length - 1 ? resolve : undefined)
      );
    }
  });
};

export const fireClickEvent = async (
  el: Element,
  querySelector = ':first-child'
): Promise<void> => {
  const fire = (cb: (() => void) | undefined): number =>
    setTimeout(() => {
      dispatchEvent(el, querySelector, new MouseEvent('click'));
      if (cb) cb();
    });

  return new Promise((resolve) => {
    fire(resolve);
  });
};
