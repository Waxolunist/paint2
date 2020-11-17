import {PointerEventCoalescor} from './pointer-event-coalescor';

describe('PointerEventCoalescor', () => {
  it('constructor', () => {
    const coalescor = new PointerEventCoalescor();
    expect(coalescor.getCoalescedEvents().length).toEqual(0);
  });

  it('add points', () => {
    const coalescor = new PointerEventCoalescor();
    coalescor.eventAdd({pointerId: 1} as PointerEvent);
    coalescor.eventAdd({pointerId: 1} as PointerEvent);
    coalescor.eventAdd({pointerId: 2} as PointerEvent);
    expect(coalescor.getCoalescedEvents().length).toEqual(3);
  });

  it('remove pointerIds', () => {
    const coalescor = new PointerEventCoalescor();
    coalescor.eventAdd({pointerId: 1} as PointerEvent);
    coalescor.eventAdd({pointerId: 1} as PointerEvent);
    coalescor.eventAdd({pointerId: 2} as PointerEvent);
    coalescor.eventRemove({pointerId: 2} as PointerEvent);
    expect(coalescor.getCoalescedEvents().length).toEqual(3);
  });

  it('clear', () => {
    const coalescor = new PointerEventCoalescor();
    coalescor.eventAdd({pointerId: 1} as PointerEvent);
    coalescor.eventAdd({pointerId: 1} as PointerEvent);
    coalescor.eventAdd({pointerId: 2} as PointerEvent);
    coalescor.clear();
    expect(coalescor.getCoalescedEvents().length).toEqual(0);
  });
});
