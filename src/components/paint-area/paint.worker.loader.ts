import {getWorkerUrl} from '../../utils/esbuild-utils';

export const getPaintWorker = (): Worker =>
  new Worker(new URL(getWorkerUrl('paint'), import.meta.url), {type: 'module'});
