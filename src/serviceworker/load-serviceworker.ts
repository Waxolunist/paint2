import {html, render} from 'lit-html';
import {Workbox} from 'workbox-window';
import {TemplateResult} from 'lit-element';
import {Snackbar} from '@material/mwc-snackbar';

declare global {
  interface HTMLElementEventMap {
    'MDCSnackbar:opened': CustomEvent<unknown>;
    'MDCSnackbar:closed': CustomEvent<{reason: string}>;
  }
}

const snackbarTemplate = (): TemplateResult => html`
  <mwc-snackbar
    labelText="A new version is available. Press REFRESH to get the new version."
    timeoutMs="-1"
    stacked
  >
    <mwc-button slot="action">REFRESH</mwc-button>
    <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
  </mwc-snackbar>
`;

export const renderSnackbar = async (
  renderRootId = 'snackbar'
): Promise<Snackbar | null> => {
  await Promise.all([
    import('@material/mwc-snackbar'),
    import('@material/mwc-button'),
    import('@material/mwc-icon-button'),
  ]);
  const renderRoot = document.getElementById(renderRootId) || document.body;
  render(snackbarTemplate(), renderRoot);
  const snackbar: Snackbar | null = renderRoot.querySelector('mwc-snackbar');
  snackbar?.addEventListener(
    'MDCSnackbar:closed',
    (event: CustomEvent<{reason: string}>) => {
      if (event.detail.reason === 'action') window.location.reload();
    }
  );
  return snackbar;
};

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  const wb = new Workbox('/sw.js', {
    scope: new URL(document.baseURI).pathname,
  });

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      renderSnackbar().then((snackbar) => snackbar?.show());
    }
  });

  wb.register();
}
