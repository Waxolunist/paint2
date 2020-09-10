type pointerevents = 'down' | 'up';

export const firePointerEvent = async (
  el: Element,
  events: Array<pointerevents> | pointerevents = 'down',
  querySelector = ':first-child',
  pointerId = 1
) => {
  const fire = (event: string) =>
    setTimeout(() =>
      el
        .shadowRoot!.querySelector(querySelector)!
        .dispatchEvent(new PointerEvent(`pointer${event}`, {pointerId}))
    );

  if (events instanceof String) {
    fire(<string>events);
  } else {
    (<Array<pointerevents>>events).forEach(fire);
  }
};
