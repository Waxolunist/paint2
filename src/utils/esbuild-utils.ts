/**
 * Helper function to load workers in development mode and in production mode.
 * Workers should end in worker.ts.
 *
 * Call it as follows:
 * @example
 * const worker = new Worker(new URL(getWorkerUrl('./some.worker'), import.meta.url), { type: 'module' });
 *
 * @param baseUrl
 */
export const getWorkerUrl = (name: string, directory = '.'): string => {
  const suffix = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
  const loaddir = process.env.NODE_ENV === 'production' ? '.' : directory;
  return `${loaddir}/${name}.worker.${suffix}`;
};
