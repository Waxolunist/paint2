declare module 'web-worker:*' {
  const WokerFactory: new () => Worker;
  export default WokerFactory;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PointerEvent {
  getCoalescedEvents(): PointerEvent[];
}

interface LitRouteElement {
  /** @attr */
  path: string;
  resolve: () => void;
  /** @attr */
  component: string;
  /** @attr */
  loading?: string;
}

interface ShareData {
  text?: string;
  title?: string;
  url?: string;
  files?: File[];
}

interface HTMLElementEventMap {
  'MDCSnackbar:opened': CustomEvent<unknown>;
  'MDCSnackbar:closed': CustomEvent<{reason: string}>;
}
