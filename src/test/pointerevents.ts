type pointerevents = 'down' | 'up';

export const firePointerEvent = async (
  el: Element,
  events: Array<pointerevents> | pointerevents = 'down',
  querySelector = ':first-child',
  pointerId = 1
): Promise<void> => {
  const fire = (event: string, cb: (() => void) | undefined): number =>
    setTimeout(() => {
      el.shadowRoot!.querySelector(querySelector)!.dispatchEvent(
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
