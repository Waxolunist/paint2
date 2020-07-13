declare module 'web-worker:*' {
  const WokerFactory: new () => Worker;
  export default WokerFactory;
}

interface PointerEvent {
  getCoalescedEvents(): PointerEvent[];
}
