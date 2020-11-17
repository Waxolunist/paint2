export class PointerEventCoalescor {
  #pointerIds: Set<number> = new Set();

  #pointerEvents: PointerEvent[] = [];

  public eventAdd = (e: PointerEvent): void => {
    this.#pointerEvents.push(e);
    this.#pointerIds.add(e.pointerId);
  };

  public eventRemove = (e: PointerEvent): void => {
    this.#pointerIds.delete(e.pointerId);
    if (!this.#pointerIds.size) {
      this.#pointerEvents = [];
    }
  };

  public clear = (): void => {
    this.#pointerIds.clear();
    this.#pointerEvents = [];
  };

  public getCoalescedEvents = (): PointerEvent[] => [...this.#pointerEvents];
}
